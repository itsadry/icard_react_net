import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { sendResetPasswordEmail } from '../../../api/user';  // Función para enviar el correo de recuperación
import './ForgotPasswordForm.scss';

export function ForgotPasswordForm() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo electrónico no válido').required('Ingrese un correo electrónico')
    }),
    onSubmit: async (formValue) => {
      try {
        await sendResetPasswordEmail(formValue.email);  // Llamar a la API para enviar el correo
        toast.success('Te hemos enviado un correo para restablecer tu contraseña.');
      } catch (error) {
        toast.error('Hubo un error al intentar enviar el correo de recuperación.');
      }
    }
  });

  return (
    <Form className='forgot-password-form' onSubmit={formik.handleSubmit}>
      <Form.Input 
        name='email' 
        placeholder='Correo electrónico' 
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email}
      />
      <Button type='submit' content="Enviar correo de recuperación" primary fluid />
    </Form>
  );
}
