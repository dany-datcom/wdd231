// data.js - Datos de productos (15+ con 4+ propiedades cada uno)
export const productsData = [
    {
        id: 1,
        name: "Red Blouse",
        price: 25.99,
        category: "blouses",
        image: "images/products/blouse1.webp",
        description: "Fresh red blouse",
        featured: true,
        color: "Red",
        size: ["S", "M", "L"],
        material: "Cotton",
        rating: 4.5
    },
    {
        id: 2,
        name: "Black and White Blouse",
        price: 30.99,
        category: "blouses",
        image: "images/products/blouse2.webp",
        description: "Elegant natural blouse",
        featured: true,
        color: "White",
        size: ["S", "M"],
        material: "Silk",
        rating: 4.8
    },
    {
        id: 3,
        name: "Gray Comfort Blouse",
        price: 25.99,
        category: "blouses",
        image: "images/products/blouse3.webp",
        description: "Warm Blouse",
        featured: true,
        color: "Gray",
        size: ["M", "L", "XL"],
        material: "Wool",
        rating: 4.3
    },
    {
        id: 4,
        name: "Pink Blouse",
        price: 30.99,
        category: "blouses",
        image: "images/products/blouse4.webp",
        description: "Fresh blouse",
        featured: true,
        color: "Pink",
        size: ["S", "M", "L"],
        material: "Cotton",
        rating: 4.6
    },
    {
        id: 5,
        name: "Elegant Blouse",
        price: 28.99,
        category: "blouses",
        image: "images/products/blouse5.webp",
        description: "Elegant blouse",
        featured: true,
        color: "White",
        size: ["XS", "S", "M"],
        material: "Silk",
        rating: 4.9
    },
    {
        id: 6,
        name: "Blue Blouse",
        price: 27.99,
        category: "blouses",
        image: "images/products/blouse6.webp",
        description: "Blue Fresh Blouse",
        featured: true,
        color: "Blue",
        size: ["M", "L"],
        material: "Linen",
        rating: 4.4
    },
    {
        id: 7,
        name: "Green Pijama",
        price: 19.99,
        category: "pijamas",
        image: "images/products/pijama1.webp",
        description: "Comfortable pijama set",
        featured: true,
        color: "Green",
        size: ["S", "M", "L", "XL"],
        material: "Cotton",
        rating: 4.7
    },
    {
        id: 8,
        name: "Brown Pijama",
        price: 19.99,
        category: "pijamas",
        image: "images/products/pijama2.webp",
        description: "Comfortable pijama set",
        featured: true,
        color: "Brown",
        size: ["S", "M"],
        material: "Cotton",
        rating: 4.5
    },
    {
        id: 9,
        name: "Light Blue Pijama",
        price: 19.99,
        category: "pijamas",
        image: "images/products/pijama3.webp",
        description: "Comfortable pijama set",
        featured: true,
        color: "Blue",
        size: ["M", "L", "XL"],
        material: "Cotton",
        rating: 4.6
    },
    {
        id: 10,
        name: "White Pants",
        price: 45.99,
        category: "pants",
        image: "images/products/pant.webp",
        description: "Elegant white pants",
        featured: false,
        color: "White",
        size: ["S", "M", "L"],
        material: "Polyester",
        rating: 4.2
    },
    {
        id: 11,
        name: "Beige Coat",
        price: 28.99,
        category: "coat",
        image: "images/products/coat1.webp",
        description: "Warm Coat",
        featured: false,
        color: "Beige",
        size: ["M", "L"],
        material: "Wool",
        rating: 4.8
    },
    {
        id: 12,
        name: "Sport Set",
        price: 35.99,
        category: "sport",
        image: "images/products/sportset.webp",
        description: "Fresh set to gym",
        featured: false,
        color: "White",
        size: ["S", "M", "L"],
        material: "Polyester",
        rating: 4.3
    },
    {
        id: 13,
        name: "Black Shoes",
        price: 45.99,
        category: "shoes",
        image: "images/products/shoes1.webp",
        description: "Elegant Shoes",
        featured: false,
        color: "Black",
        size: ["7", "8", "9"],
        material: "Leather",
        rating: 4.7
    },
    {
        id: 14,
        name: "Golden Shoes",
        price: 35.99,
        category: "shoes",
        image: "images/products/shoes2.webp",
        description: "Elegant night shoes",
        featured: false,
        color: "Golden",
        size: ["6", "7", "8"],
        material: "Synthetic",
        rating: 4.5
    },
    {
        id: 15,
        name: "Beige Sandals",
        price: 35.99,
        category: "shoes",
        image: "images/products/sandals1.webp",
        description: "Fresh sandals",
        featured: false,
        color: "Beige",
        size: ["6", "7", "8", "9"],
        material: "Leather",
        rating: 4.4
    },
    {
        id: 16,
        name: "Silver Ring",
        price: 35.99,
        category: "accessories",
        image: "images/products/ring2.webp",
        description: "Elegant Ring",
        featured: false,
        color: "Silver",
        size: ["Adjustable"],
        material: "Sterling Silver",
        rating: 4.9
    },
    {
        id: 17,
        name: "Diamond Ring",
        price: 45.99,
        category: "accessories",
        image: "images/products/ring3.webp",
        description: "Luxury diamond ring",
        featured: false,
        color: "Silver",
        size: ["6", "7", "8"],
        material: "Sterling Silver with Diamond",
        rating: 4.9
    },
    {
        id: 18,
        name: "Pearl Ring",
        price: 39.99,
        category: "accessories",
        image: "images/products/ring4.webp",
        description: "Elegant pearl ring",
        featured: false,
        color: "Silver",
        size: ["7", "8"],
        material: "Silver with Pearl",
        rating: 4.7
    }
];

// Función para obtener productos por categoría
export function getProductsByCategory(category) {
    if (category === 'all') return productsData;
    return productsData.filter(product => product.category === category);
}

// Función para buscar productos
export function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.color.toLowerCase().includes(searchTerm)
    );
}

// Función para obtener productos destacados
export function getFeaturedProducts() {
    return productsData.filter(product => product.featured);
}

// Función para ordenar productos
export function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}