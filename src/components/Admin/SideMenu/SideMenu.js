import React, { useState, useEffect } from "react";
import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks";
import { 
  FaHome, 
  FaTable, 
  FaHistory, 
  FaFolder, 
  FaShoppingCart, 
  FaRobot, 
  FaChartBar, 
  FaUsers,
  FaAngleRight,
  FaBars
} from "react-icons/fa";
import "./SideMenuFixed.scss";

export function SideMenu(props) {
  const { children } = props;
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Ajustar colapso del menú basado en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`side-menu-admin ${collapsed ? 'collapsed' : ''}`}>
      <MenuLeft 
        pathname={pathname} 
        collapsed={collapsed} 
        toggleMenu={toggleMenu}
        isMobile={isMobile}
      />
      <div className="content">{children}</div>
    </div>
  );
}

function MenuLeft(props) {
  const { pathname, collapsed, toggleMenu, isMobile } = props;
  const { auth } = useAuth();

  // Define los elementos del menú con sus iconos y rutas
  const menuItems = [
    { icon: <FaHome />, text: "Pedidos", path: "/admin" },
    { icon: <FaTable />, text: "Mesas", path: "/admin/tables" },
    { icon: <FaHistory />, text: "Historial de pagos", path: "/admin/payments-history" },
    { icon: <FaFolder />, text: "Categorías", path: "/admin/categories" },
    { icon: <FaShoppingCart />, text: "Productos", path: "/admin/products" },
    { icon: <FaRobot />, text: "Chatbot", path: "/admin/chatbot" },
    { icon: <FaChartBar />, text: "Reportes", path: "/admin/reportes" },
  ];

  // Si el usuario es staff, agrega el elemento de usuarios
  if (auth.me?.is_staff) {
    menuItems.push({ icon: <FaUsers />, text: "Usuarios", path: "/admin/users" });
  }

  return (
    <div className={`side-menu ${collapsed ? 'collapsed' : ''}`}>
      <div className="menu-header">
        <div className="toggle-button" onClick={toggleMenu}>
          {collapsed ? <FaBars /> : <FaAngleRight className="rotated" />}
        </div>
      </div>
      
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`menu-item ${pathname === item.path ? 'active' : ''}`}
          >
            {collapsed ? (
              <span className="icon">{item.icon}</span>
            ) : (
              <div className="menu-content">
                <div className="icon">{item.icon}</div>
                <div className="text">{item.text}</div>
              </div>
            )}
            {collapsed && <div className="tooltip">{item.text}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}