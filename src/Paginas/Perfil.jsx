import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/axios';


const Profile = () => {
  const { auth } = useAuth();
  const [usuario,setUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    creado_en: '',
  });

  useEffect(() => {
    obtenerDatosUsuario();
  }, [auth]);

  const obtenerDatosUsuario = () =>{
    if (auth && auth.email) {
      console.log("Datos del usuario:", auth);
      setUsuario(auth);
    } else {
      setUsuario(null);
    }
  }

  const eliminarCuenta = async () =>{
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };

    try {
      await clienteAxios.delete(`/usuario/eliminar/${auth.id}`, config);
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
    }
  }


  return (
    <>
    <div className="flex flex-col gap-4  p-6 h-screen bg-white rounded shadow-lg">
        <h1 className="text-xl font-bold underline">Ajustes de Perfil</h1>
        <p className='text-lg'>En este espacio puedes visualizar tu información personal</p>
        <div className='flex flex-col gap-2 border p-4 rounded bg-gray-100'>
          <p className='text-3xl font-bold'>Nombre: <span className='font-normal'>{usuario.nombre}</span></p>
          <p className='text-3xl font-bold'>Email: <span className='font-normal'>{usuario.email}</span></p>
          <p className='text-3xl font-bold'>Teléfono: <span className='font-normal'>{usuario.telefono? usuario.telefono: "No se ha agregado"}</span></p>
          <p className='text-3xl font-bold'>Fecha de Creación de la cuenta: <span className='font-normal'>{new Date(usuario.creado_en).toLocaleDateString()}</span></p>
        </div>
      <div className='flex justify-normal mt-4 p-4'>
        <Link to="editar-perfil" className='mr-4'>
          <button className='bg-blue-500 text-white py-2 px-4 rounded'>Editar Perfil</button>
        </Link>
        <button onClick={eliminarCuenta} className='mr-4'>
          <a className='bg-red-500 text-white py-2 px-4 rounded'>Eliminar Cuenta</a>
        </button>
      </div>
    </div>
    </>
  )
}

export default Profile