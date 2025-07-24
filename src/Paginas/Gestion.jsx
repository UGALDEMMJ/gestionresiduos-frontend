import React, { useState, useEffect } from 'react'
import { supabase } from '../../Supabase/client'
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/axios';

const Gestion = () => {

  const { auth } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [transportes, setTransportes] = useState([]);
  const [generadores, setGeneradores] = useState([]);
  const [gestion, setGestion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    cantidad: '',
    condicion: '',
    fecha_coleccion: '',
    preparacion: '',
    observaciones: '',
    generadorId: '',
    transporteId: '',
    imagen_url: '',
    usuarioId: ''
  });

  useEffect(() => {
    obtenerResiduos();
    obtenerGeneradores();
    obtenerTransportes();
  }, []);

  const obtenerResiduos = async () => {
    const { data: residuos, error } = await clienteAxios.get('/residuo/all');

    if (error) {
      console.log(error);
    } else {
      setData(residuos);
      console.log(residuos);
    }
  };

  const obtenerGeneradores = async () => {
    const { data: generadoresData, error: generadoresError } = await clienteAxios.get('/generador/all');

    if (generadoresError) {
      console.log(generadoresError);
    } else {
      setGeneradores(generadoresData);
    }
  }

  const obtenerTransportes = async () => {
    const { data: transportesData, error: transpportesError } = await clienteAxios.get('/transporte/all');

    if (transpportesError) {
      console.log(transportesData);
    } else {
      setTransportes(transportesData);
    };
  }

  const manejarImagenChange = (e) => {
    setImagen(e.target.files[0]);
  }

  const subirImagen = async () => {
    if (!imagen) {
      setErrorMessage('No se seleccionó ninguna imagen');
      return null;
    }
    // Limpiar el nombre del archivo: solo letras, números, puntos y guiones bajos
    const nombreSeguro = imagen.name;
    const nombreImagen = `${Date.now()}_${nombreSeguro}`;

    const { error } = await supabase.storage
      .from('gestionresiduos')
      .upload(nombreImagen, imagen);

    if (error) {
      console.log(error);
      setErrorMessage('Error al subir la imagen: ' + error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('gestionresiduos')
      .getPublicUrl(nombreImagen);

    return publicUrlData ? publicUrlData.publicUrl : null;
  }

  const eliminarImagen = async (bucketName, imagePath) => {
    if (!imagePath) {
      console.log('No se proporcionó un nombre de archivo para eliminar.');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove([imagePath]);

      if (error) {
        console.error('Error al eliminar la imagen:', error.message);
      } else {
        console.log('Imagen eliminada correctamente:', data);
      }
    } catch (err) {
      console.error('Ocurrió un error inesperado al eliminar la imagen:', err);
    }
  }

  // Función para inicializar el estado del formulario
  const inicializarFormData = () => ({
    tipo: '',
    cantidad: '',
    condicion: '',
    fecha_coleccion: '',
    preparacion: '',
    observaciones: '',
    generadorId: '',
    transporteId: '',
    imagen_url: '',
    usuarioId: ''
  });

  // Función para manejar mensajes de error
  const manejarError = (mensaje) => {
    setErrorMessage(mensaje);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // Función para manejar mensajes de éxito
  const manejarExito = (mensaje) => {
    setSuccessMessage(mensaje);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const manejarEliminar = async (id) => {
    const resultado = confirm('¿Está seguro de eliminar este residuo?');

    if (!resultado) {
      alert('Operación cancelada');
      return;
    }

    const residuo = data.find((item) => item.id === id);
    if (residuo && residuo.imagen_url) {
      const imagePath = residuo.imagen_url.split('/gestionresiduos/')[1];
      console.log('Eliminando imagen:', imagePath);
      await eliminarImagen('gestionresiduos', imagePath);
    }

    const { error } = await clienteAxios.delete(`/residuo/eliminar/${id}`);

    if (error) {
      manejarError('Error al eliminar el residuo: ' + error.message);
    } else {
      alert('Residuo eliminado exitosamente');
      obtenerResiduos();
      setFormData(inicializarFormData());
    }
  };

  const manejarEditar = (item) => {
    setGestion(item);
    setFormData({
      tipo: item.tipo,
      cantidad: item.cantidad,
      condicion: item.condicion,
      fecha_coleccion: item.fecha_coleccion,
      preparacion: item.preparacion,
      observaciones: item.observaciones,
      generadorId: item.generador_id,
      imagen_url: item.imagen_url,
      transporteId: item.transporte_id,
      usuarioId: auth.id
    });
    setEditando(true);
    setIsOpen(true);
  };

  const manejarFormulario = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setCargando(true);

    const nuevaImagenUrl = await subirImagen();
    if (!nuevaImagenUrl) {
      manejarError('Error al subir la imagen');
      setCargando(false);
      return;
    }

    // Convertir fecha a formato ISO
    let fechaColeccionISO = '';
    if (formData.fecha_coleccion?.length === 10) {
      fechaColeccionISO = new Date(formData.fecha_coleccion).toISOString();
    } else {
      fechaColeccionISO = formData.fecha_coleccion;
    }

    const formularioData = {
      ...formData,
      fecha_coleccion: fechaColeccionISO,
      imagen_url: nuevaImagenUrl,
      generadorId: formData.generadorId ? parseInt(formData.generadorId) : null,
      transporteId: formData.transporteId ? parseInt(formData.transporteId) : null,
      usuarioId: auth.id,
    };

    if (editando && gestion) {
      const imagenAnterior = gestion.imagen_url;

      const { error } = await clienteAxios.put(`/residuo/actualizar/${gestion.id}`, formularioData);
      if (error) {
        manejarError('Error al editar el residuo: ' + error.message);
        const imagePath = nuevaImagenUrl.split('/gestionresiduos/')[1];
        await eliminarImagen('gestionresiduos', imagePath);
      } else {
        manejarExito('Residuo editado exitosamente');
        const imagePath = imagenAnterior.split('/gestionresiduos/')[1];
        await eliminarImagen('gestionresiduos', imagePath);
        setEditando(false);
        setGestion(null);
        obtenerResiduos();
        setTimeout(() => {
          setFormData(inicializarFormData());
          setIsOpen(false);
        }, 2000);
      }
    } else {
      const { error } = await clienteAxios.post(`/residuo/crear`, formularioData);
      if (error) {
        manejarError('Error al agregar el residuo: ' + error.message);
        const imagePath = nuevaImagenUrl.split('/gestionresiduos/')[1];
        await eliminarImagen('gestionresiduos', imagePath);
      } else {
        manejarExito('Residuo agregado exitosamente');
        setFormData(inicializarFormData());
        obtenerResiduos();
        setIsOpen(false);
      }
    }

    setCargando(false);
  };

  return (
    <div className="p-4 h-screen">
      <h1 className="text-xl font-bold underline">Residuos</h1>
      <p className='text-lg m-4'>En este espacio puedes agregar, editar y eliminar residuos, presiona el boton para agregar</p>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setIsOpen(true);
            setEditando(false);
          }}
          className="px-6 py-3 bg-green-500 text-white text-2xl rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          Agregar Residuo
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-3xl">
            <h2 className="text-lg font-bold">{editando ? 'Editar' : 'Agregar'} Transporte</h2>
            {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
            <form onSubmit={manejarSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block mb-1">Transporte</label>
                <select
                  name="transporteId"
                  className="border rounded w-full p-2"
                  value={formData.transporteId}
                  onChange={manejarFormulario}
                  required
                >
                  <option value="">--Selecciona un transporte--</option>
                  {transportes.map((transporte) => (
                    <option key={transporte.id} value={transporte.id}>
                      {transporte.via_transporte}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Generador</label>
                <select
                  name="generadorId"
                  className="border rounded w-full p-2"
                  value={formData.generadorId}
                  onChange={manejarFormulario}
                  required
                >
                  <option value="">--Selecciona un generador--</option>
                  {generadores.map((generador) => (
                    <option key={generador.id} value={generador.id}>
                      {generador.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Tipo del material</label>
                <input
                  type="text"
                  name="tipo"
                  placeholder="Vidrio, Plástico, Metal..."
                  className="border rounded w-full p-2"
                  value={formData.tipo}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Condición del material</label>
                <input
                  type="text"
                  name="condicion"
                  placeholder="Limpio, Sucio, Seco..."
                  className="border rounded w-full p-2"
                  value={formData.condicion}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Cantidad del material en kg</label>
                <input
                  type="text"
                  name="cantidad"
                  placeholder="18.5, 0.5..."
                  className="border rounded w-full p-2"
                  value={formData.cantidad}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Fecha de colección</label>
                <input
                  type="date"
                  name="fecha_coleccion"
                  className="border rounded w-full p-2"
                  value={formData.fecha_coleccion}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Preparación del material</label>
                <input
                  type="text"
                  name="preparacion"
                  placeholder='Compactado, Separado...'
                  className="border rounded w-full p-2"
                  value={formData.preparacion}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  placeholder="Observaciones adicionales"
                  className="border rounded w-full p-2"
                  value={formData.observaciones}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Imagen del material</label>
                <input
                  type="file"
                  name="imagen_url"
                  className="border rounded w-full p-2"
                  onChange={manejarImagenChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-black rounded"
                disabled={cargando}
              >
                {editando ? 'Actualizar' : 'Enviar'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-2 px-4 py-2 bg-red-500 text-black rounded"
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 ">
        <h2 className="text-lg font-bold">Residuos Guardados:</h2>
        <div className="mt-4 h-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (

              <div key={item.id} className="bg-white rounded-lg shadow p-4 border">
                {item.imagen_url && (
                  <img
                    src={item.imagen_url}
                    alt={`Imagen de ${item.tipo}`}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl"><span className="font-bold">Id de la colección:</span> {item.id}</h3>
                <p className="text-gray-600">Tipo: {item.tipo}</p>
                <p className="text-gray-600">Cantidad: {item.cantidad} kg</p>
                <p className="text-gray-600">Condición: {item.condicion}</p>
                <p className="text-gray-600">Fecha de colección: {item.fecha_coleccion}</p>
                <p className="text-gray-600">Preparación: {item.preparacion}</p>
                <p className="text-gray-600">Observaciones: {item.observaciones}</p>
                <p className="text-gray-600">
                  <span className="font-bold">Transporte:</span>
                  {item.transporte ? item.transporte.via_transporte : 'No especificado'}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Generador:</span>
                  {item.generadores ? item.generadores.nombre : 'No especificado'}
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => manejarEditar(item)}
                    className="px-2 py-1 bg-green-500 text-black rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => manejarEliminar(item.id)}
                    className="px-2 py-1 bg-red-500 text-black rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gestion