// storage.js - Sistema de Local Storage - CORREGIDO Y OPTIMIZADO

export const STORAGE_KEYS = {
    CART: 'dama_shop_cart',
    FAVORITES: 'dama_shop_favorites',
    THEME: 'dama_shop_theme',
    USER_PREFERENCES: 'dama_shop_preferences',
    NEWSLETTER_SUBSCRIPTIONS: 'dama_shop_newsletter',
    CONTACT_SUBMISSIONS: 'dama_shop_contact_submissions' // ✅ AGREGADO
};

/**
 * Guarda datos en Local Storage
 * @param {string} key - Clave de almacenamiento
 * @param {any} data - Datos a guardar
 * @returns {boolean} - Éxito de la operación
 */
export function saveToStorage(key, data) {
    try {
        if (!key) throw new Error('Key is required');
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`💾 Saved to ${key}:`, data);
        return true;
    } catch (error) {
        console.error(`❌ Error saving to ${key}:`, error.message);
        return false;
    }
}

/**
 * Obtiene datos de Local Storage con validación
 * @param {string} key - Clave de almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Datos recuperados
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        if (!key) throw new Error('Key is required');
        
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        const data = JSON.parse(item);
        
        // Validar que los datos no estén corruptos
        if (data === undefined || data === null) {
            console.warn(`⚠️ Corrupted data in ${key}, using default`);
            return defaultValue;
        }
        
        console.log(`📂 Retrieved from ${key}:`, 
            Array.isArray(data) ? `${data.length} items` : data);
        return data;
    } catch (error) {
        console.error(`❌ Error reading from ${key}:`, error.message);
        return defaultValue;
    }
}

/**
 * Elimina datos de Local Storage
 * @param {string} key - Clave de almacenamiento
 * @returns {boolean} - Éxito de la operación
 */
export function removeFromStorage(key) {
    try {
        if (!key) throw new Error('Key is required');
        localStorage.removeItem(key);
        console.log(`🗑️ Removed from storage: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error removing ${key}:`, error.message);
        return false;
    }
}

/**
 * Limpia todo el Local Storage
 * @returns {boolean} - Éxito de la operación
 */
export function clearStorage() {
    try {
        localStorage.clear();
        console.log('🧹 All storage cleared');
        return true;
    } catch (error) {
        console.error('❌ Error clearing storage:', error.message);
        return false;
    }
}

/**
 * Verifica si una clave existe en Local Storage
 * @param {string} key - Clave a verificar
 * @returns {boolean} - True si existe
 */
export function hasStorageKey(key) {
    try {
        return localStorage.getItem(key) !== null;
    } catch (error) {
        console.error(`❌ Error checking ${key}:`, error.message);
        return false;
    }
}

/**
 * Obtiene el tamaño aproximado del Local Storage en bytes
 * @returns {number} - Tamaño aproximado
 */
export function getStorageSize() {
    try {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
        return total * 2; // Aproximación en bytes (UTF-16)
    } catch (error) {
        console.error('❌ Error calculating storage size:', error.message);
        return 0;
    }
}

/**
 * Sistema de carrito usando Local Storage - OPTIMIZADO
 */
export class CartStorage {
    constructor() {
        this.items = this.validateItems(getFromStorage(STORAGE_KEYS.CART, []));
        this.expiryTime = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
    }

    /**
     * Valida que los items tengan la estructura correcta
     * @param {Array} items - Items a validar
     * @returns {Array} - Items válidos
     */
    validateItems(items) {
        if (!Array.isArray(items)) return [];
        return items.filter(item => 
            item && 
            typeof item === 'object' && 
            item.id && 
            item.name && 
            typeof item.price === 'number' &&
            item.quantity > 0
        );
    }

