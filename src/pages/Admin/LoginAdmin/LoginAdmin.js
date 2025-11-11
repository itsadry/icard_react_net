import React, { useEffect, useState } from 'react';
import { LoginForm } from '../../../components/Admin';
import { FaUtensils } from 'react-icons/fa';
import './LoginAdmin.scss';

export function LoginAdmin() {
  // Detectar si el modo oscuro está activo
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-theme'));
  
  // Actualizar el estado si cambia el tema
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark-theme'));
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className={`login-panel ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className='login-container'>
        <div className="logo-container">
          <FaUtensils className="logo-icon" />
        </div>
        <h1>Gold Garden</h1>
        <p className="welcome-text">Bienvenido al sistema de administración</p>
        <LoginForm />
      </div>
    </div>
  )
}
