import { Link } from 'react-router-dom'
import LogOutButton from './LogOutBoton'

const Header = () => {
  return (
    <header className="w-full bg-lime-600 p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center hover:cursor-pointer hover:underline">
        <Link to="/app" className="text-2xl sm:text-3xl font-bold text-black">
          App Web de Gestión de Residuos
        </Link>
        <nav className="mt-4 sm:mt-0">
          <LogOutButton />
        </nav>
      </div>
    </header>
  )
}

export default Header