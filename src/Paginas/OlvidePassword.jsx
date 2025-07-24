import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const OlvidePassword = () => {

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();



  const validarEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  }

  const manejarPassword = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setErrorMessage('Por favor ingresa un correo valido');
      setSuccessMessage('');
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/actualizar-password',
    })



    if (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Se envio un correo para restablecer tu contraseña');
      setErrorMessage('');
    }
  }


  return (
    <div className='bg-white'>
      <div className='relative flex h-screen flex-col items-center justify-center bg-cover bg-center'
        style={{ backgroundImage: `url('/plant.jpg')` }}>
        <div className="absolute inset-0 bg-white bg-opacity-50 blur-sm"></div>

        <div className='relative max-w-md sm:max-w-md mt-6 px-3 py-3 bg-white shadow-md overflow-hidden sm:rounded-lg'>
          <header className='rounded-t-lg bg-green-800 p-4'>
            <div>
              <img
                src='/img.svg'
                alt='Logo de Reciclaje'
                className='h-16 w-full mx-auto'
              />
            </div>
          </header>
          <div className='mb-8 space-y-3'>
            <p className='text-xl font-semibold text-center my-10'>
              Llena este formulario para restablecer tu contraseña
            </p>
          </div>
          {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
          {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
          <form className='w-full' onSubmit={manejarPassword}>
            <div className='mb-4 space-y-3'>
              <div className='space-y-1'>

                <input
                  className="border rounded-md h-10 w-full py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 px-4"
                  id="email"
                  type="email"
                  placeholder="Introduce tu email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>
              <button className="flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 disabled:opacity-50" type="submit">
                Enviar
              </button>
            </div>
          </form>
          <div className="text-center">
            <Link className='text-blue-500 underline' to={'/'}>Regresar a Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OlvidePassword