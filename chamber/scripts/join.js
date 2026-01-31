// Join Page JavaScript - CORREGIDO

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Join page loaded - Fixed version');
    
    // 1. SET TIMESTAMP IMMEDIATELY - CORRECCIÓN CRÍTICA
    setTimestamp();
    
    // 2. Setup mobile menu
    setupMobileMenu();
    
    // 3. Setup modals - CORREGIDO
    setupModals();
    
    // 4. Setup form validation
    setupFormValidation();
    
    // 5. Setup membership cards animation - CORREGIDO
    setupCardsAnimation();
    
    // 6. Update footer
    updateFooter();
    
    console.log('✅ Join page initialized - All issues fixed');
});

// CORRECCIÓN 1: Timestamp function FIXED
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        // Formato ISO estándar
        timestampField.value = now.toISOString();
        console.log('🕒 Timestamp set to:', timestampField.value);
    } else {
        console.error('❌ Timestamp field not found!');
        // Crear el campo si no existe
        const form = document.getElementById('membershipForm');
        if (form) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'timestamp';
            hiddenInput.name = 'timestamp';
            hiddenInput.value = new Date().toISOString();
            form.appendChild(hiddenInput);
            console.log('➕ Created missing timestamp field');
        }
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('show');
            menuToggle.textContent = navMenu.classList.contains('show') ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
        });
        
        // Close menu when clicking links
        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768 && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && 
                navMenu.classList.contains('show') &&
                !navMenu.contains(e.target) && 
                e.target !== menuToggle) {
                
                navMenu.classList.remove('show');
                menuToggle.textContent = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// CORRECCIÓN 2: Modal system FIXED
function setupModals() {
    const modalTriggers = document.querySelectorAll('.learn-more');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    console.log(`🔍 Found ${modalTriggers.length} modal triggers`);
    console.log(`🔍 Found ${modals.length} modals`);
    console.log(`🔍 Found ${closeButtons.length} close buttons`);
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            console.log(`📱 Opening modal: ${modalId}`, modal);
            
            if (modal) {
                // Close any open modals first
                closeAllModals();
                
                // Show this modal
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                console.log(`✅ Modal ${modalId} opened`);
                
                // Focus trap for accessibility
                trapFocus(modal);
                
                // Focus the close button
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    setTimeout(() => closeBtn.focus(), 100);
                }
            } else {
                console.error(`❌ Modal ${modalId} not found`);
            }
        });
    });
    
    // Close modal with X button
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal by clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Prevent clicks inside modal from closing it
    modals.forEach(modal => {
        modal.querySelector('.modal-content')?.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        console.log(`📱 Modal closed`);
        
        // Return focus to the trigger if possible
        const modalId = modal.id;
        const trigger = document.querySelector(`[data-modal="${modalId}"]`);
        if (trigger) {
            setTimeout(() => trigger.focus(), 100);
        }
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        closeModal(modal);
    });
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Set initial focus
    firstFocusable.focus();
    
    const handleTabKey = function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };
    
    modal.addEventListener('keydown', handleTabKey);
    
    // Store handler reference for cleanup
    modal._keydownHandler = handleTabKey;
}

function setupFormValidation() {
    const form = document.getElementById('membershipForm');
    const titleField = document.getElementById('title');
    
    if (form) {
        // Real-time validation for title field
        if (titleField) {
            titleField.addEventListener('input', function() {
                validateTitleField(this);
            });
            
            titleField.addEventListener('blur', function() {
                validateTitleField(this);
            });
        }
        
        // Form submission - DOUBLE CHECK TIMESTAMP
        form.addEventListener('submit', function(e) {
            // Ensure timestamp is set
            const timestampField = document.getElementById('timestamp');
            if (!timestampField || !timestampField.value) {
                setTimestamp();
            }
            
            if (!validateForm()) {
                e.preventDefault();
                showFormErrors();
            } else {
                console.log('✅ Form validation passed');
                console.log('🕒 Final timestamp:', document.getElementById('timestamp')?.value);
            }
        });
    }
}

function validateTitleField(field) {
    const pattern = /^[A-Za-z\s\-]{7,}$/;
    const isValid = pattern.test(field.value);
    const errorElement = field.nextElementSibling?.tagName === 'SMALL' ? field.nextElementSibling : null;
    
    if (field.value && !isValid) {
        field.style.borderColor = '#dc3545';
        field.setCustomValidity('Please enter at least 7 characters using only letters, spaces, and hyphens');
        if (errorElement) {
            errorElement.style.color = '#dc3545';
            errorElement.textContent = 'Invalid format. Use only letters, spaces, and hyphens (min 7 chars).';
        }
    } else {
        field.style.borderColor = '';
        field.setCustomValidity('');
        if (errorElement && field.value) {
            errorElement.style.color = '#28a745';
            errorElement.textContent = '✓ Valid format';
        }
    }
}

function validateForm() {
    const form = document.getElementById('membershipForm');
    if (!form) return true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            allValid = false;
        }
    });
    
    return allValid && form.checkValidity();
}

function showFormErrors() {
    const invalidFields = document.querySelectorAll('#membershipForm input:invalid, #membershipForm select:invalid, #membershipForm textarea:invalid');
    
    invalidFields.forEach(field => {
        field.style.borderColor = '#dc3545';
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show error message
        const errorMessage = field.validationMessage || 'This field is required';
        alert(`Error: ${errorMessage}\n\nPlease correct the field: ${field.labels?.[0]?.textContent || field.name}`);
    });
    
    // Focus first invalid field
    if (invalidFields.length > 0) {
        invalidFields[0].focus();
    }
}

// CORRECCIÓN 3: Cards animation FIXED
function setupCardsAnimation() {
    const cards = document.querySelectorAll('.card');
    
    console.log(`🎨 Setting up animation for ${cards.length} cards`);
    
    // Remove inline styles first
    cards.forEach(card => {
        card.style.animation = '';
        card.style.opacity = '';
        card.style.transform = '';
    });
    
    // Force reflow to restart animations
    setTimeout(() => {
        cards.forEach((card, index) => {
            // Set CSS custom property for animation delay
            card.style.setProperty('--animation-order', index);
            
            // Add animation class
            card.classList.add('animated-card');
            
            console.log(`✨ Card ${index} animation initialized`);
        });
    }, 100);
}

function updateFooter() {
    // Update current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log(`📅 Copyright year: ${yearElement.textContent}`);
    }
    
    // Update last modified
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
        console.log(`📝 Last modified: ${lastModifiedElement.textContent}`);
    }
}

// Ensure timestamp is set on page load
window.addEventListener('load', function() {
    // Double-check timestamp
    const timestampField = document.getElementById('timestamp');
    if (!timestampField || !timestampField.value) {
        console.warn('⚠️ Timestamp was not set, setting now...');
        setTimestamp();
    }
    
    console.log('🌐 Page fully loaded');
    console.log('✅ All systems ready');
});

// Add emergency timestamp check on beforeunload
window.addEventListener('beforeunload', function() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField && !timestampField.value) {
        timestampField.value = new Date().toISOString();
    }
});