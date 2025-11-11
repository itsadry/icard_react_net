import React, { useState, useEffect } from 'react'
import { useCategory } from '../../hooks'
import {map} from 'lodash'
import {ListCategories} from '../../components/Client'

export function Categories() {

  const {loading,categories, getCategories} = useCategory()

  useEffect(() => {
    getCategories()
  } , [])

  return (
    <div>
      <h2>Categorias</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ListCategories categories={categories} />
      )}
    </div>
  )
}



