import React, { useState, useEffect} from 'react'
import {Loader} from 'semantic-ui-react'
import {HeaderPage} from '../../components/Admin/HeaderPage/HeaderPage'
import {TableProductAdmin, AddEditProductForm} from '../../components/Admin'
import {ModalBasic} from '../../components/Common'  
import {useProduct} from '../../hooks'

import '../../scss/busqueda.scss'
export function ProductAdmin() {

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);
    const [refetch, setRefetch] = useState(false);
    const {loading, products, getProducts, deleteProduct} = useProduct();


    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        getProducts()
    } , [ refetch ])

    const openCloseModal = () => setShowModal((prev) => !prev);
    const onRefetch = () => setRefetch((prev) => !prev);

    const addProduct = () => {
        setTitleModal('Nuevo Producto');
        setContentModal(<AddEditProductForm onClose={openCloseModal} onRefetch={onRefetch} />);
        openCloseModal();
    }

    const updateProduct = (data) => {
        setTitleModal('Actualizar Producto');
        setContentModal(<AddEditProductForm onClose={openCloseModal} onRefetch={onRefetch} product={data} />);
        openCloseModal();
    }

    const onDeleteProduct = async(data) => {
        const result = window.confirm(`¿Desea Eliminar producto ${data.title} ?`)
        if (result) {
            await deleteProduct(data.id)
            onRefetch()
        }
    }

    const filteredProducts = (products || []).filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Lógica de paginación
    const indexOfLastProduct = currentPage * itemsPerPage
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>  
      <HeaderPage
        title='Productos'
        btnTitle='Nuevo Producto'
        btnClick={addProduct}
      />

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <Loader active inline='centered'>
            
            Loading...
        
        </Loader>
      ) : (
        <TableProductAdmin 
          products={currentProducts} 
          updateProduct={updateProduct} 
          deleteProduct={onDeleteProduct} 
        />
      )}

      <div className="pagination-container">
        {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, index) => (
          <button className="pagination-btn" key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>


      <ModalBasic 
        show={showModal} 
        onClose={ openCloseModal} 
        title={titleModal} 
        children={contentModal} 
      />
    </>
  )
}
