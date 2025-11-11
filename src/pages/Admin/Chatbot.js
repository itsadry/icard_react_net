import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { sendMessageToChatbot, resetChatbotSession } from "../../api/chatbot"; // API de comunicación
import "../../scss/Chatbot.scss";  // Asegúrate de importar el archivo SCSS

export function Chatbot( props) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const { tableNumber } = props; // Obtiene el número de mesa desde las props
    
    // Efecto para resetear la sesión cuando se carga o recarga la página
    useEffect(() => {
        const resetSession = async () => {
            try {
                await resetChatbotSession();
                console.log("Sesión del chatbot reiniciada");
                // También podemos enviar un mensaje de bienvenida inicial
                addMessage("¡Hola! ¿En qué puedo ayudarte?", "bot");
            } catch (error) {
                console.error("Error al reiniciar la sesión del chatbot:", error);
            }
        };
        
        resetSession();
        
        // También podemos escuchar el evento de recarga de la página
        const handleBeforeUnload = () => {
            localStorage.setItem('chatReloaded', 'true');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    const addMessage = (text, sender = "user") => {
        setMessages((prevMessages) => [...prevMessages, { text, sender }]);
    };

    const formatMenu = (menu) => {
      let menuHTML = `
          <table class="menu-table">
          <thead>
              <tr><th>Categoría</th><th>Producto</th><th>Precio</th></tr>
          </thead>
          <tbody>
      `;
  
      Object.keys(menu).forEach((category) => {
          const products = menu[category];
          products.forEach((product, index) => {
              menuHTML += `<tr>`;
              if (index === 0) {
                  menuHTML += `<td rowspan="${products.length}">${category}</td>`;
              }
              menuHTML += `<td>${product.name}</td><td>$${product.price}</td></tr>`;
          });
      });
  
      menuHTML += `</tbody></table>`;
      return menuHTML;
    };


    const formatCategoryProducts = (text) => {
        const prefix = "¡Genial! Aquí están los productos disponibles en la categoría seleccionada:";
        if (text.startsWith(prefix)) {
            // Extrae el mensaje y los productos
            let productsText = text.replace(prefix, "").trim();
            // Quita cualquier numeración y guión al inicio
            productsText = productsText.replace(/^\d+\.\s*-\s*/, "");
            // Divide por " - "
            const products = productsText
                .split(" - ")
                .map(p => p.trim())
                .filter(p => p !== "");
            let html = `<div class="category-products"><div class="category-msg" style="margin-bottom:8px;">${prefix}</div><ol style="margin:0; padding-left:1.2em;">`;
            products.forEach(product => {
                html += `<li>${product}</li>`;
            });
            html += `</ol></div>`;
            return html;
        }
        return null;
    };

    // Formatea mensajes generales en <p>
    const formatGeneral = (text) => {
        // Si ya es HTML, no lo envuelvas de nuevo
        if (text.startsWith("<") && text.endsWith(">")) return text;
        return `<p>${text}</p>`;
    };



    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        addMessage(userMessage, "user");
        setInputMessage("");

        try {
            // Obtener el ID de usuario del localStorage
            const userId = localStorage.getItem('chatbotUserId');
            // Detectar si es recarga de página
            const isPageReload = localStorage.getItem('chatReloaded') === 'true';
            if (isPageReload) {
                localStorage.removeItem('chatReloaded'); // Limpiar la bandera
            }
            
            const response = await sendMessageToChatbot(userMessage, tableNumber, userId, isPageReload); // Envía el mensaje al backend
            
            
            if (response.menu) {
                addMessage(formatMenu(response.menu), "bot");
                } else if (response.response) {
                    // Intenta formatear si es una respuesta de productos de categoría
                    const formatted = formatCategoryProducts(response.response);
                    if (formatted) {
                        addMessage(formatted, "bot");
                    } else {
                        addMessage(formatGeneral(response.response), "bot");
                    }
                } else {
                    addMessage(formatGeneral("No entendí tu mensaje. Intenta de nuevo."), "bot");
                }
        } catch (error) {
            addMessage("Error al comunicarse con el chatbot.", "bot");
        }
    };

    // Función que se activa cuando se presiona una tecla en el textarea
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {  // Si se presiona "Enter" sin la tecla Shift
            e.preventDefault();  // Evitar el salto de línea
            handleSendMessage(); // Enviar el mensaje
        }
    };

    

    return (
        <div className="container">
            <div className="chatbot-container">
                <h1 className="chat-title">Gold Garden Chatbot</h1>

                {/* Historial de mensajes */}
                <div className="chat-history">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender}`}
                            dangerouslySetInnerHTML={{ __html: msg.text }} // Permite mostrar tablas HTML
                        />
                    ))}
                </div>

                {/* Campo de entrada */}
                <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Escribe tu mensaje aquí..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}  // Detectar tecla presionada
                ></textarea>

                {/* Botón de enviar */}
                <button onClick={handleSendMessage} className="btn btn-gold btn-lg mt-3 w-100">
                    Enviar
                </button>
            </div>
        </div>
    );
}