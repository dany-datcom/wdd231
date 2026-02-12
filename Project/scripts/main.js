// main.js - VERSIÓN COMPLETA Y CORREGIDA
// ==============================================
// IMPORTAR MÓDULOS
// ==============================================
import { CartStorage, FavoritesStorage } from './storage.js';
import { ModalManager } from './modal.js';
import { loadProducts, getProducts, filterProductsByCategory, getFeaturedProducts } from './products.js';
import { showNotification, showLoading, hideLoading, initTheme } from './ui.js';
import { initContactForm } from './contact-form.js';

// ==============================================
// VARIABLES GLOBALES
// ==============================================
let cart = null;
let favorites = null;
let modalManager = null;
let currentProducts = [];

// ==============================================
// EXPONER CLASES GLOBALMENTE
// ==============================================
window.CartStorage = CartStorage;
window.FavoritesStorage = FavoritesStorage;
window.ModalManager = ModalManager;

// ==============================================
// FUNCIÓN PRINCIPAL
// ==============================================
async function initApp() {
    console.log('🚀 Iniciando Dama Shop...');
    
    try {
        showLoading();
        initTheme();
        
        // Inicializar sistemas
        cart = new CartStorage();
        favorites = new FavoritesStorage();
        modalManager = new ModalManager();
        
        // ===== EXPONER GLOBALMENTE =====
        window.cart = cart;
        window.favorites = favorites;
        window.modalManager = modalManager;
        window.currentProducts = currentProducts;
        
        // Cargar productos
        await loadProducts();
        currentProducts = getProducts();
        window.productsData = currentProducts;
        window.allProducts = currentProducts;
        
        // Inicializar página
        await initPage();
        
        // Inicializar eventos globales
        initEventListeners();
        updateUI();
        
        console.log('✅ Aplicación inicializada');
        console.log('🛒 Cart:', !!window.cart);
        console.log('❤️ Favorites:', !!window.favorites);
        console.log('📦 Productos:', window.productsData?.length);
        
    } catch (error) {
        console.error('❌ Error:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error loading application', 'error');
        }
    } finally {
        hideLoading();
    }
}

// ==============================================
// INICIALIZACIÓN DE PÁGINAS
// ==============================================
async function initPage() {
    const page = getCurrentPage();
    
    switch(page) {
        case 'home':
            await initHomePage();
            break;
        case 'products':
            await initProductsPage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'form-action':
            initFormActionPage();
            break;
        case 'attributions':
            initAttributionsPage();
            break;
    }
}

async function initHomePage() {
    console.log('🏠 Inicializando home...');
    
    const featured = getFeaturedProducts();
    renderProducts(featured.slice(0, 6), 'featured-products');
    
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.innerHTML = `Showing <span>${featured.slice(0, 6).length}</span> featured products`;
    }
    
    initMobileMenu();
    initSearch();
    initNewsletter();
}

async function initProductsPage() {
    console.log('🛍️ Inicializando productos...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const search = urlParams.get('search') || '';
    const sort = urlParams.get('sort') || 'default';
    
    let products = filterProductsByCategory(category);
    
    if (search) {
        const searchTerm = search.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    currentProducts = [...products];
    applySorting(sort);
    
    initFilters();
    initSorting();
    initMobileMenu();
    initSearch();
    
    if (search) {
        const searchInfo = document.getElementById('search-info');
        const searchTerm = document.getElementById('search-term');
        if (searchInfo && searchTerm) {
            searchTerm.textContent = search;
            searchInfo.hidden = false;
        }
    }
}

function initContactPage() {
    console.log('📞 Inicializando contacto...');
    initContactForm();
    initMobileMenu();
    initNewsletter();
}

function initFormActionPage() {
    console.log('📋 Página de confirmación');
}

function initAttributionsPage() {
    console.log('📚 Página de atribuciones');
}

// ==============================================
// RENDERIZADO DE PRODUCTOS
// ==============================================
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}"
                     class="product-image"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400/E8D7FF/9C89B8?text=Product'">
                ${product.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <span class="product-category">${product.category}</span>
                <p class="product-description">${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}</p>
                
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" 
                            onclick="window.addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary toggle-favorite" 
                            onclick="window.toggleFavorite(${product.id})">
                        ${window.favorites?.isFavorite(product.id) ? '❤️' : '❤️'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateProductCount(products.length);
}

/**
 * Actualiza el contador de productos - CORREGIDO
 * @param {number} count - Número de productos visibles
 */
function updateProductCount(count) {
    // Para products.html - contador "Showing X of Y products"
    const productCount = document.getElementById('products-count') || 
                        document.getElementById('product-count');
    
    if (productCount) {
        // ✅ OBTENER TOTAL DE PRODUCTOS DE LA FUENTE CORRECTA
        let totalProducts = 0;
        
        // 1. Intentar con allProducts (global)
        if (window.allProducts && window.allProducts.length > 0) {
            totalProducts = window.allProducts.length;
        }
        // 2. Intentar con productsData
        else if (window.productsData && window.productsData.length > 0) {
            totalProducts = window.productsData.length;
        }
        // 3. Intentar con currentProducts
        else if (currentProducts && currentProducts.length > 0) {
            totalProducts = currentProducts.length;
        }
        // 4. Fallback - contar desde el JSON (async)
        else {
            // Intentar obtener productos de forma asíncrona
            import('./api.js').then(module => {
                module.fetchProducts().then(products => {
                    window.allProducts = products;
                    const total = products.length;
                    productCount.innerHTML = `Showing <span id="visible-count">${count}</span> of <span id="total-count">${total}</span> products`;
                });
            });
            return;
        }
        
        productCount.innerHTML = `Showing <span id="visible-count">${count}</span> of <span id="total-count">${totalProducts}</span> products`;
    }
    
    // Para index.html - contador "Showing X featured products"
    const featuredCount = document.getElementById('product-count');
    if (featuredCount && featuredCount !== productCount) {
        featuredCount.innerHTML = `Showing <span id="visible-count">${count}</span> featured products`;
    }
}

// ==============================================
// FILTROS
// ==============================================
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category') || 'all';
    
    console.log('🎯 Filtro activo:', activeCategory);
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        
        if (btn.dataset.filter === activeCategory) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    filterButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.dataset.filter;
            const url = new URL(window.location);
            url.searchParams.set('category', filter);
            window.location.href = url.toString();
        });
    });
}

