import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-green-600 text-black py-4 flex flex-wrap justify-center items-center'>
      <div className='container mx-auto flex flex-col sm:flex-row justify-between items-end px-4'>
        <div className='text-sm text-center sm:text-left mb-4 sm:mb-0'>
          <p>© 2024 App Web de Gestión de Residuos. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer