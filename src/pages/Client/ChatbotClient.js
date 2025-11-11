import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { sendMessageToChatbot1, resetChatbotSession1 } from "../../api/chatbot"; // API de comunicación
import "../../scss/Chatbot.scss";  // Asegúrate de importar el archivo SCSS
import { useParams } from 'react-router-dom';

export function Chatbot(props) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const chatHistoryRef = useRef(null);
    const params = useParams();
    const tableNumber = params.tableNumber; // Obtener número de mesa desde la URL
    
    // Imprime el valor de tableNumber en la consola cuando el componente se monta
    console.log("Número de mesa recibido:", tableNumber);
    
    // Efecto para resetear la sesión cuando se carga o recarga la página
    useEffect(() => {
        const resetSession = async () => {
            try {
                // Pasar el tableNumber a la función resetChatbotSession1
                await resetChatbotSession1(tableNumber);
                console.log("Sesión del chatbot reiniciada");
                console.log("Número de mesa en useEffect:", tableNumber);
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
        
        // Hacer scroll hacia abajo cuando se añaden mensajes
        setTimeout(() => {
            if (chatHistoryRef.current) {
                chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
            
            // Inicializar el menú si se acaba de añadir uno
            if (text.includes('menu-book-container') && sender === 'bot') {
                setTimeout(initializeMenu, 200);
            }
        }, 100);
    };
    
    // Función para inicializar el comportamiento del menú
    const initializeMenu = () => {
        const pages = document.querySelectorAll('.menu-page');
        if (pages.length > 0) {
            pages.forEach((page, index) => {
                if (index === 0) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        }
    };

    const formatMenu = (menu) => {
      // Convertir el objeto de menú en un array de categorías para facilitar la paginación
      const categoriesArray = Object.keys(menu).map(category => ({
          name: category,
          products: menu[category]
      }));
      
      // Crear el HTML del libro del menú con clase para centrado
      let menuHTML = `
        <div class="menu-wrapper" style="width: 100%; display: flex; justify-content: center; position: relative;">
          <div class="menu-book-container">
            <div class="menu-book-cover" onclick="document.querySelector('.menu-book-container').classList.add('expanded')">
              <div class="menu-book-cover-content">
                <h2>Menú Gold Garden</h2>
                <p>Haz clic para abrir</p>
              </div>
            </div>
          
          <div class="menu-book-pages">
            <div class="menu-book-header">
              <button class="menu-close-btn" style="position: absolute; top: 10px; right: 10px; z-index: 9999;" onclick="document.querySelector('.menu-book-container').classList.remove('expanded')">
                <i class="fas fa-times" style="color: #9c7a2a; font-size: 18px;"></i>
              </button>
            </div>
            
            <div class="menu-book-content">
              <div class="menu-book-inner">
      `;
      
      // Generar una página para cada categoría
      categoriesArray.forEach((category, categoryIndex) => {
          menuHTML += `
            <div class="menu-page" data-page="${categoryIndex + 1}">
              <div class="menu-page-header">
                <h3>${category.name}</h3>
              </div>
              <div class="menu-page-content">
                <ul class="menu-items-list">
          `;
          
          // Añadir cada producto a la página
          category.products.forEach(product => {
              menuHTML += `
                <li class="menu-item">
                  <span class="menu-item-name">${product.name}</span>
                  <span class="menu-item-price">$${product.price}</span>
                </li>
              `;
          });
          
          menuHTML += `
                </ul>
              </div>
            </div>
          `;
      });
      
      // Cerrar la estructura del libro
      menuHTML += `
              </div>
            </div>
            
            <div class="menu-book-navigation">
              <button class="menu-nav-btn prev-btn" onclick="
                const book = document.querySelector('.menu-book-inner');
                const pages = book.querySelectorAll('.menu-page');
                const activePage = book.querySelector('.menu-page.active') || pages[0];
                const currentIndex = Array.from(pages).indexOf(activePage);
                if (currentIndex > 0) {
                  pages.forEach(p => p.classList.remove('active'));
                  pages[currentIndex - 1].classList.add('active');
                  document.querySelector('.menu-page-indicator').textContent = \`\${currentIndex} / \${pages.length}\`;
                }
              ">
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <span class="menu-page-indicator">1 / ${categoriesArray.length}</span>
              
              <button class="menu-nav-btn next-btn" onclick="
                const book = document.querySelector('.menu-book-inner');
                const pages = book.querySelectorAll('.menu-page');
                const activePage = book.querySelector('.menu-page.active') || pages[0];
                const currentIndex = Array.from(pages).indexOf(activePage);
                if (currentIndex < pages.length - 1) {
                  pages.forEach(p => p.classList.remove('active'));
                  pages[currentIndex + 1].classList.add('active');
                  document.querySelector('.menu-page-indicator').textContent = \`\${currentIndex + 2} / \${pages.length}\`;
                }
              ">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        </div>
        
        <script>
          // Inicializar la primera página como activa y centrar el menú
          setTimeout(function() {
            const menuBook = document.querySelector('.menu-book-inner');
            const menuContainer = document.querySelector('.menu-book-container');
            
            // Centrar el contenedor del menú
            if (menuContainer) {
              menuContainer.style.margin = "0 auto";
              menuContainer.style.left = "50%";
              menuContainer.style.transform = "translateX(-50%)";
            }
            
            if (menuBook) {
              const pages = menuBook.querySelectorAll('.menu-page');
              if (pages.length > 0) {
                pages[0].classList.add('active');
              }
              
              // También aseguramos que los botones de navegación funcionan
              document.querySelectorAll('.menu-nav-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                  e.stopPropagation();
                });
              });
            }
          }, 300);
        </script>
      `;
      
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
                
                const response = await sendMessageToChatbot1(userMessage, tableNumber, userId, isPageReload); // Envía el mensaje al backend
                
                
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
        <div className="container-fluid p-0">
            <div className="chatbot-container">
                <h1 className="chat-title">Gold Garden Chatbot</h1>

                {/* Historial de mensajes */}
                <div className="chat-history" ref={chatHistoryRef}>
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