// ==============================================
// ORDENAMIENTO
// ==============================================
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const activeSort = urlParams.get('sort') || 'default';
    
    sortSelect.value = activeSort;
    applySorting(activeSort);
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const url = new URL(window.location);
        url.searchParams.set('sort', sortValue);
        window.history.pushState({}, '', url);
        applySorting(sortValue);
    });
}

function applySorting(sortValue) {
    let products = [...currentProducts];
    
    if (products.length === 0) {
        products = window.productsData || [];
    }
    
    switch(sortValue) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        default:
            products.sort((a, b) => a.id - b.id);
            break;
    }
    
    currentProducts = products;
    
    if (document.getElementById('all-products')) {
        renderProducts(products, 'all-products');
    } else if (document.getElementById('featured-products')) {
        renderProducts(products, 'featured-products');
    }
}

// ==============================================
// BÚSQUEDA
// ==============================================
function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const closeSearch = document.getElementById('close-search');
    
    if (!searchToggle || !searchOverlay) return;
    
    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        window.openSearch();
    });
    
    if (closeSearch) {
        closeSearch.addEventListener('click', window.closeSearch);
    }
    
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            window.closeSearch();
        }
    });
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.performSearch();
            }
        });
    }
}

// ==============================================
// MENÚ MÓVIL
// ==============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });
    
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==============================================
// NEWSLETTER
// ==============================================
function initNewsletter() {
    const forms = document.querySelectorAll('#newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (!email.includes('@') || !email.includes('.')) {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Please enter a valid email', 'error');
                }
                return;
            }
            
            const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Thank you for subscribing!', 'success');
                }
            } else {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('Email already subscribed', 'info');
                }
            }
            
            this.reset();
        });
    });
}

// ==============================================
// EVENTOS GLOBALES
// ==============================================
function initEventListeners() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
    
    const cartToggle = document.getElementById('cart-toggle');
    const favoritesToggle = document.getElementById('favorites-toggle');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', window.openCartModal);
    }
    
    if (favoritesToggle) {
        favoritesToggle.addEventListener('click', window.openFavoritesModal);
    }
    
    document.getElementById('close-cart')?.addEventListener('click', () => {
        window.modalManager?.closeModal('cart-modal');
    });
    
    document.getElementById('close-favorites')?.addEventListener('click', () => {
        window.modalManager?.closeModal('favorites-modal');
    });
    
    document.getElementById('continue-shopping')?.addEventListener('click', () => {
        window.modalManager?.closeModal('cart-modal');
    });
}

function updateUI() {
    if (window.cart) {
        const count = window.cart.getItemCount();
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
}

// ==============================================
// FUNCIONES GLOBALES PARA CART - DISPONIBLES EN TODOS LOS HTML
// ==============================================
window.addToCart = function(productId) {
    if (!window.cart) {
        console.error('❌ Cart no inicializado');
        return false;
    }
    
    const product = window.productsData?.find(p => p.id === productId);
    if (product) {
        window.cart.addItem(product);
        updateUI();
        
        // 🟢 DISPARAR EVENTO PARA ACTUALIZAR MODAL
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        if (typeof window.showNotification === 'function') {
            window.showNotification(`"${product.name}" added to cart`, 'success');
        }
        return true;
    }
    return false;
};

window.removeFromCart = function(productId) {
    if (!window.cart) return false;
    window.cart.removeItem(productId);
    updateUI();
    
    // 🟢 DISPARAR EVENTO PARA ACTUALIZAR MODAL
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('Item removed from cart', 'info');
    }
    return true;
};

