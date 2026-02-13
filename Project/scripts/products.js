// products.js - VERSIÓN SIMPLE Y FUNCIONAL
import { fetchProducts } from './api.js';

let allProducts = [];

export async function loadProducts() {
    console.log('🔄 Cargando productos...');
    
    try {
        // Cargar productos
        allProducts = await fetchProducts();
        console.log(`✅ ${allProducts.length} productos cargados`);
        
        // Determinar qué contenedor usar
        const isHomePage = document.getElementById('featured-products') !== null;
        const isProductsPage = document.getElementById('all-products') !== null;
        
        // Home page - productos destacados
        if (isHomePage) {
            const container = document.getElementById('featured-products');
            if (container) {
                const featured = allProducts.filter(p => p.featured).slice(0, 6);
                renderProducts(featured, container);
            }
        }
        
        // Products page - todos los productos
        if (isProductsPage) {
            const container = document.getElementById('all-products');
            if (container) {
                // Obtener filtro de URL
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category') || 'all';
                
                let productsToShow = allProducts;
                if (category !== 'all') {
                    productsToShow = allProducts.filter(p => p.category === category);
                }
                
                renderProducts(productsToShow, container);
            }
        }
        
        // OCULTAR LOADING - IMPORTANTE
        const loaders = document.querySelectorAll('#loading-products, #loading-indicator, .loading');
        loaders.forEach(loader => {
            if (loader) loader.style.display = 'none';
        });
        
        return allProducts;
        
    } catch (error) {
        console.error('❌ Error:', error);
        return [];
    }
}

// Función para renderizar productos
function renderProducts(products, container) {
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">No products found</p>';
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
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                
                <div class="product-actions">
                    <button class="dama-btn dama-btn-primary add-to-cart"
                            onclick="window.addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="dama-btn dama-btn-secondary toggle-favorite"
                            onclick="window.toggleFavorite(${product.id})">
                        🤍
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Funciones de utilidad
export function getProducts() {
    return [...allProducts];
}

export function getFeaturedProducts() {
    return allProducts.filter(p => p.featured);
}

export function filterProductsByCategory(category) {
    if (category === 'all') return allProducts;
    return allProducts.filter(p => p.category === category);
}

// Hacer disponibles globalmente
window.productsData = allProducts;