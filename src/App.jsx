import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import AuthLayout from './Layouts/AuthLayout'
import Login from './Paginas/Login'
import Registrar from './Paginas/Registrar'
import OlvidePassword from './Paginas/OlvidePassword'
import Dashboard from './Paginas/Dashboard'
import ProtectedRoute from './Layouts/ProtectedRoute'
import ActualizarPassword from './Paginas/ActualizarPassword'
import Perfil from './Paginas/Perfil'
import AcercaProyecto from './Paginas/AcercaProyecto'
import GuiaReciclaje from './Paginas/GuiaReciclaje'
import Generadores from './Paginas/Generadores'
import Transporte from './Paginas/Transporte'
import Gestion from './Paginas/Gestion'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          Parte publica
          <Route index element={<Login />} />
          <Route path='/registrar' element={<Registrar />} />
          <Route path='/olvide-password' element={<OlvidePassword />} />
          <Route path='/actualizar-password' element={<ActualizarPassword />} />


          Parte privada
          <Route element={<ProtectedRoute />}>
            <Route path='/app' element={<AuthLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='/app/perfil' element={<Perfil />} />
              <Route path='/app/acerca-proyecto' element={<AcercaProyecto />} />
              <Route path='/app/guia-reciclaje' element={<GuiaReciclaje />} />
              <Route path='/app/generadores' element={<Generadores />} />
              <Route path='/app/transporte' element={<Transporte />} />
              <Route path='/app/gestion' element={<Gestion />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