window.updateCartQuantity = function(productId, quantity) {
    if (!window.cart) return false;
    window.cart.updateQuantity(productId, quantity);
    updateUI();
    
    // 🟢 DISPARAR EVENTO PARA ACTUALIZAR MODAL
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return true;
};

window.clearCart = function() {
    if (!window.cart) return false;
    window.cart.clear();
    updateUI();
    if (typeof window.showNotification === 'function') {
        window.showNotification('Cart cleared', 'info');
    }
    return true;
};

window.getCartTotal = function() {
    if (!window.cart) return 0;
    return window.cart.getTotal();
};

window.getCartCount = function() {
    if (!window.cart) return 0;
    return window.cart.getItemCount();
};

// ==============================================
// FUNCIONES GLOBALES PARA FAVORITOS
// ==============================================
window.toggleFavorite = function(productId) {
    if (!window.favorites) {
        console.error('❌ Favorites no inicializado');
        return false;
    }
    
    const product = window.productsData?.find(p => p.id === productId);
    if (product) {
        const isNowFavorite = window.favorites.toggleFavorite(product);
        const message = isNowFavorite ? 'Added to favorites' : 'Removed from favorites';
        
        if (typeof window.showNotification === 'function') {
            window.showNotification(`"${product.name}" ${message}`, 'info');
        }
        
        const btn = document.querySelector(`.toggle-favorite[onclick*="${productId}"]`);
        if (btn) {
            btn.textContent = isNowFavorite ? '❤️' : '🤍';
        }
        
        // 🟢 DISPARAR EVENTOS
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
            detail: { favorites: window.favorites.getFavorites() } 
        }));
        
        // 🟢 ACTUALIZAR MODAL SI ESTÁ ABIERTO
        if (document.getElementById('favorites-modal')?.open && window.modalManager) {
            window.modalManager.renderFavoritesItems();
        }
        
        return isNowFavorite;
    }
    return false;
};

window.isFavorite = function(productId) {
    if (!window.favorites) return false;
    return window.favorites.isFavorite(productId);
};

window.getFavorites = function() {
    if (!window.favorites) return [];
    return window.favorites.getFavorites();
};

window.clearFavorites = function() {
    if (!window.favorites) return false;
    window.favorites.clear();
    if (typeof window.showNotification === 'function') {
        window.showNotification('Favorites cleared', 'info');
    }
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { favorites: [] } }));
    return true;
};

// ==============================================
// FUNCIONES GLOBALES PARA BÚSQUEDA
// ==============================================
window.searchProducts = function(query) {
    if (!query || !window.productsData) return [];
    
    const searchTerm = query.toLowerCase();
    return window.productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.color && product.color.toLowerCase().includes(searchTerm))
    );
};

window.openSearch = function() {
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
        if (typeof searchOverlay.showModal === 'function') {
            searchOverlay.showModal();
        } else {
            searchOverlay.hidden = false;
        }
        document.body.style.overflow = 'hidden';
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) setTimeout(() => searchInput.focus(), 100);
    }
};

window.closeSearch = function() {
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
        if (typeof searchOverlay.close === 'function') {
            searchOverlay.close();
        } else {
            searchOverlay.hidden = true;
        }
        document.body.style.overflow = 'auto';
    }
};

window.performSearch = function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }
};

// ==============================================
// FUNCIONES GLOBALES PARA MODALES
// ==============================================
window.openCartModal = function() {
    if (window.modalManager) {
        window.modalManager.openModal('cart-modal');
    }
};

window.openFavoritesModal = function() {
    if (window.modalManager) {
        window.modalManager.openModal('favorites-modal');
    }
};

window.openProductModal = function(productId) {
    if (window.modalManager && window.productsData) {
        const product = window.productsData.find(p => p.id === productId);
        if (product) {
            window.modalManager.openProductModal(product);
        }
    }
};

// ==============================================
// UTILIDADES GLOBALES
// ==============================================
window.formatPrice = function(price) {
    return `$${parseFloat(price).toFixed(2)}`;
};

window.getCurrentPage = function() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (filename.includes('products.html')) return 'products';
    if (filename.includes('contact.html')) return 'contact';
    if (filename.includes('form-action.html')) return 'form-action';
    if (filename.includes('attributions.html')) return 'attributions';
    return 'home';
};

window.showNotification = showNotification;

// ==============================================
// DEBUG
// ==============================================
window.debug = {
    cart: () => window.cart?.getItems(),
    favorites: () => window.favorites?.getFavorites(),
    products: () => window.productsData,
    search: (q) => window.searchProducts(q)
};

// ==============================================
// INICIALIZACIÓN
// ==============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}