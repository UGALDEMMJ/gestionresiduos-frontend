import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/axios';

const Transporte = () => {
  const { auth } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [transporte, setTransporte] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    via_transporte: '',
    contacto: '',
    matricula: '',
    usuarioId: ''
  });

  const obtenerTransporte = async () => {
    const { data: transporte, error } = await clienteAxios.get("/transporte/all/");

    if (error) {
      console.log(error);
    } else {
      setData(transporte);
      console.log(transporte);
    }
  };

  const manejarEliminar = async (id) => {

    const resultado = confirm('¿Esta seguro de eliminar este transporte?');

    if (!resultado) {
      alert('Operacion cancelada');
      return;
    }
    const { error } = await clienteAxios.delete(`/transporte/eliminar/${id}`);

    if (error) {
      setErrorMessage('Error al eliminar el transporte: ' + error.message);
    } else {
      alert('Transporte eliminado exitosamente');
      obtenerTransporte();
      setFormData({
        via_transporte: '',
        contacto: '',
        matricula: '',
        usuarioId: ''
      });
    }
  };


  const manejarEditar = (item) => {
    setTransporte(item);
    setFormData({
      via_transporte: item.via_transporte,
      contacto: item.contacto,
      matricula: item.matricula,
      usuarioId: item.usuarioId
    });
    setEditando(true);
    setIsOpen(true);
  };

  useEffect(() => {
    obtenerTransporte();
  }, []);

  const manejarFormulario = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (editando && transporte) {
      const { error } = await clienteAxios.put(`/transporte/actualizar/${transporte.id}`, {
        ...formData, usuarioId: auth.id
      });

      if (error) {
        setErrorMessage('Error al editar el transporte: ' + error.message);
      } else {
        setSuccessMessage('Transporte editado exitosamente');
        setEditando(false);
        setTransporte(null);
        obtenerTransporte();

        setTimeout(() => {
          setFormData({ via_transporte: '', contacto: '', matricula: '', usuarioId: '' });
          setIsOpen(false);
        }, 2000);

      }

    } else {
      const { error } = await clienteAxios.post(`/transporte/crear`, {
        ...formData, usuarioId: auth.id
      });

      if (error) {
        setErrorMessage('Error al guardar el transporte: ' + error.message);
      } else {
        setSuccessMessage('Transporte guardado exitosamente');
        setFormData({ via_transporte: '', contacto: '', matricula: '', usuarioId: '' });
        obtenerTransporte();
        setIsOpen(false);
      }
    }

    setTimeout(() => setSuccessMessage(''), 3000);
  };



  return (
    <div className="p-4 h-screen">
      <h1 className="text-xl font-bold underline">Transporte</h1>
      <p className='text-lg m-4'>En este espacio puedes agregar, editar y eliminar transportes, presiona el boton para agregar</p>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setIsOpen(true);
            setEditando(false);
          }}
          className="px-6 py-3 bg-green-500 text-white text-2xl rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
        >
          Agregar Transporte
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-3xl">
            <h2 className="text-lg font-bold">{editando ? 'Editar' : 'Agregar'} Transporte</h2>
            {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
            <form onSubmit={manejarSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Via de transporte del material</label>
                <input
                  type="text"
                  name="via_transporte"
                  placeholder="Medio de transporte o servicio de transporte"
                  className="border rounded w-full p-2"
                  value={formData.via_transporte}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Contacto</label>
                <input
                  type="text"
                  name="contacto"
                  placeholder="Teléfono o correo electrónico, del transporte"
                  className="border rounded w-full p-2"
                  value={formData.contacto}
                  onChange={manejarFormulario}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Matricula</label>
                <input
                  type="text"
                  name="matricula"
                  placeholder="Matricula del transporte"
                  className="border rounded w-full p-2"
                  value={formData.matricula}
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
        <h2 className="text-lg font-bold">Transportes Guardados:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 border">
              <h3 className="text-xl font-semibold">{item.via_transporte}</h3>
              <p className="text-gray-600">Contacto: <span>{item.contacto}</span></p>
              <p className="text-gray-600">Matricula: <span>{item.matricula}</span></p>
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
  )
}

export default Transporte