import React, { useState } from 'react';
import { Button, Form, Image, Icon } from 'semantic-ui-react';
import { useTable } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';
import './SelectTable.scss';

export function SelectTable() {
  const [tableNum, setTableNum] = useState(null);
  const [error, setError] = useState(null);
  const { isExistTable } = useTable();
  const navigate = useNavigate();

  const onSubmit = async () => {
    setError(null);
    if (!tableNum) {
      setError('Por favor, introduce un número de mesa');
    } else {
      const exist = await isExistTable(tableNum);
      if (exist) {
        navigate(`/client/${tableNum}`);
      } else {
        setError('La mesa no existe');
      }
    }
  };

  // Opciones del menú desplegable para una visualización más elegante
  const tableOptions = [
    { key: 1, text: 'Mesa 1', value: 1 },
    { key: 2, text: 'Mesa 2', value: 2 },
    { key: 3, text: 'Mesa 3', value: 3 },
    { key: 4, text: 'Mesa 4', value: 4 },
    { key: 5, text: 'Mesa 5', value: 5 },
    { key: 6, text: 'Mesa 6', value: 6 },
    { key: 7, text: 'Mesa 7', value: 7 },
    { key: 8, text: 'Mesa 8', value: 8 },
  ];

  return (
    <div className="select-table">
      <div className="select-table__overlay"></div>
      <div className="select-table__content">
        <div className="logo-container">
          <FaUtensils className="logo-icon" />
        </div>
        
        <h1>Gold Garden</h1>
        <p className="restaurant-description">
          Una experiencia culinaria exclusiva
        </p>
        
        <div className="divider">
          <span></span>
        </div>
        
        <h2>Selecciona tu mesa para comenzar</h2>

        <Form onSubmit={onSubmit}>
          <Form.Input 
            placeholder="Ingresa el número de tu mesa" 
            type="number" 
            icon="table"
            iconPosition="left"
            onChange={(_, data) => setTableNum(data.value)} 
          />

          <Button className="enter-button" fluid>
            <span>Comenzar</span>
            <FaArrowRight className="arrow-icon" />
          </Button>
        </Form>

        {error && (
          <div className="error-message">
            <Icon name="warning circle" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="table-grid">
          {tableOptions.map(table => (
            <div 
              key={table.key} 
              className={`table-item ${parseInt(tableNum) === table.value ? 'selected' : ''}`}
              onClick={() => setTableNum(table.value)}
            >
              <div className="table-icon"></div>
              <div className="table-number">{table.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



/* import React from 'react';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import './SelectTable.scss';

export function SelectTable() {
  // Opciones del menú desplegable
  const tableOptions = [
    { key: 1, text: 'Mesa 1', value: 1 },
    { key: 2, text: 'Mesa 2', value: 2 },
    { key: 3, text: 'Mesa 3', value: 3 },
    { key: 4, text: 'Mesa 4', value: 4 },
    { key: 5, text: 'Mesa 5', value: 5 },
    { key: 6, text: 'Mesa 6', value: 6 },
    { key: 7, text: 'Mesa 7', value: 7 },
    { key: 8, text: 'Mesa 8', value: 8 },
    { key: 9, text: 'Mesa 9', value: 9 },
    { key: 10, text: 'Mesa 10', value: 10 },
  ];

  return (
    <div className='select-table'>
      <div className='select-table__content'>
        <h1>Bienvenido a Gold Garden</h1>
        <h2>Selecciona tu número de mesa</h2>

        <Form>
          <Form.Field>
            <label>Número de Mesa</label>
            <Dropdown
              placeholder='Selecciona tu mesa'
              fluid
              selection
              options={tableOptions}
            />
          </Form.Field>

          <Button primary fluid type='submit'>
            Entrar
          </Button>
        </Form>
      </div>
    </div>
  );
}
 */