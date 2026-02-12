// storage.js - Sistema de Local Storage

const STORAGE_KEYS = {
    CART: 'dama_shop_cart',
    FAVORITES: 'dama_shop_favorites',
    THEME: 'dama_shop_theme',
    USER_PREFERENCES: 'dama_shop_preferences',
    NEWSLETTER_SUBSCRIPTIONS: 'newsletter_subscriptions'
};

/**
 * Guarda datos en Local Storage
 * @param {string} key - Clave de almacenamiento
 * @param {any} data - Datos a guardar
 */
export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`💾 Saved to ${key}:`, data);
        return true;
    } catch (error) {
        console.error(`❌ Error saving to ${key}:`, error);
        return false;
    }
}

/**
 * Obtiene datos de Local Storage
 * @param {string} key - Clave de almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Datos recuperados
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        const data = JSON.parse(item);
        console.log(`📂 Retrieved from ${key}:`, data);
        return data;
    } catch (error) {
        console.error(`❌ Error reading from ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Elimina datos de Local Storage
 * @param {string} key - Clave de almacenamiento
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed from storage: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error removing ${key}:`, error);
        return false;
    }
}

/**
 * Limpia todo el Local Storage
 */
export function clearStorage() {
    try {
        localStorage.clear();
        console.log('🧹 All storage cleared');
        return true;
    } catch (error) {
        console.error('❌ Error clearing storage:', error);
        return false;
    }
}

/**
 * Sistema de carrito usando Local Storage
 */
export class CartStorage {
    constructor() {
        this.items = getFromStorage(STORAGE_KEYS.CART, []);
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.save();
        return this.items;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        return this.items;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
            this.save();
        }
        return this.items;
    }

    getItems() {
        return [...this.items];
    }

    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.save();
    }

    save() {
        saveToStorage(STORAGE_KEYS.CART, this.items);
    }
}

/**
 * Sistema de favoritos usando Local Storage
 */
export class FavoritesStorage {
    constructor() {
        this.items = getFromStorage(STORAGE_KEYS.FAVORITES, []);
    }

    toggleFavorite(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        
        if (index === -1) {
            // Añadir a favoritos
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
        } else {
            // Remover de favoritos
            this.items.splice(index, 1);
        }
        
        this.save();
        return this.items;
    }

    isFavorite(productId) {
        return this.items.some(item => item.id === productId);
    }

    getFavorites() {
        return [...this.items];
    }

    clear() {
        this.items = [];
        this.save();
    }

    save() {
        saveToStorage(STORAGE_KEYS.FAVORITES, this.items);
    }
}

/**
 * Sistema de preferencias de usuario
 */
export class UserPreferences {
    constructor() {
        this.preferences = getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {
            theme: 'light',
            currency: 'USD',
            language: 'en',
            notifications: true
        });
    }

    setTheme(theme) {
        this.preferences.theme = theme;
        this.save();
        return this.preferences;
    }

    getTheme() {
        return this.preferences.theme;
    }

    save() {
        saveToStorage(STORAGE_KEYS.USER_PREFERENCES, this.preferences);
    }
}

/**
 * Suscripciones a newsletter
 */
export function subscribeToNewsletter(email) {
    try {
        const subscriptions = getFromStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, []);
        
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            saveToStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, subscriptions);
            console.log(`✅ Subscribed: ${email}`);
            return true;
        }
        
        console.log(`ℹ️ Already subscribed: ${email}`);
        return false;
    } catch (error) {
        console.error('❌ Error subscribing to newsletter:', error);
        return false;
    }
}

// Exportar constantes y clases
export { STORAGE_KEYS };