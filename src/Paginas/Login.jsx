import { useState } from 'react'
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios';

const Login = () => {

    const [email, setEmail] = useState('')
    const [contrasenna, setContrasenna] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { setAuth } = useAuth();

    const visbilidadPassword = () => {
        setShowPassword(!showPassword);
    }

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email.trim() || !contrasenna.trim()) {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        try {
            const res = await clienteAxios.post("/usuario/login", { email, contrasenna });
            console.log("Login response:", res.data);
            const { token } = res.data;
            localStorage.setItem("token", token);
            // Obtener perfil y actualizar contexto de autenticación
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            const perfilRes = await clienteAxios.get('/usuario/perfil', config);
            setAuth(perfilRes.data);

            navigate("/app");
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            setErrorMessage(error?.response?.data?.msg || 'Error al iniciar sesión');
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
                        <p className='text-xl font-semibold text-center my-10 mx-10'>
                            Regístrate para acceder y empezar a <br /><span className='text-green-500'>Gestionar residuos</span>
                        </p>
                    </div>
                    <div className="flex flex-rows items-center space-x-4">
                    </div>
                    {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
                    {successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
                    <form className='w-full' onSubmit={manejarSubmit}>
                        <div className='mb-4 space-y-3'>
                            <div className='space-y-1'>
                                <div className='space-y-2'>
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email"></label>
                                    <input
                                        className="border rounded-md h-10 w-full py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 px-4"
                                        id="email" placeholder="Email" name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password"></label>
                                    <div className='relative'>
                                        <input
                                            className="border rounded-md h-10 w-full py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 px-4"
                                            id="password" placeholder="Password (Debe contener al menos 8 caracteres )" name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => setContrasenna(e.target.value)}
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
                            </div>
                            <button className="flex h-10 w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 disabled:opacity-50" type="submit">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                    <div className='mt-4 flex flex-col items-center justify-center'>
                        <div className="text-center">
                            No tienes cuenta?<br></br><Link className="text-blue-500 underline" to={'/registrar'}>Crea Una</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login