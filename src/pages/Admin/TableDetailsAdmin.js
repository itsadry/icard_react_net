import React, { useState, useEffect } from 'react'
import { Loader, Button, Modal } from 'semantic-ui-react'
import { useParams} from 'react-router-dom'
import {forEach, size} from 'lodash'
import {HeaderPage} from '../../components/Admin/HeaderPage/HeaderPage'
import {PaymentDetail} from '../../components/Admin'
import { AddOrderForm} from '../../components/Admin/Orders/AddOrderForm/AddOrderForm'
import {ModalBasic}from '../../components/Common'
import {ListOrderAdmin} from '../../components/Admin/TableDetails'
import {useOrder, useTable, usePayment} from '../../hooks'
import qrImage from '../../assets/qr-code-image.png';


import '../../scss/ModalBancaMovil.scss'
export function TableDetailsAdmin() {
  

  const [reloadOrders, setReloadOrders] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const {id} = useParams()// obtener el id
  const {loading, orders, getOrdersByTable, addPaymentToOrder} = useOrder()
  const {table, getTable} = useTable()
  const {createPayment, getPaymentsByTable} = usePayment()
  
  const [showModal, setShowModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false) // Estado para mostrar el modal de la banca móvil
  const [paymentMethod, setPaymentMethod] = useState(null) // Para saber qué método de pago se eligió

  useEffect(() => {
    getOrdersByTable(id,"", "ordering=-status,created_at")
  } , [ reloadOrders])

  useEffect(() => {
    getTable(id)
  } , [ id])

  useEffect(() => {
    ( async () => {
      const response = await getPaymentsByTable(id)
      if ( size(response) > 0) {
        setPaymentData(response[0])
      }
    })()
  } , [ reloadOrders])

  const onReloadOrders = () => setReloadOrders((prev) => !prev)
  const openCloseModal = () => setShowModal((prev) => !prev)


  const onCreatePayment =  async () => {
    const result = window.confirm(`¿Desea generar la cuenta de la mesa ${table?.number || ''}?`);
    if (result) {

      let totalPayment = 0;
      forEach(orders, (order) => {
        totalPayment += Number(order.product_data.price);
      });

      const resultTypePayment = window.confirm(`¿Pago con Banca Movil pulsa Aceptar, con efectivo pulsa Cancelar?`);
      console.log(resultTypePayment);

      if (resultTypePayment) {
        setPaymentMethod('CARD') // Set the payment method to "Banca Móvil"
        setShowBankModal(true)   // Show the modal for Banca Móvil
      }

      const paymentData = {
        table: id,
        totalPayment: totalPayment.toFixed(2),
        paymentType: resultTypePayment ? "CARD" : "CASH",
        statusPayment: "PENDING",
      }
      const payment = await createPayment(paymentData);
      
      for await (const order of orders) {
        await addPaymentToOrder(order.id, payment.id);
      }

      onReloadOrders()
    }
  }

  const closeBankModal = () => setShowBankModal(false)
  return (
    <>
      <HeaderPage 
        title={`Mesa ${table?.number || ''}`}  
        btnTitle={paymentData ? "Ver cuenta" : "Añadir Pedido"}
        btnClick={() => openCloseModal() }
        btnTitleTwo= {!paymentData ? "Generar cuenta" : ""}
        btnClickTwo={() => onCreatePayment() }
      />
      {loading ? (
        <Loader active inline= "centered"> 
          Cargando...
        </Loader>
      ) : (
        <ListOrderAdmin orders={orders} onReloadOrders={onReloadOrders}/>
      )}

      <ModalBasic 
        show={showModal}
        onClose={openCloseModal}
        title="Generar Pedido"
      >
        { paymentData ? (
          <PaymentDetail 
            payment={paymentData} 
            orders={orders} 
            openCloseModal={openCloseModal} 
            onReloadOrders={onReloadOrders} 
          />
        ) : (
          <AddOrderForm 
            idTable={id}
            openCloseModal={openCloseModal}
            onReloadOrders={onReloadOrders}
          />
        )}
        
      </ModalBasic>


      {/* Modal de Banca Móvil */}
      <Modal open={showBankModal} onClose={closeBankModal}>
        <Modal.Header>Pago con Banca Móvil</Modal.Header>
        <Modal.Content>
          <div>
            <h3>Detalles de la Cuenta de Banco Pichincha</h3>
            <p><strong>Cuenta:</strong> 2209237577</p>
            <p><strong>Titular:</strong> Narcisa Colcha</p>
            <p><strong>Banco:</strong> Banco Pichincha</p>
            <p><strong>Tipo de cuenta:</strong> Cuenta de ahorros</p>
            <div>
              <p>Escanee el código QR para realizar el pago:</p>
              <img src={qrImage} alt="QR de pago" />
            </div>
            <div>
              <p>O haga clic en el siguiente enlace para acceder a la aplicación de Banca Móvil:</p>
              <a
                href="https://bancaweb.pichincha.com/pichincha-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="ui button primary"
              >
                Ir a Banca Móvil
              </a>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeBankModal} negative>
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>

    </>
  )
}
