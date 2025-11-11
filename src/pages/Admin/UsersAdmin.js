import React,{useState,useEffect} from 'react'
import {Loader} from 'semantic-ui-react'
import {HeaderPage} from '../../components/Admin/HeaderPage/HeaderPage'
import { TableUsers, AddEditUserForm} from '../../components/Admin'
import {ModalBasic} from '../../components/Common'
import { useUser } from '../../hooks'


export function UsersAdmin() {
  
  const [showModal, setShowModal] = useState( null)
  const [titleModal, setTitleModal] = useState( null)
  const [contentModal, setContentModal] = useState( null)
  const [refetch, setRefetch] = useState( false)
  const {loading, users , getUsers, deleteUser} = useUser();
  

  useEffect(() => {
    getUsers();
  }, [refetch])

  const openCloseModal = () => setShowModal((prev)=> !prev)
  const onRefetch = () => setRefetch((prev)=> !prev)
  const addUser = () => {
    setTitleModal("Nuevo Usuario");
    setContentModal(<AddEditUserForm onClose={openCloseModal} onRefetch={onRefetch}/>);
    openCloseModal();
  }

  const updateUser = (data) => {
    setTitleModal("Actualizar Usuario");
    setContentModal(<AddEditUserForm onClose={openCloseModal} onRefetch={onRefetch} user={data}/>);
    openCloseModal();
  }

  const onDeleteUser = async(data) => {
    const result = window.confirm(`¿Desea Eliminar usuario ${data.email} ?`)
    if (result) {
      try {
      await deleteUser(data.id);
      onRefetch();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <HeaderPage 
        title = "Usuarios" 
        btnTitle = "Nuevo Usuario" 
        btnClick = {addUser}
        //btnTitleTwo = "Eliminar Usuario"
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>     
      ) : (
        <TableUsers users={users} updateUser={updateUser} onDeleteUser={onDeleteUser}/>
      )}

      <ModalBasic 
        show={showModal} 
        onClose={openCloseModal} 
        title={titleModal}
        children={contentModal} />
    </>
  )
}
