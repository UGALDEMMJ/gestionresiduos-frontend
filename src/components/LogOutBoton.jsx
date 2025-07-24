import useAuth from "../hooks/useAuth";

const LogOutBoton = () => {
    const { cerrarSesion } = useAuth();
    return (
        <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={cerrarSesion}>Cerrar sesión</button>
    )
};

export default LogOutBoton;