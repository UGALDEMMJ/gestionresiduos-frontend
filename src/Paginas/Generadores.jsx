import React, { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';

const Generadores = () => {
  const { auth } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [generador, setGenerador] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    encargado: '',
    contacto: '',
    descripcion: '',
    usuarioId: '',
  });

  const obtenerGeneradores = async () => {
    const { data: generadores, error } = await clienteAxios.get("/generador/all/");

    if (error) {
      console.log(error);
    } else {
      setData(generadores);
      console.log(generadores);
    }
  };

  const manejarEliminar = async (id) => {

    const resultado = confirm('¿Esta seguro de eliminar este generador?');

    if (!resultado) {
      alert('Operacion cancelada');
      return;
    }
    const { error } = await clienteAxios.delete(`/generador/eliminar/${id}`);

    if (error) {
      setErrorMessage('Error al eliminar el generador: ' + error.message);
    } else {
      alert('Generador eliminado exitosamente');
      obtenerGeneradores();
      setFormData({
        nombre: '',
        encargado: '',
        contacto: '',
        descripcion: '',
        usuarioId: '',
      });
    }
  };

  const manejarEditar = (item) => {
    setGenerador(item);
    setFormData({
      nombre: item.nombre,
      encargado: item.encargado,
      contacto: item.contacto,
      descripcion: item.descripcion,
    });
    setEditando(true);
    setIsOpen(true);
  };

  useEffect(() => {
    obtenerGeneradores();
  }, []);

  const manejarFormulario = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    console.log(auth.id)
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (editando && generador) {
      const { error } = await clienteAxios.put(`/generador/actualizar/${generador.id}`,
         { ...formData, usuarioId: auth.id });

      if (error) {
        setErrorMessage('Error al editar el generador: ' + error.message);
      } else {
        setSuccessMessage('Generador editado exitosamente');
        setEditando(false);
        setGenerador(null);
        obtenerGeneradores();

        setTimeout(() => {
          setFormData({
            nombre: '',
            encargado: '',
            contacto: '',
            descripcion: '',
            usuarioId: '',
          });
          setIsOpen(false);
        }, 2000);

      }

    } else {
      const { error } = await clienteAxios.post(`/generador/crear`, 
        { ...formData, usuarioId: auth.id });
      if (error) {
        setErrorMessage('Error al guardar el generador: ' + error.message);
      } else {
        setSuccessMessage('Generador guardado exitosamente');
        setFormData({
          nombre: '',
          encargado: '',
          contacto: '',
          descripcion: '',
          usuarioId: '',
        });
        obtenerGeneradores();
        setIsOpen(false);
      }
    }

    setTimeout(() => setSuccessMessage(''), 3000);
  };



  return (
    <div className="p-4 h-screen">
      <h1 className="text-xl font-bold underline">Generadores</h1>
      <p className='text-lg m-4'>En este espacio puedes agregar, editar y eliminar generadores, presiona el boton para agregar</p>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setIsOpen(true);
            setEditando(false);
          }}
          className="px-6 py-3 bg-green-500 text-white text-2xl rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          Agregar generadores
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-3xl">
            <h2 className="text-lg font-bold">{editando ? 'Editar' : 'Agregar'} Generador</h2>
            {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
            <form onSubmit={manejarSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre de la organización o empresa"
                  className="border rounded w-full p-2"
                  value={formData.nombre}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Encargado</label>
                <input
                  type="text"
                  name="encargado"
                  placeholder="Nombre del encargado"
                  className="border rounded w-full p-2"
                  value={formData.encargado}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Contacto</label>
                <textarea
                  name="contacto"
                  placeholder="Descripción del generador"
                  className="border rounded w-full p-2"
                  value={formData.contacto}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción del generador"
                  className="border rounded w-full p-2"
                  value={formData.descripcion}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded">
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

      <div className="mt-6">
        <h2 className="text-lg font-bold">Generadores Guardados:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 border">
              <h3 className="text-xl font-semibold">{item.nombre}</h3>
              <p className="text-gray-600">Encargado:<span className="font-medium"> {item.encargado}</span></p>
              <p className="text-gray-600">Descripción:<span className="font-medium"> {item.descripcion}</span></p>
              <p className="text-gray-600">Contacto:<span className="font-medium"> {item.contacto}</span></p>
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
  );
};

export default Generadores;
