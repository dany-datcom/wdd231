// ui.js - Utilidades de interfaz de usuario

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info, warning)
 * @param {number} duration - Duración en milisegundos
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Icono según tipo
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    // Estilos CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            box-shadow: var(--shadow-lg);
            font-family: var(--font-secondary);
            font-size: 0.95rem;
        }
        
        .notification-success {
            background-color: #4CAF50;
            color: white;
            border-left: 4px solid #2E7D32;
        }
        
        .notification-error {
            background-color: #f44336;
            color: white;
            border-left: 4px solid #c62828;
        }
        
        .notification-info {
            background-color: #2196F3;
            color: white;
            border-left: 4px solid #1565C0;
        }
        
        .notification-warning {
            background-color: #ff9800;
            color: white;
            border-left: 4px solid #ef6c00;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        styles.id = 'notification-styles';
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Botón para cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Remover automáticamente después de la duración
    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Función para remover notificación
    function removeNotification(notificationElement) {
        clearTimeout(timeout);
        notificationElement.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
        }, 300);
    }
    
    // Pausar timeout al hacer hover
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });
    
    notification.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            removeNotification(notification);
        }, duration);
    });
}

/**
 * Muestra indicador de carga
 * @param {HTMLElement} container - Contenedor donde mostrar el loading
 * @param {string} message - Mensaje de carga
 */
export function showLoading(container = document.body, message = 'Loading...') {
    const loadingId = 'loading-indicator';
    let loader = document.getElementById(loadingId);
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = loadingId;
        loader.className = 'loading-overlay';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-live', 'polite');
        
        loader.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        
        // Estilos CSS para loading
        const styles = document.createElement('style');
        styles.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(3px);
            }
            
            .loading-content {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid var(--soft-accent);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            .loading-message {
                color: var(--dark-contrast);
                font-size: 1.1rem;
                margin: 0;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        if (!document.querySelector('#loading-styles')) {
            styles.id = 'loading-styles';
            document.head.appendChild(styles);
        }
    }
    
    if (container === document.body) {
        document.body.appendChild(loader);
    } else {
        container.innerHTML = '';
        container.appendChild(loader);
    }
}

/**
 * Oculta el indicador de carga
 */
export function hideLoading(container = document.body) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        if (container === document.body) {
            loader.remove();
        } else if (container.contains(loader)) {
            container.removeChild(loader);
        }
    }
}

/**
 * Muestra mensaje de error
 * @param {HTMLElement} container - Contenedor donde mostrar el error
 * @param {string} message - Mensaje de error
 * @param {boolean} showRetry - Mostrar botón de reintentar
 */
export function showError(container, message, showRetry = false) {
    const errorId = 'error-message';
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'assertive');
    }
    
    errorElement.innerHTML = `
        <div class="error-content">
            <span class="error-icon">❌</span>
            <p class="error-text">${message}</p>
            ${showRetry ? '<button class="dama-btn dama-btn-secondary" id="retry-error">Try Again</button>' : ''}
        </div>
    `;
    
    errorElement.hidden = false;
    
    // Estilos CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .error-message {
            background-color: #ffebee;
            border: 2px solid #f44336;
            border-radius: var(--border-radius-md);
            padding: 1.5rem;
            margin: 1rem 0;
            animation: fadeIn 0.3s ease;
        }
        
        .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
        }
        
        .error-icon {
            font-size: 2rem;
            color: #f44336;
        }
        
        .error-text {
            color: #c62828;
            margin: 0;
            font-size: 1.1rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    if (!document.querySelector('#error-styles')) {
        styles.id = 'error-styles';
        document.head.appendChild(styles);
    }
    
    // Agregar al contenedor
    if (container) {
        container.innerHTML = '';
        container.appendChild(errorElement);
    }
    
    // Botón de reintentar
    if (showRetry) {
        document.getElementById('retry-error')?.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

/**
 * Oculta mensaje de error
 */
export function hideError(container = null) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        if (container && container.contains(errorElement)) {
            container.removeChild(errorElement);
        } else {
            errorElement.hidden = true;
        }
    }
}

/**
 * Actualiza el contador del carrito en la UI
 * @param {number} count - Cantidad de items en el carrito
 */
export function updateCartUI(count) {
    const cartCounts = document.querySelectorAll('.cart-count');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartHasItems = document.querySelector('.cart-has-items');
    
    cartCounts.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
        element.setAttribute('aria-label', `${count} items in cart`);
    });
    
    // Mostrar/ocultar estados vacío/lleno
    if (cartEmpty) cartEmpty.hidden = count > 0;
    if (cartHasItems) cartHasItems.hidden = count === 0;
}

/**
 * Formatea precio como moneda
 * @param {number} price - Precio a formatear
 * @param {string} currency - Código de moneda
 * @returns {string} Precio formateado
 */
export function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);
}

/**
 * Trunca texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Alterna tema claro/oscuro
 */
export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showNotification(`Switched to ${newTheme} theme`, 'info');
}

/**
 * Inicializa el tema guardado
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Agregar estilos para tema oscuro
    const darkStyles = `
        [data-theme="dark"] {
            --primary-color: #9C6AE2;
            --secondary-color: #8A7AA3;
            --background-light: #1A172A;
            --soft-accent: #2A2640;
            --dark-contrast: #E8D7FF;
            --text-color: #FAF7FF;
            --white: #2A2640;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'theme-styles';
    style.textContent = darkStyles;
    document.head.appendChild(style);
}

/**
 * Maneja errores de imágenes
 */
export function handleImageError(imgElement, fallbackText = 'Image') {
    const placeholder = `https://via.placeholder.com/300x400/E8D7FF/9C89B8?text=${encodeURIComponent(fallbackText)}`;
    imgElement.src = placeholder;
    imgElement.alt = `Placeholder for ${fallbackText}`;
}

/**
 * Agrega animación de entrada a elementos
 */
export function addEntranceAnimation(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

/**
 * Hace scroll suave a un elemento
 */
export function smoothScrollTo(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}