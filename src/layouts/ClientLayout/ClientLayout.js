import React, { useState, useEffect } from 'react'
import { Button, Container, Icon, Image } from 'semantic-ui-react'
import {useParams, useNavigate, Link, useLocation} from 'react-router-dom'
import {Chatbot}from '../../pages/Client/ChatbotClient'
import {useTable} from '../../hooks'
import robotWaiter from '../../assets/robot-waiter.svg'

import './ClientLayout.scss'
export function ClientLayout(props) {
    const { children } = props
    const {isExistTable} = useTable();
    const {tableNumber} = useParams();
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
      (async () => {
       const exist = await isExistTable(tableNumber)
       if (!exist) {
         navigate('/')
       }
      })();
    }, [tableNumber])

    const closeTable = () => {
      navigate('/')
    };

    const goToCart = () => {
      navigate(`/client/${tableNumber}/cart`)
    };

    const goToChatbot = () => {
      navigate(`/client/${tableNumber}/chatbot`)
    };

    const goToOrders = () => {
      navigate(`/client/${tableNumber}/orders`)
    };
    
    const goToMenu = () => {
      navigate(`/client/${tableNumber}`)
    };
    
  return (
    <div className='client-layout-bg'>
      <Container fluid className='client-layout'>
        <div className='client-layout__header'>
          <div className='client-layout__header__title-container'>
            <Link to={`/client/${tableNumber}`}>
              <h1 className='restaurant-title'>Gold Garden</h1>
            </Link>
          </div>
          
          <div className='client-layout__header__nav'>
            <div className='client-layout__header__menu' onClick={goToMenu}>
              <span>Menú</span>
            </div>
            
            <div className='client-layout__header__table'>
              <span>Mesa: {tableNumber}</span>
            </div>
            
            <div className='client-layout__header__actions'>
              <Button onClick={goToCart}>
                <Icon name='cart' />
              </Button>
              <Button onClick={goToOrders}>
                <Icon name='list' />
              </Button>
              <Button onClick={closeTable}>
                <Icon name='sign out' />
              </Button>
            </div>
          </div>
        </div>
          
        <div className='client-layout__content'>
          {children}
        </div>
      </Container>

      {/* Mostrar el botón del chatbot solo si NO estamos en la página del chatbot */}
      {!location.pathname.includes('/chatbot') && (
        <div className='client-layout-bg__chatbot'>
            <div className='client-layout-bg__chatbot__message'>
                ¿Quieres que tome tu orden?
            </div>
            <Button className='client-layout-bg__chatbot__btn' onClick={goToChatbot}>
                <Image src={robotWaiter} className='client-layout-bg__chatbot__robot' />
            </Button>
        </div>
      )}
    </div>
  )
}
