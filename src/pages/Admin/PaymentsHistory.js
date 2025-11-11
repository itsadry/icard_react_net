import React, { useEffect, useState } from 'react'
import { Loader, Button } from 'semantic-ui-react'
import { HeaderPage, TablePayments } from '../../components/Admin'
import { usePayment } from '../../hooks'
import moment from 'moment'

import '../../scss/busqueda.scss'

export function PaymentsHistory() {
  const { loading, payments, getPayments } = usePayment()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAllPayments, setShowAllPayments] = useState(false) // Para ver todo el historial o solo pagos de hoy
  const [totalAmount, setTotalAmount] = useState(0) // Estado para almacenar el total de la columna
  const itemsPerPage = 10

  useEffect(() => {
    // Llamar para obtener los pagos existentes
    getPayments()
  }, [])

  // Función para mostrar todo el historial de pagos
  const toggleShowAllPayments = () => {
    setShowAllPayments(!showAllPayments)
    setCurrentPage(1)  // Resetear a la primera página cuando cambie la vista
  }

  // Filtramos los pagos por fecha (solo mostrar pagos de hoy)
  const today = moment().format('YYYY-MM-DD')
  const filteredPayments = (payments || []).filter(payment =>
    showAllPayments
      ? true // Si se desea ver todo el historial, no se filtra por fecha
      : moment(payment.created_at).format('YYYY-MM-DD') === today // Solo mostrar pagos de hoy
  ).filter(payment => {
    // Verificar que payment.table_data y payment.table_data.number existen antes de acceder
    return payment.table_data && payment.table_data.number 
      ? payment.table_data.number.toString().includes(searchTerm)
      : searchTerm === '' // Si no hay número de mesa o no existe table_data, mostrar solo si no hay término de búsqueda
  })

  // Calculamos el total de la columna "Total"
  useEffect(() => {
    const total = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.totalPayment), 0)
    setTotalAmount(total)
  }, [filteredPayments])

  // Lógica de paginación
  const indexOfLastPayment = currentPage * itemsPerPage
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <HeaderPage title='Historial de pagos' btnClick={() => {}} />

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por mesa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TablePayments payments={currentPayments} />
      )}

      <div className="pagination-container">
        {Array.from({ length: Math.ceil(filteredPayments.length / itemsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Mostrar el total de la columna "Total" */}
      <div className="total-container">
        <h3>Total de pagos: ${totalAmount.toFixed(2)}</h3>
      </div>

      {/* Botón para ver todo el historial de pagos */}
      <div className="view-all-payments-container">
        <Button onClick={toggleShowAllPayments}>
          {showAllPayments ? 'Ver solo pagos de hoy' : 'Ver todo el historial'}
        </Button>
      </div>
    </>
  )
}
