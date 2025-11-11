import React, { useState , useEffect, useCallback} from 'react'
import { Form, Button, Image, Checkbox, Dropdown } from 'semantic-ui-react'
import { useCategory, useProduct} from '../../../../hooks'
import {map} from 'lodash'
import { useDropzone} from 'react-dropzone'
import { useFormik} from 'formik'
import * as Yup from 'yup'

import './AddEditProductForm.scss'
import { use } from 'react'
export function AddEditProductForm(props) {

    const {onClose, onRefetch, product} = props;
    const [categoriesFormat, setCategoriesFormat] = useState([]);
    const [previewImage, setPreviewImage] = useState(product ? product?.image : null);
    const {categories, getCategories} = useCategory();
    const {addProduct, updateProduct} = useProduct();

    useEffect(() => {
        getCategories()
    } , [])

    useEffect(() => {
        setCategoriesFormat(formatDropdownData(categories));
    }, [categories]);

    const formik = useFormik({
        initialValues: initialValues(product),
        validationSchema: Yup.object( product ? updateSchema() : newSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            if (product) await updateProduct(product.id, formValue);
            else await addProduct(formValue);
            onRefetch();
            onClose();
            
        }
    })
        

    const onDrop = useCallback( async (acceptedFiles) => {
        const file = acceptedFiles[0];
        await formik.setFieldValue('image', file);
        setPreviewImage(URL.createObjectURL(file));
    }, [])

    const { getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        onDrop
    })

  return (
    <Form className='add-edit-product-form' onSubmit={formik.handleSubmit}>
        <Form.Input 
            name= 'title' 
            placeholder='Nombre del Producto' 
            value = {formik.values.title} 
            onChange={formik.handleChange}
            error = {formik.errors.title}
        />
        <Form.Input 
            type='text' 
            name= 'description' 
            placeholder='Descripcion del Producto'
            value = {formik.values.description} 
            onChange={formik.handleChange}
            error = {formik.errors.description}
        />
        
        <Form.Input 
            type='number' 
            name= 'price' 
            placeholder='Precio del Producto'
            value = {formik.values.price}
            onChange={formik.handleChange}
            error = {formik.errors.price} 
        />

        <Dropdown 
            placeholder='Categoria' 
            fluid 
            search 
            selection 
            options={categoriesFormat} 
            value = {formik.values.category}
            error = {formik.errors.category}
            onChange={(_, data) => formik.setFieldValue('category', data.value)}
        />

        <div className='add-edit-product-form__active'>
            <Checkbox 
                toggle 
                checked = {formik.values.active} 
                onChange={(_, data) => formik.setFieldValue('active', data.checked)}
            />
                Producto Activo
        </div>

        <div className='add-edit-product-form__active'>
            <Checkbox 
                toggle 
                checked = {formik.values.dish_day} 
                onChange={(_, data) => formik.setFieldValue('dish_day', data.checked)}
            />
                Plato del Día
        </div>


        <Button type='button' fluid {...getRootProps()} color={formik.errors.image && 'red'}>
            {
                previewImage ? 'Cambiar Imagen' : 'Subir Imagen'
            }
        </Button>

        <input {...getInputProps()}/>

        <Image src={previewImage} />
        

        <Button type='submit'primary fluid content={product ? 'Actualizar' : 'Crear'}/>
    </Form>
  )
}


function formatDropdownData(data) {
    return map(data,(item) => ({
      key: item.id,
      text: item.title,
      value: item.id,
    }));
}

function initialValues(data) {
    return {
        title: data?.title || '',
        description: data?.description || '',
        price: data?.price || '',
        image: '',
        category: data?.category || '',
        active: data?.active ? true : false,
        dish_day: data?.dish_day ? true : false,
    }
}

function newSchema() {
    return {
        title: Yup.string().required('Ingrese un nombre de producto'),
        description: Yup.string(),
        price: Yup.number().required('Ingrese un precio'),
        image: Yup.string().required(true),
        category: Yup.number().required('Seleccione una categoria'),
        active: Yup.boolean().required('Seleccione un estado'),
        dish_day: Yup.boolean().required('Seleccione un estado'),
    }
}

function updateSchema() {
    return {
        title: Yup.string().required('Ingrese un nombre de producto'),
        description: Yup.string(),
        price: Yup.number().required('Ingrese un precio'),
        image: Yup.string(),
        category: Yup.number().required('Seleccione una categoria'),
        active: Yup.boolean().required('Seleccione un estado'),
        dish_day: Yup.boolean().required('Seleccione un estado'),
    }
}