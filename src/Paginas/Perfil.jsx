import React from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
  return (
    <div className="flex flex-col gap-4  p-6 h-screen bg-white rounded shadow-lg">
        <h1 className="text-xl font-bold underline">Ajustes de Perfil</h1>
        <p className='text-lg'>En este espacio puedes cambiar tu correo y contraseña</p>
        <div className='mt-4'>
          <Link to="/actualizar-password">
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-black rounded"
            >
              Cambiar Contraseña
            </button>
          </Link>
        </div>
        <div className='mt-4'>
          <Link to="/app/actualizar-correo">
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-black rounded"
            >
              Cambiar Correo
            </button>
          </Link>
        </div>
      
    </div>
  )
}

export default Profile