    addItem(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('❌ Invalid product');
            return this.items;
        }

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.lastUpdated = Date.now();
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: Math.max(1, quantity),
                addedAt: Date.now(),
                lastUpdated: Date.now()
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
            item.lastUpdated = Date.now();
            this.save();
        }
        return this.items;
    }

    /**
     * Obtiene un item específico por ID
     * @param {number|string} productId - ID del producto
     * @returns {Object|null} - Item encontrado o null
     */
    getItem(productId) {
        return this.items.find(item => item.id === productId) || null;
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

    /**
     * Obtiene el número de items únicos
     * @returns {number} - Cantidad de items únicos
     */
    getUniqueItemCount() {
        return this.items.length;
    }

    /**
     * Limpia items que han expirado (más de 7 días sin actualizar)
     * @returns {Array} - Items restantes
     */
    cleanExpired() {
        const now = Date.now();
        const expiredIds = this.items
            .filter(item => now - (item.lastUpdated || item.addedAt || 0) > this.expiryTime)
            .map(item => item.id);
        
        if (expiredIds.length > 0) {
            console.log(`🧹 Removing ${expiredIds.length} expired items`);
            this.items = this.items.filter(item => !expiredIds.includes(item.id));
            this.save();
        }
        return this.items;
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
 * Sistema de favoritos usando Local Storage - OPTIMIZADO
 */
export class FavoritesStorage {
    constructor() {
        this.items = this.validateItems(getFromStorage(STORAGE_KEYS.FAVORITES, []));
    }

    /**
     * Valida que los items tengan la estructura correcta
     * @param {Array} items - Items a validar
     * @returns {Array} - Items válidos
     */
    validateItems(items) {
        if (!Array.isArray(items)) return [];
        return items.filter(item => 
            item && 
            typeof item === 'object' && 
            item.id && 
            item.name
        );
    }

    toggleFavorite(product) {
        if (!product || !product.id) {
            console.error('❌ Invalid product');
            return false;
        }

        const index = this.items.findIndex(item => item.id === product.id);
        
        if (index === -1) {
            // Añadir a favoritos
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                addedAt: Date.now()
            });
            this.save();
            return true; // Se añadió
        } else {
            // Remover de favoritos
            this.items.splice(index, 1);
            this.save();
            return false; // Se removió
        }
    }

    isFavorite(productId) {
        return this.items.some(item => item.id === productId);
    }

    getFavorites() {
        return [...this.items];
    }

    /**
     * Obtiene el número de favoritos
     * @returns {number} - Cantidad de favoritos
     */
    getCount() {
        return this.items.length;
    }

    /**
     * Obtiene favoritos ordenados por fecha de agregado (más recientes primero)
     * @returns {Array} - Favoritos ordenados
     */
    getFavoritesSorted() {
        return [...this.items].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    }

    /**
     * Remueve múltiples favoritos por IDs
     * @param {Array} productIds - Array de IDs a remover
     */
    removeMultiple(productIds) {
        this.items = this.items.filter(item => !productIds.includes(item.id));
        this.save();
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
        this.preferences = this.validatePreferences(
            getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {
                theme: 'light',
                currency: 'USD',
                language: 'en',
                notifications: true,
                itemsPerPage: 12,
                lastUpdated: Date.now()
            })
        );
    }

    validatePreferences(prefs) {
        if (!prefs || typeof prefs !== 'object') {
            return this.getDefaultPreferences();
        }
        
        return {
            theme: prefs.theme || 'light',
            currency: prefs.currency || 'USD',
            language: prefs.language || 'en',
            notifications: prefs.notifications !== false,
            itemsPerPage: prefs.itemsPerPage || 12,
            lastUpdated: Date.now()
        };
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            currency: 'USD',
            language: 'en',
            notifications: true,
            itemsPerPage: 12,
            lastUpdated: Date.now()
        };
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.preferences.theme = theme;
            this.preferences.lastUpdated = Date.now();
            this.save();
        }
        return this.preferences;
    }

    getTheme() {
        return this.preferences.theme;
    }

    setCurrency(currency) {
        this.preferences.currency = currency;
        this.preferences.lastUpdated = Date.now();
        this.save();
        return this.preferences;
    }

    setLanguage(language) {
        this.preferences.language = language;
        this.preferences.lastUpdated = Date.now();
        this.save();
        return this.preferences;
    }

    setNotifications(enabled) {
        this.preferences.notifications = enabled;
        this.preferences.lastUpdated = Date.now();
        this.save();
        return this.preferences;
    }

    setItemsPerPage(count) {
        if (count > 0) {
            this.preferences.itemsPerPage = count;
            this.preferences.lastUpdated = Date.now();
            this.save();
        }
        return this.preferences;
    }

    reset() {
        this.preferences = this.getDefaultPreferences();
        this.save();
        return this.preferences;
    }

    save() {
        saveToStorage(STORAGE_KEYS.USER_PREFERENCES, this.preferences);
    }
}

/**
 * Suscripciones a newsletter - MEJORADO
 */
export function subscribeToNewsletter(email) {
    try {
        if (!email || !email.includes('@') || !email.includes('.')) {
            console.error('❌ Invalid email format');
            return false;
        }

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
        console.error('❌ Error subscribing to newsletter:', error.message);
        return false;
    }
}

/**
 * Obtiene todas las suscripciones a newsletter
 * @returns {Array} - Lista de emails suscritos
 */
export function getNewsletterSubscriptions() {
    return getFromStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, []);
}

/**
 * Cancela suscripción a newsletter
 * @param {string} email - Email a desuscribir
 * @returns {boolean} - Éxito de la operación
 */
export function unsubscribeFromNewsletter(email) {
    try {
        const subscriptions = getFromStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, []);
        const index = subscriptions.indexOf(email);
        
        if (index !== -1) {
            subscriptions.splice(index, 1);
            saveToStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, subscriptions);
            console.log(`✅ Unsubscribed: ${email}`);
            return true;
        }
        
        console.log(`ℹ️ Email not found: ${email}`);
        return false;
    } catch (error) {
        console.error('❌ Error unsubscribing:', error.message);
        return false;
    }
}

// Exportar constantes y clases
export { STORAGE_KEYS };