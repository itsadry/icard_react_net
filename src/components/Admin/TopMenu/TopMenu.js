import React, { useEffect, useState } from 'react'
import {Icon, Menu, Image} from 'semantic-ui-react'
import {useAuth} from '../../../hooks'
import { FaUtensils, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

import './TopMenu.scss'
export function TopMenu() {
    const {auth, logout} = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detector de tamaño de pantalla
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderName = () => {
        if (auth.me?.first_name && auth.me?.last_name) {
            return `${auth.me.first_name} ${auth.me.last_name}`
        }
        return auth.me?.email
    }

    const getInitials = () => {
        if (auth.me?.first_name && auth.me?.last_name) {
            return `${auth.me.first_name[0]}${auth.me.last_name[0]}`
        }
        return auth.me?.email?.[0] || 'U'
    }

  return (
    <Menu fixed='top' className='top-menu-admin'>
        <Menu.Item className='top-menu-admin__logo'>
            <FaUtensils className='logo-icon' />
            <span className='logo-text'>Gold Garden</span>
        </Menu.Item>

        <Menu.Menu position='right'>
            <Menu.Item className='user-info'>
                <div className='avatar'>{getInitials()}</div>
                {!isMobile && <span className='user-name'>Hola, {renderName()}</span>}
            </Menu.Item>
            <div className="divider"></div>
            <Menu.Item onClick={logout} className='logout-button'>
                <FaSignOutAlt />
                {!isMobile && <span className='logout-text'>Salir</span>}
            </Menu.Item>
        </Menu.Menu>
    </Menu>
  )
}
