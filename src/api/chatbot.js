import { BASE_API } from '../utils/constants';

export async function sendMessageToChatbot(message, tableNumber, userId = null, isPageReload = false) {
    try {
        const url = `${BASE_API}/api/ml/chatbot/`; // Ruta de la API en Django
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message,
                table_number: tableNumber,
                user_id: userId || localStorage.getItem('chatbotUserId') || generateUserId(),
                is_page_reload: isPageReload
            }), // Envía el mensaje del usuario
        };
        
        // Almacenar el ID de usuario para futuras solicitudes
        if (!userId && !localStorage.getItem('chatbotUserId')) {
            const generatedId = JSON.parse(params.body).user_id;
            localStorage.setItem('chatbotUserId', generatedId);
        }
        
        const response = await fetch(url, params);
        const result = await response.json();
        return result; // Devuelve la respuesta del chatbot
    } catch (error) {
        console.error("Error al enviar mensaje al chatbot:", error);
        throw error;
    }
}

export async function resetChatbotSession(tableNumber) {
    try {
        const userId = localStorage.getItem('chatbotUserId') || generateUserId();
        const url = `${BASE_API}/api/ml/chatbot/reset-session/`;
        
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: userId
            }),
        };
        
        const response = await fetch(url, params);
        const result = await response.json();
        
        // También podríamos generar un nuevo ID después del reset
        // localStorage.setItem('chatbotUserId', generateUserId());
        
        return result;
    } catch (error) {
        console.error("Error al resetear la sesión del chatbot:", error);
        throw error;
    }
}

// Función para generar un ID de usuario único
function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

//----------------------------------------------------------------------------------------------------------------------------------------------//
export async function sendMessageToChatbot1(message, tableNumber, userId = null, isPageReload = false) {
    try {
        const url = `${BASE_API}/api/ml/chatbot1/`; // Ruta de la API en Django
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message,
                table_number: tableNumber,
                user_id: userId || localStorage.getItem('chatbotUserId') || generateUserId(),
                is_page_reload: isPageReload
            }), // Envía el mensaje del usuario
        };
        
        // Almacenar el ID de usuario para futuras solicitudes
        if (!userId && !localStorage.getItem('chatbotUserId')) {
            const generatedId = JSON.parse(params.body).user_id;
            localStorage.setItem('chatbotUserId', generatedId);
        }
        
        const response = await fetch(url, params);
        const result = await response.json();
        return result; // Devuelve la respuesta del chatbot
    } catch (error) {
        console.error("Error al enviar mensaje al chatbot1:", error);
        throw error;
    }
}

export async function resetChatbotSession1(tableNumber) {
    try {
        const userId = localStorage.getItem('chatbotUserId') || generateUserId1();
        const url = `${BASE_API}/api/ml/chatbot1/reset-session/`;
        
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: userId,
                table_number: tableNumber // Añadimos el número de mesa 
            }),
        };
        
        const response = await fetch(url, params);
        const result = await response.json();
        
        // También podríamos generar un nuevo ID después del reset
        // localStorage.setItem('chatbotUserId', generateUserId());
        
        return result;
    } catch (error) {
        console.error("Error al resetear la sesión del chatbot1:", error);
        throw error;
    }
}

// Función para generar un ID de usuario único
function generateUserId1() {
    return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
