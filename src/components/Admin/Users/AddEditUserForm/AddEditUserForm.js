import React from 'react'
import {Form, Button, Checkbox} from 'semantic-ui-react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useUser } from '../../../../hooks'
import './AddEditUserForm.scss'
import { use } from 'react'


export function AddEditUserForm(props) {

    const {onClose, onRefetch, user} = props
    const {addUser, updateUser} = useUser();

    const formik = useFormik({
        initialValues: initialValues(user),
        validationSchema: Yup.object(user?updateSchema():newSchema()),
        validateOnChange: false,
        onSubmit: async (formValue) => {
            try {
                if (user) await updateUser(user.id, formValue);
                else await addUser(formValue);
                onRefetch();
                onClose();
                
            } catch (error) {
                console.log(error);
            }
        }
    })

  return (
    <Form className='add-edit-user-form' onSubmit={formik.handleSubmit}>
        <Form.Input name= 'username' placeholder='Nombre del usuario' 
            value = {formik.values.username} 
            onChange={formik.handleChange}
            error = {formik.errors.username}
        />
        <Form.Input name= 'email' placeholder='Correo Electronico' 
            value = {formik.values.email} 
            onChange={formik.handleChange}
            error = {formik.errors.email}
        />
        <Form.Input name= 'first_name' placeholder='Nombre' 
            value = {formik.values.first_name} 
            onChange={formik.handleChange}
            error = {formik.errors.first_name}
        />
        <Form.Input name= 'last_name' placeholder='Apellidos' 
            value = {formik.values.last_name} 
            onChange={formik.handleChange}
            error = {formik.errors.last_name}
        />
        <Form.Input name= 'password' type='password' placeholder='Contraseña' 
            value = {formik.values.password} 
            onChange={formik.handleChange}
            error = {formik.errors.password}
        />        
          
          <div className='add-edit-user-form__active'>
            <Checkbox 
                toggle 
                checked = {formik.values.is_active} 
                onChange={(_, data) => formik.setFieldValue('is_active', data.checked)} 
            /> 
            Usuario activo
          </div>

          <div className='add-edit-user-form__staff'>
            <Checkbox 
                toggle 
                checked = {formik.values.is_staff} 
                onChange={(_, data) => formik.setFieldValue('is_staff', data.checked)} 
            /> 
            Usuario administrador
          </div>
        
          <Button type='submit' primary fluid content={user ? 'Actualizar' : 'Crear'}/>
        
    </Form>
  )
}

function initialValues(data) {
    return {
        username:data?.username || '',
        email:data?.email ||'',
        first_name:data?.first_name ||'',
        last_name:data?.last_name ||'',
        password:'',
        is_active: data?.is_active ? true : false,
        is_staff: data?.is_staff ? true : false,
    }
}


function newSchema() {
    return {
        username: Yup.string().required('Ingrese un nombre de usuario'),
        email: Yup.string().email('Correo electronico no valido').required('Ingrese un correo electronico'),
        first_name: Yup.string(),
        last_name: Yup.string(),
        password: Yup.string().required('Ingrese una contraseña'),
        is_active: Yup.bool().required(true),
        is_staff: Yup.bool().required(true),
    }
}
function updateSchema() {
    return {
        username: Yup.string().required('Ingrese un nombre de usuario'),
        email: Yup.string().email('Correo electronico no valido').required('Ingrese un correo electronico'),
        first_name: Yup.string(),
        last_name: Yup.string(),
        password: Yup.string(),
        is_active: Yup.bool().required(true),
        is_staff: Yup.bool().required(true),
    }
}