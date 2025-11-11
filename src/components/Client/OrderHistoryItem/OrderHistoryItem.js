import React from 'react'
import { Image } from 'semantic-ui-react'
import classNames from 'classnames'
import moment from 'moment'
import 'moment/locale/es'
import { ORDER_STATUS } from '../../../utils/constants'
import { Link } from 'react-router-dom'

import './OrderHistoryItem.scss'
export function OrderHistoryItem(props) {

    const {order} = props
    const {title, image} = order.product_data
  return (
    <div className={classNames('order-history-item', {
            [order.status.toLowerCase()]: true})}
    >
        <div className='order-history-item__time'>
            <span>{moment(order.created_at).startOf('secods').fromNow()}</span> 
        </div>

        <div className='order-history-item__product'>
            <Image src={image} size='tiny'/>
            <p>{title}</p>
        </div>

        {order.status === ORDER_STATUS.PENDING ? (
            <span>Pendiente</span>
        ): (
            <span>Entregado</span>
        )}
    </div>
  )
}
