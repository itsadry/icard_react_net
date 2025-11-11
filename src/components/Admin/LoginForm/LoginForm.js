import React from 'react'
import {Button,Form} from 'semantic-ui-react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {toast} from 'react-toastify'

import { useNavigate } from 'react-router-dom';
import{loginApi} from '../../../api/user'
import{useAuth} from '../../../hooks'
import './LoginForm.scss'

export function LoginForm() {
  const navigate = useNavigate();
  const{login}= useAuth();

  

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formValue) => {
      try {
        const response = await loginApi(formValue)
        const {access} = response
        login(access)
        
      }catch (error) {
        console.log('error')
        console.log(error)

        toast.error(error.message)
      }
    }}) 

    const handleForgotPassword = () => {
      navigate('/admin/forgot-password');  // Redirigir a la página de recuperación de contraseña
    };

  return (
    <Form className='login-form-admin' onSubmit={formik.handleSubmit}>
      <Form.Input 
        name = 'email' 
        placeholder = 'Correo electronico' 
        value = {formik.values.email}
        onChange={formik.handleChange}
        error = {formik.errors.email}
      />
      <Form.Input 
        name = 'password' 
        type = 'password' 
        placeholder = 'Contraseña' 
        value = {formik.values.password}
        onChange={formik.handleChange}
        error = {formik.errors.password}
      />

      <a href="#" onClick={handleForgotPassword} className="forgot-password-link">¿Olvidaste tu contraseña?</a>
      <Button type = 'submit' content="Iniciar sesion" primary fluid/>
      
    </Form>
  )
}


function initialValues() {
  return {
    email: '',
    password: ''
  }
}

function validationSchema() {
  return {
    email: Yup.string().email('Correo electronico no valido').required('Ingrese un correo electronico'),
    password: Yup.string().required('Ingrese una contraseña')
  }
}