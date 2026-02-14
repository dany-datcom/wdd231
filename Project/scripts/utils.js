export function filterByCategory(products, category) {
    return products.filter(product => 
        category === 'all' || product.category === category
    );
}


export function mapProductsForDisplay(products) {
    return products.map(product => ({
        ...product,
        displayPrice: `$${product.price.toFixed(2)}`,
        shortDescription: product.description.length > 50 
            ? product.description.substring(0, 50) + '...' 
            : product.description
    }));
}


export function calculateCartTotal(cartItems) {
    return cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    ).toFixed(2);
}

/**
 * 4. find() - Encuentra un producto por ID
 */
export function findProductById(products, productId) {
    return products.find(product => product.id === productId);
}

/**
 * 5. sort() - Ordena productos por precio
 */
export function sortProductsByPrice(products, order = 'asc') {
    return [...products].sort((a, b) => 
        order === 'asc' ? a.price - b.price : b.price - a.price
    );
}

/**
 * 6. forEach() - Actualiza elementos del DOM
 */
export function updateProductElements(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach((product, index) => {
        const element = createProductElement(product, index);
        container.appendChild(element);
    });
}

/**
 * 7. some() - Verifica si hay productos en stock
 */
export function hasInStockProducts(products) {
    return products.some(product => product.stock > 0);
}

/**
 * 8. every() - Verifica si todos los productos son destacados
 */
export function areAllFeatured(products) {
    return products.every(product => product.featured);
}

/**
 * 9. findIndex() - Encuentra índice de un producto
 */
export function findProductIndex(products, productId) {
    return products.findIndex(product => product.id === productId);
}

/**
 * Crea elemento HTML para producto (usado en forEach)
 */
function createProductElement(product, index) {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.style.animationDelay = `${index * 0.05}s`;
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.displayPrice}</p>
    `;
    return div;
}

/**
 * Valida email
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida teléfono
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Formatea fecha
 */
export function formatDate(date, format = 'short') {
    const dateObj = new Date(date);
    const options = {
        short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        long: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    };
    
    return dateObj.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Genera ID único
 */
export function generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function para optimizar eventos
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function para optimizar eventos
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Clona objeto profundo
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Mezcla array aleatoriamente
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Calcula descuento
 */
export function calculateDiscount(originalPrice, discountPercent) {
    const discountAmount = originalPrice * (discountPercent / 100);
    return {
        discountedPrice: originalPrice - discountAmount,
        discountAmount: discountAmount
    };
}

/**
 * Obtiene parámetros de URL
 */
export function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

/**
 * Establece parámetros de URL
 */
export function setUrlParams(params) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

/**
 * Capitaliza primera letra
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formatea número con separadores de miles
 */
export function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Verifica si es dispositivo móvil
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ) || window.innerWidth <= 768;
}

/**
 * Verifica si es dispositivo táctil
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
}

/**
 * Previene el comportamiento por defecto y propaga el evento
 */
export function preventDefaultAndPropagate(e, callback) {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback(e);
}

/**
 * Ejecuta función cuando el DOM esté listo
 */
export function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}