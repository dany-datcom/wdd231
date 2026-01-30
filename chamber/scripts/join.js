// Thank You Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('🙏 Thank you page loaded');
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Display form data
    displayFormData(urlParams);
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Update footer
    updateFooter();
    
    console.log('✅ Thank you page initialized');
});

function displayFormData(urlParams) {
    // Get form data from URL parameters
    const firstName = urlParams.get('firstName') || 'Not provided';
    const lastName = urlParams.get('lastName') || 'Not provided';
    const email = urlParams.get('email') || 'Not provided';
    const phone = urlParams.get('phone') || 'Not provided';
    const businessName = urlParams.get('businessName') || 'Not provided';
    const membership = urlParams.get('membership') || 'Not provided';
    const timestamp = urlParams.get('timestamp') || new Date().toISOString();
    
    // Format the data for display
    const displayName = `${firstName} ${lastName}`;
    const displayEmail = email;
    const displayPhone = formatPhoneNumber(phone);
    const displayBusiness = businessName;
    const displayMembership = getMembershipDisplayName(membership);
    const displayTimestamp = formatTimestamp(timestamp);
    
    // Update DOM elements
    updateElement('displayName', displayName);
    updateElement('displayEmail', displayEmail);
    updateElement('displayPhone', displayPhone);
    updateElement('displayBusiness', displayBusiness);
    updateElement('displayMembership', displayMembership);
    updateElement('displayTimestamp', displayTimestamp);
    
    console.log('📄 Form data displayed:', {
        name: displayName,
        email: displayEmail,
        phone: displayPhone,
        business: displayBusiness,
        membership: displayMembership,
        timestamp: displayTimestamp
    });
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function formatPhoneNumber(phone) {
    if (!phone || phone === 'Not provided') return phone;
    
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    return phone;
}

function getMembershipDisplayName(level) {
    const membershipMap = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    
    return membershipMap[level] || level;
}

function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return timestamp;
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.textContent = navMenu.classList.contains('show') ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
        });
        
        // Close menu when clicking links
        document.querySelectorAll('#navMenu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    navMenu.classList.remove('show');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

function updateFooter() {
    // Update current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Update last modified
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// Add some visual feedback for the success
setTimeout(() => {
    const thankyouIcon = document.querySelector('.thankyou-icon');
    if (thankyouIcon) {
        thankyouIcon.style.animation = 'none';
        setTimeout(() => {
            thankyouIcon.style.animation = 'bounce 1s ease infinite';
        }, 10);
    }
}, 1000);