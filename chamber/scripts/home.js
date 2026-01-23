// scripts/home.js

// ===== CONFIGURACIÓN API =====
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=10.0912&lon=-84.4703&units=metric&lang=en&appid=16b1929a08aeba55d44892ad6d4c7d05';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=10.0912&lon=-84.4703&units=metric&lang=en&appid=16b1929a08aeba55d44892ad6d4c7d05';
const MEMBERS_URL = 'data/members.json';

// ===== FUNCIONES BÁSICAS =====
function updateCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

function updateLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// ===== MENÚ MÓVIL =====
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            menuToggle.textContent = nav.classList.contains('show') ? '✕' : '☰';
        });
        
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    nav.classList.remove('show');
                    menuToggle.textContent = '☰';
                }
            });
        });
    }
}

// ===== FUNCIONES DEL CLIMA - CORREGIDAS =====
async function fetchWeatherData() {
    try {
        console.log('Getting weather data...');
        
        // Obtener clima actual
        const currentResponse = await fetch(WEATHER_URL);
        if (!currentResponse.ok) throw new Error(`Weather API error: ${currentResponse.status}`);
        const currentData = await currentResponse.json();
        
        // Obtener pronóstico
        const forecastResponse = await fetch(FORECAST_URL);
        if (!forecastResponse.ok) throw new Error(`Forecast API error: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();
        
        // Mostrar datos
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        console.log('Weather data loaded successfully');
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showWeatherError();
    }
}

function displayCurrentWeather(data) {
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');
    const weatherDesc = document.querySelector('#weather-desc');
    const humidityElement = document.querySelector('#humidity');
    const windElement = document.querySelector('#wind');
    
    // Temperatura
    if (currentTemp) {
        currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    }
    
    // Ícono y descripción
    if (weatherIcon && weatherDesc) {
        const iconCode = data.weather[0].icon;
        const description = data.weather[0].description;
        
        // Capitalizar primera letra
        const capitalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
        
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = capitalizedDesc;
        weatherDesc.textContent = capitalizedDesc;
    }
    
    // Humedad
    if (humidityElement) {
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    }
    
    // Viento
    if (windElement) {
        const windKmh = Math.round(data.wind.speed * 3.6);
        windElement.textContent = `Wind: ${windKmh} km/h`;
    }
}

// ✅ NUEVA: Función para procesar forecast correctamente
function processDailyForecast(forecastData) {
    const dailyForecasts = [];
    
    // Agrupar por día
    const forecastsByDay = {};
    
    forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();
        
        if (!forecastsByDay[dateString]) {
            forecastsByDay[dateString] = {
                temps: [],
                descriptions: [],
                date: date
            };
        }
        
        forecastsByDay[dateString].temps.push(forecast.main.temp);
        forecastsByDay[dateString].descriptions.push(forecast.weather[0].description);
    });
    
    // Procesar cada día
    const today = new Date().toDateString();
    let dayCount = 0;
    
    for (const dateString in forecastsByDay) {
        if (dateString === today) continue; // Saltar hoy
        
        if (dayCount >= 3) break; // Solo necesitamos 3 días
        
        const dayData = forecastsByDay[dateString];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));
        
        // Encontrar la descripción más común
        const descCount = {};
        dayData.descriptions.forEach(desc => {
            descCount[desc] = (descCount[desc] || 0) + 1;
        });
        
        let mostCommonDesc = '';
        let maxCount = 0;
        for (const desc in descCount) {
            if (descCount[desc] > maxCount) {
                maxCount = descCount[desc];
                mostCommonDesc = desc;
            }
        }
        
        dailyForecasts.push({
            date: dayData.date,
            maxTemp: maxTemp,
            minTemp: minTemp,
            description: mostCommonDesc.charAt(0).toUpperCase() + mostCommonDesc.slice(1),
            dayIndex: dayCount
        });
        
        dayCount++;
    }
    
    return dailyForecasts;
}

// ✅ CORREGIDA: Función para mostrar forecast
function displayForecast(data) {
    const dailyForecasts = processDailyForecast(data);
    const forecastDays = document.querySelectorAll('.forecast-days .day');
    
    if (forecastDays.length === 0) return;
    
    // Días de la semana en inglés
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    forecastDays.forEach((dayElement, index) => {
        const dayId = `forecast-day-${index}`;
        const targetElement = document.getElementById(dayId) || dayElement;
        
        if (dailyForecasts[index]) {
            const forecast = dailyForecasts[index];
            const date = forecast.date;
            
            // Determinar nombre del día
            let dayName;
            if (index === 0) {
                dayName = 'Tomorrow';
            } else {
                dayName = daysOfWeek[date.getDay()];
            }
            
            // Actualizar contenido
            targetElement.innerHTML = `
                <p><strong>${dayName}</strong></p>
                <p>${forecast.maxTemp}° / ${forecast.minTemp}°</p>
                <p class="forecast-desc">${forecast.description}</p>
            `;
        } else {
            // Si no hay datos, mostrar placeholder
            targetElement.innerHTML = `
                <p><strong>--</strong></p>
                <p class="forecast-temp">--°C</p>
                <p class="forecast-desc">--</p>
            `;
        }
    });
}

function showWeatherError() {
    const currentTemp = document.querySelector('#current-temp');
    const weatherDesc = document.querySelector('#weather-desc');
    const humidityElement = document.querySelector('#humidity');
    const windElement = document.querySelector('#wind');
    
    if (currentTemp) currentTemp.textContent = '--°C';
    if (weatherDesc) weatherDesc.textContent = 'Error loading data';
    if (humidityElement) humidityElement.textContent = 'Humidity: --%';
    if (windElement) windElement.textContent = 'Wind: -- km/h';
    
    // Limpiar forecast si hay error
    const forecastDays = document.querySelectorAll('.forecast-days .day');
    forecastDays.forEach((dayElement, index) => {
        const dayId = `forecast-day-${index}`;
        const targetElement = document.getElementById(dayId) || dayElement;
        
        targetElement.innerHTML = `
            <p><strong>--</strong></p>
            <p class="forecast-temp">--°C</p>
            <p class="forecast-desc">--</p>
        `;
    });
}

// ===== SPOTLIGHTS DINÁMICOS - NUEVA FUNCIONALIDAD =====
async function loadRandomSpotlights() {
    try {
        const container = document.getElementById('spotlights-container');
        if (!container) {
            console.error('Spotlights container not found');
            return;
        }
        
        container.innerHTML = '<div class="loading-spotlights">Loading featured businesses...</div>';
        
        console.log('Loading members for spotlights...');
        const response = await fetch(MEMBERS_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to load members: ${response.status} ${response.statusText}`);
        }
        
        const members = await response.json();
        console.log(`Found ${members.length} members`);
        
        // Filtrar solo gold (3) y silver (2) members
        const goldSilverMembers = members.filter(member => 
            member.membership === 3 || member.membership === 2
        );
        
        if (goldSilverMembers.length === 0) {
            throw new Error('No gold or silver members found');
        }
        
        // Seleccionar 2-3 miembros random
        const numToShow = Math.min(3, goldSilverMembers.length);
        const shuffled = [...goldSilverMembers].sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, numToShow);
        
        // Mostrar los miembros seleccionados
        displaySpotlights(selectedMembers, container);
        
    } catch (error) {
        console.error('Error loading spotlights:', error);
        const container = document.getElementById('spotlights-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Unable to load featured businesses. Please try again later.</p>
                    <button onclick="loadRandomSpotlights()">Retry</button>
                </div>
            `;
        }
    }
}

function displaySpotlights(members, container) {
    container.innerHTML = '';
    
    members.forEach(member => {
        const card = createSpotlightCard(member);
        container.appendChild(card);
    });
    
    console.log(`Displayed ${members.length} spotlights`);
}

function createSpotlightCard(member) {
    const card = document.createElement('article');
    card.className = 'member-card spotlight-card';
    
    // Determinar nivel de membresía
    let memberLevel, levelClass;
    switch(member.membership) {
        case 3:
            memberLevel = 'Gold Member';
            levelClass = 'gold';
            break;
        case 2:
            memberLevel = 'Silver Member';
            levelClass = 'silver';
            break;
        default:
            memberLevel = 'Member';
            levelClass = 'bronze';
    }
    
    // Formatear teléfono si es necesario
    let phoneDisplay = member.phone || 'Not available';
    if (phoneDisplay.length === 8 && !phoneDisplay.includes('-')) {
        phoneDisplay = phoneDisplay.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    card.innerHTML = `
        <h4>${member.name}</h4>
        <p class="member-level ${levelClass}">${memberLevel}</p>
        <p>${member.other || 'Local business serving the community.'}</p>
        <p class="contact-info">📍 ${member.address || 'San Ramon'} | 📞 ${phoneDisplay}</p>
        ${member.url ? `<a href="${member.url}" target="_blank" class="website-link">Visit Website</a>` : ''}
    `;
    
    return card;
}

// ===== FUNCIÓN PRINCIPAL =====
async function initHomePage() {
    console.log('Initializing Home Page...');
    
    try {
        // 1. Actualizar fechas
        updateCurrentYear();
        updateLastModified();
        
        // 2. Configurar menú móvil
        setupMobileMenu();
        
        // 3. Obtener datos del clima
        await fetchWeatherData();
        
        // 4. Cargar spotlights dinámicos
        await loadRandomSpotlights();
        
        // 5. Actualizar clima cada 30 minutos
        setInterval(fetchWeatherData, 30 * 60 * 1000);
        
        console.log('Home Page initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing home page:', error);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', initHomePage);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}