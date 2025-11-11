import{BASE_API} from '../utils/constants'
import { TOKEN } from '../utils/constants';

export async function loginApi(formValue) {
    try {
        const url =`${BASE_API}/api/auth/login/`
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValue)
        }

        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Usuario o contraseña incorrectos');
        }
        const result = await response.json()
        return result
        
    } catch (error) {
        throw error
    }
}


export async function getMeApi(token) {
    try {
        const url =`${BASE_API}/api/auth/me/`
        const params = {
            
            headers: {
                
                Authorization: `Bearer ${token}`
            }
        }
        const response = await fetch(url, params);
        const result= await response.json()
        return result
    } catch (error) {
        throw error
    }
}


export async function getUsersApi(token) {
    try {    
        const url =`${BASE_API}/api/users/`
        const params = {
            
            headers: {
                
                Authorization: `Bearer ${token}`
            }
        }
        const response = await fetch(url, params);
        const result= await response.json()
        return result
    }
    catch (error) {
        throw error
    }
}

export async function addUserApi(data,token) {
    try {
        const url =`${BASE_API}/api/users/`
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, params);
        const result= await response.json()
        return result
    }catch (error) {
        throw error
    }
}


export async function updateUserApi(id,data,token) {
    try {
        const url =`${BASE_API}/api/users/${id}/`
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, params);
        const result= await response.json()
        return result
    }catch (error) {
        throw error
    }
}

export async function deleteUserApi(id,token) {
    try {
        const url =`${BASE_API}/api/users/${id}/`
        const params = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const response = await fetch(url, params);
        const result= await response.json()
        return result
    }catch (error) {
        throw error
    }
}


export async function sendResetPasswordEmail(email) {
    try {
      const url = `${BASE_API}/api/auth/forgot-password/`
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      };
      const response = await fetch(url, params);
      const data = await response.json();  // Asegúrate de manejar siempre la respuesta como JSON
 
      if (!response.ok) {  // Verifica si la respuesta fue exitosa (status >= 200 y < 300)
        throw new Error(data.error || 'No se pudo enviar el correo de recuperación.');
      }
      return data;  // Retorna el JSON de la respuesta
 
    } catch (error) {
      throw error;
    }
 }

 export async function sendResetPassword(uid, token1, password) {
    try {
        // Paso 1: Verificar el token de recuperación de contraseña (esto es necesario para validar el enlace)
        const url = `${BASE_API}/api/auth/reset-password/${uid}/${token1}/`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })  // Solo enviamos la nueva contraseña
        };

        const response = await fetch(url, params);
        const data = await response.json();  // Procesamos la respuesta como JSON

        if (!response.ok) {  // Si el token no es válido, mostramos el error
            throw new Error(data.error || 'No se pudo restablecer la contraseña.');
        }

        // Paso 2: Si el token es válido, procedemos con la actualización de la contraseña utilizando el token JWT
        const token = localStorage.getItem(TOKEN);  // Obtenemos el token JWT de autenticación
        if (!token) {
            throw new Error("Token de autenticación no disponible");
        }

        // Paso 3: Usamos el token JWT para hacer una solicitud PATCH a la API de actualización de usuario
        const userId = uid;  // Usamos el uid para identificar al usuario
        const updateResponse = await updateUserApi(userId, { password }, TOKEN);  // Actualizamos la contraseña

        if (updateResponse.error) {
            throw new Error(updateResponse.error || 'No se pudo actualizar la contraseña del usuario.');
        }

        return updateResponse;  // Retornamos la respuesta exitosa

    } catch (error) {
        throw error;
    }
}

