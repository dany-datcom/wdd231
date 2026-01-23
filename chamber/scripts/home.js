const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=10.0912&lon=-84.4703&units=metric&lang=en&appid=16b1929a08aeba55d44892ad6d4c7d05';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=10.0912&lon=-84.4703&units=metric&lang=en&appid=16b1929a08aeba55d44892ad6d4c7d05';
const MEMBERS_URL = 'data/members.json';


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


function setupMobileMenu() {
    console.log('🔧 Configurando menú móvil...');
    
    
    let menuToggle = document.getElementById('menuToggle');
    let nav = document.getElementById('navMenu');
    
    
    if (!menuToggle) {
        menuToggle = document.querySelector('.menu-toggle');
        console.log('⚠️ menuToggle no encontrado por ID, usando clase');
    }
    
    if (!nav) {
        nav = document.querySelector('nav ul');
        console.log('⚠️ navMenu no encontrado por ID, usando selector');
    }
    
    console.log('menuToggle encontrado:', menuToggle);
    console.log('nav encontrado:', nav);
    
    if (menuToggle && nav) {
        console.log('✅ Elementos del menú encontrados');
        
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            console.log('🍔 Botón de menú clickeado');
            
            
            nav.classList.toggle('show');
            console.log('Clase "show" presente?:', nav.classList.contains('show'));
            
            
            if (nav.classList.contains('show')) {
                menuToggle.textContent = '✕';
                menuToggle.setAttribute('aria-expanded', 'true');
                console.log('📱 Menú abierto');
            } else {
                menuToggle.textContent = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                console.log('📱 Menú cerrado');
            }
        });
        
        
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768 && nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                    console.log('📱 Menú cerrado por clic en enlace');
                }
            });
        });
        
        
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && 
                nav.classList.contains('show') &&
                !nav.contains(e.target) && 
                e.target !== menuToggle) {
                
                nav.classList.remove('show');
                menuToggle.textContent = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                console.log('📱 Menú cerrado por clic fuera');
            }
        });
        
        
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && nav.classList.contains('show')) {
                nav.classList.remove('show');
                menuToggle.textContent = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
                console.log('🖥️ Menú cerrado por cambio a escritorio');
            }
        });
        
    } else {
        console.error('❌ ERROR: No se encontraron elementos del menú');
        console.log('Revisando todos los selectores posibles:');
        console.log('getElementById("menuToggle"):', document.getElementById('menuToggle'));
        console.log('querySelector(".menu-toggle"):', document.querySelector('.menu-toggle'));
        console.log('getElementById("navMenu"):', document.getElementById('navMenu'));
        console.log('querySelector("nav ul"):', document.querySelector('nav ul'));
        console.log('querySelector("#mainNav ul"):', document.querySelector('#mainNav ul'));
    }
}


async function fetchWeatherData() {
    try {
        console.log('🌤️ Obteniendo datos del clima...');
        
        
        const currentResponse = await fetch(WEATHER_URL);
        if (!currentResponse.ok) throw new Error(`Error API clima: ${currentResponse.status}`);
        const currentData = await currentResponse.json();
        
        
        const forecastResponse = await fetch(FORECAST_URL);
        if (!forecastResponse.ok) throw new Error(`Error API pronóstico: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();
        
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        console.log('✅ Datos del clima cargados exitosamente');
        
    } catch (error) {
        console.error('❌ Error obteniendo datos del clima:', error);
        showWeatherError();
    }
}

function displayCurrentWeather(data) {
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');
    const weatherDesc = document.querySelector('#weather-desc');
    const humidityElement = document.querySelector('#humidity');
    const windElement = document.querySelector('#wind');
    
    
    if (currentTemp) {
        currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    }
    
    
    if (weatherIcon && weatherDesc) {
        const iconCode = data.weather[0].icon;
        const description = data.weather[0].description;
        
        
        const capitalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);
        
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = capitalizedDesc;
        weatherDesc.textContent = capitalizedDesc;
    }
    
    
    if (humidityElement) {
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    }
    
    
    if (windElement) {
        const windKmh = Math.round(data.wind.speed * 3.6);
        windElement.textContent = `Wind: ${windKmh} km/h`;
    }
}

function processDailyForecast(forecastData) {
    const dailyForecasts = [];
    
    
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
    
    
    const today = new Date().toDateString();
    let dayCount = 0;
    
    for (const dateString in forecastsByDay) {
        if (dateString === today) continue; 
        
        if (dayCount >= 3) break; 
        
        const dayData = forecastsByDay[dateString];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));
        
        
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

function displayForecast(data) {
    const dailyForecasts = processDailyForecast(data);
    const forecastDays = document.querySelectorAll('.forecast-days .day');
    
    if (forecastDays.length === 0) return;
    
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    forecastDays.forEach((dayElement, index) => {
        const dayId = `forecast-day-${index}`;
        const targetElement = document.getElementById(dayId) || dayElement;
        
        if (dailyForecasts[index]) {
            const forecast = dailyForecasts[index];
            const date = forecast.date;
            
            
            let dayName;
            if (index === 0) {
                dayName = 'Tomorrow';
            } else {
                dayName = daysOfWeek[date.getDay()];
            }
            
            
            targetElement.innerHTML = `
                <p><strong>${dayName}</strong></p>
                <p>${forecast.maxTemp}° / ${forecast.minTemp}°</p>
                <p class="forecast-desc">${forecast.description}</p>
            `;
        } else {
            
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


async function loadRandomSpotlights() {
    try {
        const container = document.getElementById('spotlights-container');
        if (!container) {
            console.error('Contenedor de spotlights no encontrado');
            return;
        }
        
        container.innerHTML = '<div class="loading-spotlights">Loading featured businesses...</div>';
        
        console.log('📂 Cargando miembros para spotlights...');
        const response = await fetch(MEMBERS_URL);
        
        if (!response.ok) {
            throw new Error(`Error cargando miembros: ${response.status} ${response.statusText}`);
        }
        
        const members = await response.json();
        console.log(`✅ Encontrados ${members.length} miembros`);
        
        
        const goldSilverMembers = members.filter(member => 
            member.membership === 3 || member.membership === 2
        );
        
        if (goldSilverMembers.length === 0) {
            throw new Error('No se encontraron miembros gold o silver');
        }
        
        
        const numToShow = Math.min(3, goldSilverMembers.length);
        const shuffled = [...goldSilverMembers].sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, numToShow);
        
      
        displaySpotlights(selectedMembers, container);
        
    } catch (error) {
        console.error('❌ Error cargando spotlights:', error);
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
    
    console.log(`✅ Mostrados ${members.length} spotlights`);
}

function createSpotlightCard(member) {
    const card = document.createElement('article');
    card.className = 'member-card spotlight-card';
    
    
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


async function initHomePage() {
    console.log('🚀 Inicializando página principal...');
    
    try {
        
        updateCurrentYear();
        updateLastModified();
        
        
        setupMobileMenu();
        
        
        await fetchWeatherData();
        
       
        await loadRandomSpotlights();
        
        
        setInterval(fetchWeatherData, 30 * 60 * 1000);
        
        console.log('✅ Página principal inicializada exitosamente!');
        
    } catch (error) {
        console.error('❌ Error inicializando página principal:', error);
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
    console.log('📄 Esperando a que el DOM cargue...');
} else {
  
    console.log('📄 DOM ya cargado, ejecutando initHomePage...');
    initHomePage();
}


window.addEventListener('load', () => {
    console.log('🌐 Página completamente cargada');
});