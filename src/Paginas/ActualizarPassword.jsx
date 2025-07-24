import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ActualizarPassword = () => {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const accessToken = query.get('token');

    const visbilidadPassword = () => {
        setShowPassword(!showPassword);
    }

    const manejarPasswordUpdate = async (e) => {
        e.preventDefault();


        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            setSuccessMessage('');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        console.log(accessToken)
        console.log(newPassword)
        console.log(error)

        if (error) {
            setErrorMessage(`Error: ${error.message}`);
            setSuccessMessage('');
        } else {
            setSuccessMessage('Contraseña actualizada con éxito.');
            setErrorMessage('');
        }
    };



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
                            Actualiza tu contraseña, ingresa tu nueva contraseña
                        </p>
                    </div>
                    {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
                    {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
                    <form className='w-full' onSubmit={manejarPasswordUpdate}>
                        <div className='mb-4 space-y-3'>
                            <div className='space-y-1'>
                                <div className='relative'>
                                    <input
                                        className="border rounded-md h-10 w-full py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 px-4"
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Introduce tu nueva contraseña"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 end-0 flex items-center z-20 px-3 rounded-e-md"
                                        onClick={visbilidadPassword}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <div className='relative'>
                                    <input
                                        className="border rounded-md h-10 w-full py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 px-4"
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirma tu nueva contraseña"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 end-0 flex items-center z-20 px-3 rounded-e-md"
                                        onClick={visbilidadPassword}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                            <button className="flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 disabled:opacity-50" type="submit">
                                Actualizar Contraseña
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <Link className='text-blue-500 underline' to={'/'}>Regresar a Iniciar Sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActualizarPassword;