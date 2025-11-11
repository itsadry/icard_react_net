import React, { useEffect, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import { HeaderPage} from '../../components/Admin/HeaderPage/HeaderPage'
import {AddEditTableForm } from '../../components/Admin'
import {TableTablesAdmin} from '../../components/Admin/Table/TableTablesAdmin/TableTablesAdmin'
import {ModalBasic} from '../../components/Common'
import {useTable} from '../../hooks'

export function TablesAdmin() {

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);
    const [refetch, setRefetch] = useState (false)

    const { loading, tables, getTables, deleteTable } = useTable();

    useEffect(() => {
      getTables()
    } , [ refetch])

    const openCloseModal = () => setShowModal((prev) => !prev);
    const onRefetch = () => setRefetch((prev) => !prev)

    const addTable = () => {
        setTitleModal('Crear Mesa');
        setContentModal(
             <AddEditTableForm 
                onClose={openCloseModal}  
                onRefetch={onRefetch}
            />
        );
        openCloseModal();
    }

    const updateTable = (data) => {
        setTitleModal('Actualizar Mesa');
        setContentModal(
            <AddEditTableForm 
                onClose={openCloseModal}  
                onRefetch={onRefetch}
                table={data}
            />
        );
        openCloseModal();
    }

    const onDeleteTable = async (data) => {
        const result = window.confirm(`¿Desea Eliminar mesa ${data.number} ?`)
        if (result) {
            try {
                await deleteTable(data.id);
                onRefetch();
            } catch (error) {
                console.log(error);
            }
        }
    }
  return (
    <>
      <HeaderPage 
        title="Mesas" 
        btnTitle="Crear nueva Mesa"
        btnClick={addTable}
      />  

      {loading ? (
        <Loader active inline='centered' >
          Cargando...
        </Loader>
      ) : (
        <TableTablesAdmin tables={tables} updateTable={updateTable} deleteTable= {onDeleteTable} />
      )}

      <ModalBasic
        show={showModal}
        onClose={openCloseModal}
        title={titleModal}
        children= {contentModal}
      />
    </>
  )
}
