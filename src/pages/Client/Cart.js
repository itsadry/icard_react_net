import React, { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { size, map } from 'lodash'
import {useProduct} from '../../hooks'
import {getProductsCart} from '../../api/cart'
import { ListProductCart } from '../../components/Client' 

export function Cart() {

    const [products, setProducts] = useState(null)
    const {getProductById} = useProduct()
    const {tableNumber} = useParams()
    const [reloadCart, setReloadCart] = useState(false)
   
    useEffect(() => {
        (async () => {
            const idProductsCart = getProductsCart()
            const productsArray = []
            for await (const idProduct of idProductsCart) {
                const response = await getProductById(idProduct)
                productsArray.push(response)
            }
            setProducts( productsArray)
        })()
    }, [ reloadCart])

    const onReloadCart = () => setReloadCart((prev) => !prev)

  return (
    <div>
      <h1>Carrito</h1>
      {!products ? (
        <p>Cargando....</p>
      ) : size(products) === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p>No hay productos en el carrito</p>
            <Link to={`/client/${tableNumber}/orders`}>
              <Button primary>Ir a pedidos</Button>
            </Link>
          </div>
      ) : (
          <ListProductCart products={products}  onReloadCart={onReloadCart}/>
      )}
    </div>
  )
}
