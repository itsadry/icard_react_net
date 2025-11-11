import React from 'react'
import {Image, Button, Icon} from 'semantic-ui-react'
import { map } from 'lodash'
import { toast} from 'react-toastify'
import {addProductCart} from '../../../api/cart'
import './ListProducts.scss'
export function ListProducts(props) {

    const {products} = props

    const addCart = (product) => {
        addProductCart(product.id)
        toast.success(` ${product.title} agregado al carrito `)
    }

  return (
    <div className='list-product-client'>
      {map(products, (product) => (
        <div 
            className='list-product-client__product' 
            key={product.id} 
        >
            <div>
                <Image src={product.image}/>
                <span>{product.title}</span>
                
            </div>
            <Button  primary icon onClick={() => addCart(product)}>
                <Icon name='plus' />
            </Button>
        </div>
      ))}
    </div>
  )
}
