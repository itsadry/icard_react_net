import React, { useState, useEffect } from 'react'
import { Label } from 'semantic-ui-react'
import  classNames from 'classnames'
import { Link } from 'react-router-dom'
import {size } from 'lodash'
import { getOrdersByTableApi} from '../../../../api/orders'
import { ORDER_STATUS} from '../../../../utils/constants'
//imagen
import {ReactComponent as IcTable} from '../../../../assets/table.svg'
import {usePayment} from '../../../../hooks'

import './TableAdmin.scss'
export function TableAdmin(props) {

  const {table, reload} = props
  const [orders, setOrders] = useState([])
  const [tableBusy, setTableBusy] = useState(false)
  const [pendingPayments, setPendingPayments] = useState(false)
  const {getPaymentsByTable} = usePayment()

  useEffect(() => {
      (async () => {
          const response = await getOrdersByTableApi(
            table.id, 
            ORDER_STATUS.PENDING
          );
          setOrders(response)
      })();
  } , [reload]);

  useEffect(() => {
    (async () => {
        const response = await getOrdersByTableApi(
          table.id, 
          ORDER_STATUS.DELIVERED
        );
        if (size(response) > 0) {
          setTableBusy(response)
        }else{
          setTableBusy(false)
        }
    })();
  } , [reload]);


  useEffect(() => {
    (async () => {
        const response = await getPaymentsByTable(table.id);
          
          if (size(response) > 0) {
            setPendingPayments(true)
          }else{
            setPendingPayments(false)
          }
        
        
    })();
  } , [reload]);

  return (
    <Link to={`/admin/table/${table.id}`} className='table-admin'>
      {size(orders) > 0 ?
      (
        <Label circular color='red' >
          {size(orders)}
        </Label>
      ): null}

      {pendingPayments ?
      (
        <Label circular color='yellow' >
          Cuenta
        </Label>
      ): null}

      <IcTable 
        className= {classNames({
          pending: size(orders) > 0,
          busy : tableBusy,
          'pending-payment': pendingPayments,
        })}
      />
      <p>Mesa {table.number}</p>
    </Link>
  )
}
