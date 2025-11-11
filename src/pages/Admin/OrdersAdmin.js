import React, { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import {HeaderPage } from '../../components/Admin'
import {TablesListAdmin} from '../../components/Admin/Table/TablesListAdmin/TablesListAdmin'
import { useTable} from '../../hooks'
 

export function OrdersAdmin() {

  const {loading, tables, getTables} = useTable()

  useEffect(() => {
    getTables()
  } , [])

  return (
    <>
     
     <HeaderPage title="Restaurante" />
      {loading ? (
        <Loader active inline= "centered"> 
          Cargando...
        </Loader>
      ) : (
        <TablesListAdmin tables={tables}/>
        
      )}
    </>
  )
}
