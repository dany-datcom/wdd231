
async function loadPlacesData() {
    try {
    
        const module = await import('../data/places.mjs');
        places = module.default; 
        
        console.log('✅ JSON loaded successfully:', places.length, 'places');
        loadPlaces(); 
        
    } catch (error) {
        console.error('❌ Error loading JSON:', error);
        
        
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


const placesContainer = document.getElementById('places-container');
const visitMessage = document.getElementById('visit-message');

function displayVisitMessage() {
    if (!visitMessage) return;
    
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    const messageElement = visitMessage.querySelector('p');
    
    if (!messageElement) return;
    
    if (!lastVisit) {

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
    
    
    localStorage.setItem('lastVisit', now.toString());
}


function createPlaceCard(place) {
    const card = document.createElement('article');
    card.className = 'place-card';
    
    
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
            <h2>${place.name}</h2>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button class="learn-more-btn">Learn More</button>
        </div>
    `;
    
    
    const button = card.querySelector('.learn-more-btn');
    if (button) {
        button.addEventListener('click', () => {
            alert(`More information about "${place.name}" coming soon!\n\nAddress: ${place.address}`);
        });
    }
    
    return card;
}


function loadPlaces() {
    if (!placesContainer) return;
    
    
    placesContainer.innerHTML = '';
    
   
    if (!places || places.length === 0) {
        placesContainer.innerHTML = '<div class="loading">No places data available.</div>';
        return;
    }
    
    
    places.forEach(place => {
        const card = createPlaceCard(place);
        placesContainer.appendChild(card);
    });
    
    
    applyGridAreas();
}


function applyGridAreas() {
    const cards = document.querySelectorAll('.place-card');
    cards.forEach((card, index) => {
        const areaLetter = String.fromCharCode(97 + index); 
        card.style.gridArea = areaLetter;
    });
}


function updateFooter() {
    const currentYear = new Date().getFullYear();
    const lastModified = document.lastModified;
    
    const yearElement = document.getElementById('currentYear');
    const modifiedElement = document.getElementById('lastModified');
    
    if (yearElement) yearElement.textContent = currentYear;
    if (modifiedElement) modifiedElement.textContent = lastModified;
}


function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
       
        if (!menuToggle.hasAttribute('data-listener-added')) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
            menuToggle.setAttribute('data-listener-added', 'true');
        }
    }
}




document.addEventListener('DOMContentLoaded', () => {
    displayVisitMessage();  
    loadPlacesData();       
    initMenuToggle();       
    updateFooter();         
    
    console.log('🚀 Discover page initialized');
});


window.addEventListener('resize', () => {
    
    console.log('🔄 Window resized - grid layout may change');
    
    
    const navMenu = document.querySelector('nav ul');
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('show');
    }
});