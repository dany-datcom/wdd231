// modal.js - Sistema de modales CORREGIDO
import { showNotification } from './ui.js';

export class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Escuchar eventos de actualización
        window.addEventListener('cartUpdated', () => {
            if (document.getElementById('cart-modal')?.open) {
                this.renderCartItems();
            }
        });

        window.addEventListener('favoritesUpdated', () => {
            if (document.getElementById('favorites-modal')?.open) {
                this.renderFavoritesItems();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Renderizar contenido antes de abrir
            if (modalId === 'cart-modal') this.renderCartItems();
            if (modalId === 'favorites-modal') this.renderFavoritesItems();
            
            modal.showModal();
            document.body.style.overflow = 'hidden';
            
            const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }
    }

    closeModal(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (modal) {
            modal.close();
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        document.querySelectorAll('dialog[open]').forEach(modal => {
            this.closeModal(modal);
        });
    }

    /**
     * RENDERIZAR PRODUCTOS DEL CARRITO
     */
    renderCartItems() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cart = window.cart;
        
        if (!cartItems || !cart) return;
        
        const items = cart.getItems();
        const total = cart.getTotal();
        
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        if (items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    <p>🛒 Your cart is empty</p>
                    <p>Add some products to get started!</p>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80/E8D7FF/9C89B8?text=Product'">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="window.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="window.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="window.removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    /**
     * RENDERIZAR PRODUCTOS FAVORITOS
     */
    renderFavoritesItems() {
        const favoritesList = document.getElementById('favorites-list');
        const favorites = window.favorites;
        
        if (!favoritesList || !favorites) return;
        
        const items = favorites.getFavorites();
        
        if (items.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-favorites-message">
                    <p>🌟 No favorites yet</p>
                    <p>Click the heart icon on products to add them here!</p>
                </div>
            `;
            return;
        }
        
        favoritesList.innerHTML = items.map(item => `
            <div class="favorite-item" data-id="${item.id}">
                <div class="favorite-item-image">
                    <img src="${item.image}" 
                         alt="${item.name}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80/E8D7FF/9C89B8?text=Product'">
                </div>
                <div class="favorite-item-info">
                    <h4 class="favorite-item-title">${item.name}</h4>
                    <p class="favorite-item-price">$${item.price.toFixed(2)}</p>
                    <span class="favorite-item-category">${item.category}</span>
                </div>
                <div class="favorite-item-actions">
                    <button class="btn btn-small add-to-cart-fav" onclick="window.addToCart(${item.id}); window.modalManager?.closeModal('favorites-modal');">
                        🛒 Add to Cart
                    </button>
                    <button class="btn btn-small remove-fav" onclick="window.toggleFavorite(${item.id});">
                        ❌ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Abre modal de detalles del producto
     */
    openProductModal(product) {
        const modal = document.getElementById('product-modal');
        const body = document.getElementById('product-modal-body');
        
        if (!modal || !body) return;

        body.innerHTML = `
            <div class="product-modal-content">
                <div class="product-modal-image">
                    <img src="${product.image}" 
                         alt="${product.name}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500/E8D7FF/9C89B8?text=${encodeURIComponent(product.name)}'">
                </div>
                <div class="product-modal-details">
                    <h2 class="product-modal-title">${product.name}</h2>
                    <p class="product-modal-price">$${product.price.toFixed(2)}</p>
                    <div class="product-modal-rating">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span>(${product.rating}/5)</span>
                    </div>
                    
                    <div class="product-modal-specs">
                        <div class="spec-item">
                            <span class="spec-label">Category:</span>
                            <span class="spec-value">${product.category}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Color:</span>
                            <span class="spec-value">${product.color || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Material:</span>
                            <span class="spec-value">${product.material || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="product-modal-description">
                        <h3>Description</h3>
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="product-modal-actions">
                        <button class="btn btn-primary add-to-cart-modal" 
                                onclick="window.addToCart(${product.id}); window.modalManager?.closeModal('product-modal');">
                            Add to Cart - $${product.price.toFixed(2)}
                        </button>
                        <button class="btn btn-secondary toggle-favorite-modal" 
                                onclick="window.toggleFavorite(${product.id}); this.textContent = window.isFavorite(${product.id}) ? '❤️ Remove Favorite' : '🤍 Add to Favorites';">
                            ${window.favorites?.isFavorite(product.id) ? '❤️ Remove Favorite' : '🤍 Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal('product-modal');
    }

    setupCartModal() {
        const closeBtn = document.getElementById('close-cart');
        const continueBtn = document.getElementById('continue-shopping');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal('cart-modal'));
        }
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.closeModal('cart-modal'));
        }
    }

    setupFavoritesModal() {
        const closeBtn = document.getElementById('close-favorites');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal('favorites-modal'));
        }
    }
}