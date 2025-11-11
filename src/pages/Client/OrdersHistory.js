import React, { useState, useEffect } from 'react'
import { useOrder, useTable, usePayment } from '../../hooks'
import { Button } from 'semantic-ui-react'
import { useParams } from 'react-router-dom' 
import { map, size, forEach } from 'lodash'
import { OrderHistoryItem } from '../../components/Client'
import { ModalConfirm, ModalBasic } from '../../components/Common'
import   qrImage from '../../assets/qr-code-image.png';

export function OrdersHistory() {
  const [idTable, setIdTable] = useState(null)
  const [showTypePayment, setShowTypePayment] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false) // Estado para mostrar el modal de Banca Móvil
  const [isRequestAccount, setIsRequestAccount] = useState(false)
  const { loading, orders, getOrdersByTable, addPaymentToOrder } = useOrder()
  const { getTableByNumber } = useTable()
  const { tableNumber } = useParams()
  const { createPayment, getPaymentsByTable } = usePayment()

  useEffect(() => {
    (async () => {
      const tableData = await getTableByNumber(tableNumber)
      const idTableTemp = tableData[0].id
      setIdTable(idTableTemp)
      getOrdersByTable(idTableTemp, "", "ordering=-status,-created_at")
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (idTable) {
        const response = await getPaymentsByTable(idTable)
        setIsRequestAccount(response)
      }
    })()
  }, [idTable])

  const onCreatePayment = async (paymentType) => {
    setShowTypePayment(false)
    let totalPayment = 0
    forEach(orders, (order) => {
      totalPayment += Number(order.product_data.price)
    })

    const paymentData = {
      table: idTable,
      totalPayment: totalPayment.toFixed(2),
      paymentType,
      statusPayment: "PENDING",
    }

    const payment = await createPayment(paymentData)

    for await (const order of orders) {
      await addPaymentToOrder(order.id, payment.id)
    }

    // Evitamos la recarga de la página, solo cerramos el modal
    if (paymentType === 'CARD') {
      setShowBankModal(true) // Abrimos el modal de Banca Móvil
    }
  }

  const onPaymentWithCard = () => {
    setShowBankModal(true) // Mostrar el modal de Banca Móvil al elegir "Tarjeta"
    onCreatePayment('CARD')
  }

  return (
    <div>
      <h1>Historial de pedidos</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {size(orders) > 0 && (
            <Button primary fluid onClick={() => size(isRequestAccount) === 0 && setShowTypePayment(true)}>
              {size(isRequestAccount) > 0 ? 'La cuenta ya fue solicitada' : 'Pedir la cuenta'}
            </Button>
          )}

          {map(orders, (order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </>
      )}

      {/* Modal de selección de pago */}
      <ModalConfirm 
        title='¿Pagar con tarjeta o efectivo?'
        show={showTypePayment}
        onCloseText='Efectivo'
        onClose={() => onCreatePayment('CASH')}
        onConfirmText='Banca Móvil'
        onConfirm={onPaymentWithCard} // Ahora solo se ejecuta cuando el usuario hace clic en "Tarjeta"
      />

      {/* Modal de Banca Móvil */}
      <ModalBasic
        show={showBankModal}
        onClose={() => setShowBankModal(false)} // Cerrar el modal solo cuando se haga clic en el botón de cierre
        title="Detalles de Banca Móvil"
      >
        <div>
          <h3>Detalles de la Cuenta de Banco Pichincha</h3>
          <p><strong>Cuenta:</strong> 2209237577</p>
          <p><strong>Titular:</strong> Narcisa Colcha</p>
          <p><strong>Banco:</strong> Banco Pichincha</p>
          <p><strong>Tipo de cuenta:</strong> Cuenta de ahorros</p>
          <div>
            <p>Escanee el código QR para realizar el pago:</p>
            <img src={qrImage} alt="QR de pago" style={{ width: '200px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <div>
            <p>O haga clic en el siguiente enlace para acceder a la aplicación de Banca Móvil:</p>
            <a href="https://bancaweb.pichincha.com/pichincha-app/" target="_blank" rel="noopener noreferrer" className="ui button primary">
              Ir a Banca Móvil
            </a>
          </div>
        </div>
      </ModalBasic>
    </div>
  )
}
