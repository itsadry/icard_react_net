import React, { useState, useEffect } from 'react'
import {Loader} from 'semantic-ui-react'
import { HeaderPage } from '../../components/Admin/HeaderPage/HeaderPage';
import { TableCategoryAdmin, AddEditCategoryForm } from '../../components/Admin';
import {ModalBasic} from '../../components/Common'
import {useCategory} from '../../hooks'

import '../../scss/busqueda.scss'

export function CategoriesAdmin() {

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);
    const [refetch, setRefetch] = useState(false);
    const {loading, categories, getCategories, deleteCategory} = useCategory();

    console.log(categories);

    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        getCategories()
    } , [refetch])

    const openCloseModal = () => setShowModal((prev) => !prev);
    const onRefetch = () => setRefetch((prev) => !prev);

    const addCategory = () => {
        setTitleModal('Nueva Categoria');
        setContentModal(
            <AddEditCategoryForm 
                onClose={openCloseModal}  
                onRefetch={onRefetch}
            />
        );
        openCloseModal();
    }

    const updateCategory = (data) => {
        setTitleModal('Actualizar Categoria');
        setContentModal(
            <AddEditCategoryForm 
                onClose={openCloseModal} 
                onRefetch={onRefetch} 
                category={data}
            />
        );
        openCloseModal();
    }


    const onDeleteCategory = async(data) => {
        const result = window.confirm(`¿Desea Eliminar la categoria ${data.title} ?`)
        if (result) {
            try {
                await deleteCategory(data.id);
                onRefetch();
            } catch (error) {
                console.log(error);
            }
        }
    }

    const filteredCategories = (categories || []).filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Lógica de paginación
    const indexOfLastCategory = currentPage * itemsPerPage
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
        <HeaderPage 
            title='Categorias' 
            btnTitle='Nueva Categoria' 
            btnClick={addCategory} 
        />
        <div className="search-container">
            <input 
                type="text" 
                placeholder="Buscar categoría"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        </div>

        {
            loading ? (
                <Loader active inline='centered'>
                    Cargando..
                </Loader>
            ) : (
                <TableCategoryAdmin 
                    categories={currentCategories} 
                    updateCategory={updateCategory}
                    deleteCategory= { onDeleteCategory}
                />
            )
        }

        <div className="pagination-container">
            {Array.from({ length: Math.ceil(filteredCategories.length / itemsPerPage) }, (_, index) => (
                <button className="pagination-btn" key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                </button>
            ))}
        </div>
        <ModalBasic 
            show={ showModal }
            onClose={ openCloseModal }
            title={ titleModal }
            children={ contentModal }
            
        />
    </>
  )
}
