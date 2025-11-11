/* import React from 'react'
import { ToastContainer } from 'react-toastify'
import  {Navigation}  from './routes'
import {AuthProvider } from './context'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  return (
    <AuthProvider>
      <Navigation />

      <ToastContainer 
        position='bottom-center'
        autoClose={5000} //tiempo que este abierto
        hideProgressBar // sea invisible
        newestOnTop 
        closeOnClick //para que se cierre con un click
        rtl={false}
        pauseOnFocusLoss
        draggable //con el dedo se pueda cerrar
        pauseOnHover={false}  // pase el cursor no se pare el tiempo
      />

    </AuthProvider>
  )
}
 */

import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Navigation } from './routes';
import { AuthProvider } from './context';
import { FaSun, FaMoon } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './scss/global.scss'; // Importar global.scss para los estilos

export default function App() {
  // Comprobar si hay una preferencia guardada en localStorage
  const savedTheme = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === 'dark'); 

  // Aplicar el tema al cargar
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Función para alternar entre modo oscuro y claro
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  return (
    <AuthProvider>
      <div className={isDarkMode ? 'app-container dark' : 'app-container'}>
        {/* Botón para cambiar entre modo oscuro y claro */}
        <button 
          className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
          style={{ 
            zIndex: 1000, 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            background: isDarkMode ? 
              'linear-gradient(135deg, #333, #222)' : 
              'linear-gradient(135deg, #f8f8f8, #fff)',
            color: isDarkMode ? '#f8f8f8' : '#333',
            transition: 'all 0.3s ease'
          }} 
          onClick={toggleTheme}
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Navegación */}
        <Navigation />

        {/* Contenedor de Toasts */}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme={isDarkMode ? 'dark' : 'light'} // Aplicar tema también a los toasts
        />
      </div>
    </AuthProvider>
  );
}


