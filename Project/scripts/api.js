// api.js - VERSIÓN CORREGIDA
const API_URL = 'data/products.json';

/**
 * Obtiene productos desde el archivo JSON
 * REQUERIDO: Fetch API con try/catch
 */
export async function fetchProducts() {
    console.log('🔍 Cargando productos desde:', API_URL);
    
    try {
        // REQUERIDO: Fetch API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // REQUERIDO: Parsear JSON
        const data = await response.json();
        console.log(`✅ ${data.products.length} loaded products`);
        
        return data.products || [];
        
    } catch (error) {
        // REQUERIDO: Manejo de errores
        console.error('❌ Error loading products:', error);
        return getEmergencyProducts();
    }
}

/**
 * Datos de emergencia
 */
function getEmergencyProducts() {
    return [
        {
            id: 1, name: "Red Blouse", price: 25.99, category: "blouses",
            image: "images/products/blouse1.webp", description: "Fresh red blouse",
            featured: true, color: "Red", material: "Cotton", rating: 4.5
        },
        {
            id: 2, name: "Black and White Blouse", price: 30.99, category: "blouses",
            image: "images/products/blouse2.webp", description: "Elegant natural blouse",
            featured: true, color: "White", material: "Silk", rating: 4.8
        },
        {
            id: 7, name: "Green Pijama", price: 19.99, category: "pijamas",
            image: "images/products/pijama1.webp", description: "Comfortable pijama set",
            featured: true, color: "Green", material: "Cotton", rating: 4.7
        }
    ];
}

export async function fetchProductsByCategory(category) {
    const products = await fetchProducts();
    return category === 'all' ? products : products.filter(p => p.category === category);
}

export async function searchProducts(query) {
    const products = await fetchProducts();
    if (!query.trim()) return products;
    
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
}