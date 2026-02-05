// discover.js - Main logic for Discover page
// CRITERIO 9: Import JSON data

// SOLUCIÓN: Usar import dinámico para evitar problemas con assert {type: 'json'}
let places = []; // Variable global para almacenar los lugares

// Función para cargar los datos del JSON
async function loadPlacesData() {
    try {
        // Import dinámico del módulo .mjs
        const module = await import('../data/places.mjs');
        places = module.default; // Obtener los datos exportados
        
        console.log('✅ JSON loaded successfully:', places.length, 'places');
        loadPlaces(); // Llamar a la función que crea las cards
        
    } catch (error) {
        console.error('❌ Error loading JSON:', error);
        
        // Mensaje de error en la página
        const placesContainer = document.getElementById('places-container');
        if (placesContainer) {
            placesContainer.innerHTML = `
                <div class="error-message" style="
                    text-align: center; 
                    padding: 2rem; 
                    background: #ffe6e6; 
                    border-radius: 8px; 
                    color: #cc0000;
                    grid-column: 1 / -1;
                ">
                    <p><strong>Error loading places data</strong></p>
                    <p>Please check that the data file exists and try again.</p>
                    <button onclick="location.reload()" style="
                        margin-top: 1rem;
                        padding: 0.5rem 1.5rem;
                        background: #003366;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Reload Page</button>
                </div>
            `;
        }
    }
}

// DOM Elements
const placesContainer = document.getElementById('places-container');
const visitMessage = document.getElementById('visit-message');

// CRITERIO 7: localStorage for visit tracking
function displayVisitMessage() {
    if (!visitMessage) return;
    
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    const messageElement = visitMessage.querySelector('p');
    
    if (!messageElement) return;
    
    if (!lastVisit) {
        // First visit
        messageElement.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const daysSince = Math.floor((now - lastVisitTime) / (1000 * 60 * 60 * 24));
        
        if (daysSince < 1) {
            messageElement.textContent = 'Back so soon! Awesome!';
        } else {
            const dayWord = daysSince === 1 ? 'day' : 'days';
            messageElement.textContent = `You last visited ${daysSince} ${dayWord} ago.`;
        }
    }
    
    // Store current visit
    localStorage.setItem('lastVisit', now.toString());
}

// CRITERIO 10: Create card element
function createPlaceCard(place) {
    const card = document.createElement('article');
    card.className = 'place-card';
    
    // CRITERIO 8: Add lazy loading to images
    // CRITERIO 12: Images in WebP format
    card.innerHTML = `
        <figure>
            <img src="${place.image || 'images/placeholder.webp'}" 
                 alt="${place.name}" 
                 loading="lazy" 
                 width="300" 
                 height="200"
                 onerror="this.src='images/placeholder.webp'; this.alt='Image not available'">
        </figure>
        <div class="place-card-content">
            <h2>${place.name}</h2>  <!-- CAMBIADO: h3 → h2 para cumplir instrucción -->
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button class="learn-more-btn">Learn More</button>
        </div>
    `;
    
    // Add click event to button
    const button = card.querySelector('.learn-more-btn');
    if (button) {
        button.addEventListener('click', () => {
            alert(`More information about "${place.name}" coming soon!\n\nAddress: ${place.address}`);
        });
    }
    
    return card;
}

// CRITERIO 9: Load and display places from JSON
function loadPlaces() {
    if (!placesContainer) return;
    
    // Clear loading message
    placesContainer.innerHTML = '';
    
    // Check if we have data
    if (!places || places.length === 0) {
        placesContainer.innerHTML = '<div class="loading">No places data available.</div>';
        return;
    }
    
    // Create and append cards
    places.forEach(place => {
        const card = createPlaceCard(place);
        placesContainer.appendChild(card);
    });
    
    // Aplicar grid areas dinámicamente
    applyGridAreas();
}

// Función para aplicar grid areas a las cards
function applyGridAreas() {
    const cards = document.querySelectorAll('.place-card');
    cards.forEach((card, index) => {
        const areaLetter = String.fromCharCode(97 + index); // a, b, c, ...
        card.style.gridArea = areaLetter;
    });
}

// Initialize menu toggle
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
        
        // Cerrar menú al hacer clic en un enlace (para móviles)
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('show');
                }
            });
        });
    }
}

// Update footer year and last modified
function updateFooter() {
    const currentYear = new Date().getFullYear();
    const lastModified = document.lastModified;
    
    const yearElement = document.getElementById('currentYear');
    const modifiedElement = document.getElementById('lastModified');
    
    if (yearElement) yearElement.textContent = currentYear;
    if (modifiedElement) modifiedElement.textContent = lastModified;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayVisitMessage();  // CRITERIO 7
    loadPlacesData();       // CRITERIO 9 (cambia loadPlaces por loadPlacesData)
    initMenuToggle();
    updateFooter();
    
    console.log('🚀 Discover page initialized');
});

// Handle window resize for grid layout changes
window.addEventListener('resize', () => {
    // Grid will automatically adjust via CSS media queries
    console.log('🔄 Window resized - grid layout may change');
    
    // Cerrar menú en móvil al cambiar a escritorio
    const navMenu = document.querySelector('nav ul');
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('show');
    }
});