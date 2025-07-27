import useAuth from "../hooks/useAuth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import clienteAxios from "../config/axios"
import { Link } from "react-router-dom"

const EditarPerfil = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        nombre: '',
        contrasenna: '',
        confirmContrasenna: '',
        email: '',
        telefono: '',
        creado_en: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const actualizarPerfil = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        if (!token) {
            setCargando(false)
            return
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            if (usuario.contrasenna !== usuario.confirmContrasenna) {
                setErrorMessage('Las contraseñas no coinciden');
                return;
            }

            const url = `/usuario/actualizar/${auth.id}`;
            const response = await clienteAxios.put(url, {
                email: usuario.email,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                contrasenna: usuario.contrasenna,
            }, config);

            setUsuario({
                ...usuario,
                contrasenna: '',
                confirmContrasenna: ''
            });
            setSuccessMessage(response.data.msg || 'Perfil actualizado correctamente');

            // Actualizar el contexto auth
            setAuth({
                ...auth,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono
            });

            // Retrasar la navegación para permitir que los cambios se reflejen
            setTimeout(() => navigate('/app/perfil'), 1000);
        } catch (error) {
            setErrorMessage(error?.response?.data?.msg || 'Error al actualizar el perfil');
        }
    }


    useEffect(() => {
        obtenerDatosUsuario();
    }, [auth]);

    const obtenerDatosUsuario = () => {
        if (auth && auth.email) {
            console.log("Datos del usuario:", auth);
            setUsuario(auth);
        } else {
            setUsuario(null);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4  p-6 h-screen bg-white rounded shadow-lg">
                <h1 className="text-xl font-bold underline">Actualizar Perfil</h1>
                <p className='text-lg'>Modifica la información de tu perfil</p>
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                {successMessage && <div className="text-green-500">{successMessage}</div>}
                <form onSubmit={(e) => { actualizarPerfil(e); console.log('Formulario enviado'); }} className='flex flex-col gap-4'>
                    <label className='text-lg'>Nombre:</label>
                    <input
                        type='text'
                        value={usuario.nombre}
                        onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                        className='border p-2 rounded'
                    />
                    <label className='text-lg'>Nueva Contraseña:</label>
                    <input
                        type='text'
                        value={usuario.contrasenna || ''}
                        onChange={(e) => setUsuario({ ...usuario, contrasenna: e.target.value })}
                        className='border p-2 rounded'
                    />
                    <label className='text-lg'>Confirmar  Nueva Contraseña:</label>
                    <input
                        type='text'
                        value={usuario.confirmContrasenna || ''}
                        onChange={(e) => setUsuario({ ...usuario, confirmContrasenna: e.target.value })}
                        className='border p-2 rounded'
                    />
                    <label className='text-lg'>Email:</label>
                    <input
                        type='email'
                        value={usuario.email}
                        onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                        className='border p-2 rounded'
                    />
                    <label className='text-lg'>Teléfono:</label>
                    <input
                        type='text'
                        value={usuario.telefono || ''}
                        onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                        className='border p-2 rounded'
                    />
                    <div className='flex justify-normal mt-4 p-4'>
                        <button className='mr-4' type="submit">
                            <span className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'>Actualizar Perfil</span>
                        </button>
                        <Link to="/app" className='bg-lime-500 text-white py-2 px-4 rounded hover:bg-lime-700'>
                            Volver al Dashboard
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditarPerfil