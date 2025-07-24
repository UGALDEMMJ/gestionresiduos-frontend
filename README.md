# Proyecto CRUD Residuos

Este proyecto es una aplicación web para la gestión de residuos, diseñada para facilitar el registro, edición y eliminación de datos relacionados con generadores, transportes y residuos. La aplicación incluye una interfaz de usuario moderna y un backend robusto para manejar las operaciones CRUD.

## Características principales

- **Gestión de residuos**: Permite agregar, editar y eliminar registros de residuos.
- **Gestión de generadores y transportes**: Administra los datos de generadores y transportes asociados a los residuos.
- **Autenticación**: Sistema de autenticación para proteger las rutas privadas.
- **Subida y eliminación de imágenes**: Soporte para subir imágenes al almacenamiento de Supabase y eliminarlas correctamente.
- **Guía de reciclaje**: Información útil para el reciclaje.

## Tecnologías utilizadas

### Frontend
- **React**: Biblioteca para construir la interfaz de usuario.
- **React Router**: Manejo de rutas en la aplicación.
- **Tailwind CSS**: Framework de CSS para estilos rápidos y personalizados.

### Backend
- **Node.js**: Entorno de ejecución para el backend.
- **Prisma**: ORM para manejar la base de datos.
- **Supabase**: Almacenamiento y autenticación.
- **Axios**: Cliente HTTP para realizar solicitudes al backend.

## Estructura del proyecto

### Frontend
```
frontend/
├── src/
│   ├── Paginas/         # Componentes de las páginas principales
│   ├── Layouts/         # Layouts para rutas públicas y privadas
│   ├── context/         # Contexto para la autenticación
│   ├── hooks/           # Hooks personalizados
│   ├── components/      # Componentes reutilizables
│   ├── config/          # Configuración de Axios
│   └── api/             # Llamadas a la API
```

### Backend
```
backend/
├── src/
│   ├── controllers/     # Controladores para manejar la lógica de negocio
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middleware para autenticación
│   ├── helpers/         # Funciones auxiliares
│   ├── config/          # Configuración de la base de datos
│   └── Types/           # Definición de tipos
├── prisma/              # Esquema y migraciones de Prisma
```

## Instalación y configuración

### Requisitos previos
- Node.js
- npm o yarn
- Supabase (configurado con un bucket llamado `gestionresiduos`)

### Pasos para ejecutar el proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/UGALDEMMJ/gestionresiduos-backend.git
   ```

2. Instala las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env` en el directorio `backend`:
   ```env
   DATABASE_URL=tu_url_de_base_de_datos
   SUPABASE_URL=tu_url_de_supabase
   SUPABASE_KEY=tu_clave_de_supabase
   ```

4. Ejecuta las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor del backend:
   ```bash
   npm run dev
   ```

6. Instala las dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

7. Inicia el servidor del frontend:
   ```bash
   npm run dev
   ```

8. Abre la aplicación en tu navegador en `http://localhost:3000`.

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los pasos a continuación:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección de errores:
   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Agrega mi nueva funcionalidad"
   ```
4. Sube tus cambios a tu fork:
   ```bash
   git push origin mi-nueva-funcionalidad
   ```
5. Abre un Pull Request en el repositorio original.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

¡Gracias por usar y contribuir a este proyecto!
