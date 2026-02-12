// contact-form.js - Manejo del formulario de contacto
import { saveToStorage, getFromStorage } from './storage.js';

export function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    console.log('📝 Inicializando formulario de contacto');
    
    // Ocultar mensajes de éxito/error
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    if (successMsg) {
        successMsg.hidden = true;
        successMsg.style.display = 'none';
    }
    
    if (errorMsg) {
        errorMsg.hidden = true;
        errorMsg.style.display = 'none';
    }
    
    // Inicializar contador de caracteres
    initCharCounter();
    
    // Inicializar validación en tiempo real
    initRealTimeValidation(contactForm);
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', handleSubmit);
}

function initCharCounter() {
    const messageField = document.getElementById('message');
    const counterDiv = document.getElementById('message-counter');
    
    if (!messageField || !counterDiv) return;
    
    counterDiv.textContent = '0/500 characters';
    
    messageField.addEventListener('input', function() {
        const length = this.value.length;
        counterDiv.textContent = `${length}/500 characters`;
        
        if (length > 450) {
            counterDiv.style.color = '#ff9800';
        } else if (length >= 500) {
            counterDiv.style.color = '#f44336';
            this.value = this.value.substring(0, 500);
        } else {
            counterDiv.style.color = 'var(--secondary-color)';
        }
    });
}

function initRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                if (this.value.length > 5) validateField(this);
            });
        }
    });
}

function validateField(field) {
    let errorElement = field.nextElementSibling;
    while (errorElement && !errorElement.classList?.contains('error-message')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Requerido
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Invalid email address';
        }
    }
    
    // Teléfono
    if (field.id === 'phone' && field.value.trim()) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Invalid phone number';
        }
    }
    
    // Longitud mínima
    const minLength = field.getAttribute('minlength');
    if (minLength && field.value.length < parseInt(minLength)) {
        isValid = false;
        errorMessage = `Minimum ${minLength} characters`;
    }
    
    field.classList.toggle('error', !isValid);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.hidden = isValid;
    }
    
    return isValid;
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    return isValid;
}

function saveFormToLocalStorage(formData) {
    try {
        const history = getFromStorage(STORAGE_KEYS.CONTACT_SUBMISSIONS, []);
        
        history.push({
            ...formData,
            submittedAt: new Date().toISOString(),
            id: Date.now()
        });
        
        if (history.length > 10) history.shift();
        
        saveToStorage(STORAGE_KEYS.CONTACT_SUBMISSIONS, history);
        console.log('✅ Formulario guardado en localStorage');
    } catch (error) {
        console.error('❌ Error guardando formulario:', error);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    if (!validateForm(form)) {
        if (errorMsg) {
            errorMsg.hidden = false;
            errorMsg.style.display = 'flex';
            if (successMsg) {
                successMsg.hidden = true;
                successMsg.style.display = 'none';
            }
            
            setTimeout(() => {
                errorMsg.hidden = true;
                errorMsg.style.display = 'none';
            }, 5000);
        }
        
        if (typeof window.showNotification === 'function') {
            window.showNotification('Please fix the errors in the form', 'error');
        }
        return;
    }
    
    // Timestamp
    const timestampField = document.getElementById('form-timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
    
    // Guardar en localStorage
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });
    saveFormToLocalStorage(data);
    
    // Mostrar éxito
    if (successMsg) {
        successMsg.hidden = false;
        successMsg.style.display = 'flex';
        if (errorMsg) {
            errorMsg.hidden = true;
            errorMsg.style.display = 'none';
        }
        
        setTimeout(() => {
            successMsg.hidden = true;
            successMsg.style.display = 'none';
        }, 5000);
    }
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('Message sent successfully!', 'success');
    }
    
    // Redirigir
    setTimeout(() => {
        const params = new URLSearchParams(formData).toString();
        window.location.href = `form-action.html?${params}`;
    }, 1500);
}

export default {
    initContactForm,
    validateField,
    validateForm
};