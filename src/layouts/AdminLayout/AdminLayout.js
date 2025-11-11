import React, { useState, useEffect } from "react";
import { LoginAdmin } from "../../pages/Admin";
import { TopMenu, SideMenu } from "../../components/Admin";
import { useAuth } from "../../hooks";
import "./AdminLayout.scss";

export function AdminLayout(props) {
  const { children } = props;
  const { auth } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-theme'));
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Observar cambios en el tema
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

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!auth) return <LoginAdmin />;

  return (
    <div className={`admin-layout ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="admin-layout__menu">
        <TopMenu />
      </div>

      <div className="admin-layout__main-content">
        <SideMenu>{children}</SideMenu>
      </div>
    </div>
  );
}