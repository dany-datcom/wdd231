// ============================================
// DEBUG: Verificar que el JS se carga
// ============================================
console.log('🎬 directory.js loaded successfully');

// ============================================
// 1. VARIABLES GLOBALES (SEGÚN INSTRUCCIONES)
// ============================================
// ⚠️ IMPORTANTE: IDs deben ser #grid y #list (sin "View")
// ⚠️ IMPORTANTE: Contenedor debe ser <article> no <section>
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const display = document.querySelector("article"); // Busca <article>

// Obtener también el contenedor de miembros por ID (para compatibilidad)
const memberDirectory = document.getElementById("member-directory");

// Elementos del menú móvil
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

// ============================================
// 2. MOBILE NAVIGATION TOGGLE
// ============================================
function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');
    
    if (menuToggle && navMenu) {
        console.log('✅ Mobile menu elements found');
        
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuToggle.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
            console.log('🍔 Mobile menu toggled');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.textContent = "☰";
            });
        });
    } else {
        console.warn('⚠️ Mobile menu elements not found');
    }
}

// ============================================
// 3. GRID/LIST VIEW TOGGLE (SEGÚN INSTRUCCIONES EXACTAS)
// ============================================
function setupViewToggle() {
    console.log('🔄 Setting up view toggle...');
    
    // Verificar que los elementos existen
    if (!gridButton || !listButton || !display) {
        console.error("❌ Missing required elements for view toggle:");
        console.error("  gridButton:", gridButton ? "Found ✅" : "Not found ❌");
        console.error("  listButton:", listButton ? "Found ✅" : "Not found ❌");
        console.error("  display (<article>):", display ? "Found ✅" : "Not found ❌");
        
        // Fallback: usar memberDirectory si display no se encuentra
        if (memberDirectory && !display) {
            console.log("🔄 Using memberDirectory as fallback");
            display = memberDirectory;
        } else {
            return; // No podemos continuar sin elementos
        }
    }
    
    console.log('✅ View toggle elements found');
    
    // Función para mostrar vista de lista (SEGÚN INSTRUCCIONES)
    function showList() {
        console.log('📋 Switching to LIST view');
        display.classList.add("list");
        display.classList.remove("grid");
        
        // Opcional: añadir clase active a botones
        if (listButton) listButton.classList.add("active");
        if (gridButton) gridButton.classList.remove("active");
    }
    
    // Grid button event listener (arrow function - SEGÚN INSTRUCCIONES)
    gridButton.addEventListener("click", () => {
        console.log('🔳 Switching to GRID view');
        display.classList.add("grid");
        display.classList.remove("list");
        
        // Opcional: añadir clase active a botones
        if (gridButton) gridButton.classList.add("active");
        if (listButton) listButton.classList.remove("active");
    });
    
    // List button event listener (usando función definida - SEGÚN INSTRUCCIONES)
    listButton.addEventListener("click", showList);
    
    // Establecer vista inicial
    console.log('🎯 Setting initial view to GRID');
    display.classList.add("grid");
    if (gridButton) gridButton.classList.add("active");
}

// ============================================
// 4. LOAD AND DISPLAY MEMBERS FROM JSON
// ============================================
async function loadMembers() {
    console.log('📂 Starting to load members from JSON...');
    
    try {
        // Verificar que tenemos donde mostrar los miembros
        const container = display || memberDirectory;
        if (!container) {
            throw new Error("No container found to display members");
        }
        
        // Mostrar mensaje de carga
        container.innerHTML = '<p class="loading">🔄 Loading business directory...</p>';
        
        // Fetch data (async/await - REQUISITO)
        console.log('🔗 Fetching: data/members.json');
        const response = await fetch("data/members.json");
        
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const members = await response.json();
        console.log(`✅ JSON loaded! Found ${members.length} members`);
        
        if (!members || members.length === 0) {
            throw new Error("No member data available in JSON");
        }
        
        // Mostrar miembros
        displayMembers(members);
        
    } catch (error) {
        console.error("❌ Error loading members:", error);
        
        // Mostrar error al usuario
        const container = display || memberDirectory;
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Unable to Load Directory</h3>
                    <p>We're having trouble loading the business directory.</p>
                    <p><small>Error: ${error.message}</small></p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
}

function displayMembers(members) {
    console.log(`🎨 Displaying ${members.length} members`);
    
    const container = display || memberDirectory;
    if (!container) {
        console.error("❌ No container to display members");
        return;
    }
    
    // Limpiar contenedor
    container.innerHTML = "";
    
    // Crear y añadir tarjetas de miembros
    members.forEach(member => {
        const card = createMemberCard(member);
        container.appendChild(card);
    });
    
    // Actualizar contador de miembros
    updateMemberCount(members.length);
    
    console.log(`✅ Successfully displayed ${members.length} members`);
}

function createMemberCard(member) {
    console.log(`   Creating card for: ${member.name}`);
    
    const card = document.createElement("div");
    card.className = "member-card";
    
    // Determinar nivel de membresía
    let membershipClass, membershipText;
    switch (member.membership) {
        case 3:
            membershipClass = "membership-gold";
            membershipText = "Gold Member";
            break;
        case 2:
            membershipClass = "membership-silver";
            membershipText = "Silver Member";
            break;
        default:
            membershipClass = "membership-bronze";
            membershipText = "Member";
    }
    
    // Manejo inteligente de imágenes
    let imageSrc = member.image;
    
    // Si es solo nombre de archivo (ej: "tech.jpg"), añadir carpeta images/
    if (imageSrc && !imageSrc.startsWith("http") && !imageSrc.includes("/")) {
        imageSrc = "images/" + imageSrc;
        console.log(`   🖼️ Fixed image path: ${imageSrc}`);
    }
    
    // Crear contenido de la tarjeta
    card.innerHTML = `
        <img src="${imageSrc}" 
             alt="${member.name}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found'">
        <div class="card-content">
            <h3>${member.name}</h3>
            <p><strong>📍 Address:</strong> ${member.address}</p>
            <p><strong>📞 Phone:</strong> ${member.phone}</p>
            <p><strong>🌐 Website:</strong> 
                <a href="${member.url}" target="_blank" rel="noopener noreferrer">
                    Visit Website
                </a>
            </p>
            <span class="membership-level ${membershipClass}">${membershipText}</span>
            <p class="description">${member.other || "Local business serving the community."}</p>
        </div>
    `;
    
    return card;
}

function updateMemberCount(count) {
    console.log(`🔢 Updating member count: ${count} businesses`);
    
    const countElement = document.getElementById("memberCount");
    if (!countElement) {
        // Crear elemento si no existe
        const h2 = document.querySelector("main h2");
        if (h2) {
            const countSpan = document.createElement("span");
            countSpan.id = "memberCount";
            countSpan.className = "member-count";
            countSpan.textContent = ` (${count} businesses)`;
            h2.appendChild(countSpan);
            console.log(`✅ Added member count to heading`);
        }
    } else {
        countElement.textContent = ` (${count} businesses)`;
        console.log(`✅ Updated existing member count`);
    }
}

// ============================================
// 5. FOOTER DYNAMIC CONTENT (REQUISITO)
// ============================================
function setupFooter() {
    console.log('🦶 Setting up footer dynamic content...');
    
    // Current year for copyright (REQUISITO)
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
        yearElement.textContent = currentYear;
        console.log(`✅ Copyright year set to: ${currentYear}`);
    }
    
    // Last modified date (REQUISITO)
    const lastModifiedElement = document.getElementById("lastModified");
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
        console.log(`✅ Last modified date set to: ${document.lastModified}`);
    }
}

// ============================================
// 6. INITIALIZATION (CUANDO EL DOM ESTÁ LISTO)
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log('🎉 DOM fully loaded - Initializing chamber directory...');
    
    // 1. Configurar menú móvil
    setupMobileMenu();
    
    // 2. Configurar toggle de vistas (grid/list)
    setupViewToggle();
    
    // 3. Configurar footer dinámico
    setupFooter();
    
    // 4. Cargar miembros desde JSON
    loadMembers();
    
    console.log('✅ Chamber directory initialization complete!');
    
    // Añadir estilos dinámicos para elementos extra
    const style = document.createElement("style");
    style.textContent = `
        .member-count {
            font-size: 1rem;
            color: #666;
            font-weight: normal;
            margin-left: 10px;
        }
        
        .error-message {
            text-align: center;
            padding: 2rem;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            color: #856404;
            margin: 2rem;
        }
        
        .error-message button {
            background-color: #004080;
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
            font-weight: 600;
        }
        
        .error-message button:hover {
            background-color: #00264d;
        }
        
        /* Clase active para botones de vista */
        button.active {
            background-color: #004080 !important;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    console.log('🎨 Dynamic styles added');
});

// ============================================
// 7. FUNCIONES DE UTILIDAD (OPCIONAL)
// ============================================
// Función para recargar (usada en error message)
window.reloadPage = function() {
    location.reload();
};

// Función para probar si los elementos existen
window.testElements = function() {
    console.log('🔍 Testing page elements:');
    console.log('  gridButton (#grid):', document.querySelector('#grid'));
    console.log('  listButton (#list):', document.querySelector('#list'));
    console.log('  display (<article>):', document.querySelector('article'));
    console.log('  memberDirectory (#member-directory):', document.getElementById('member-directory'));
    console.log('  JSON file:', fetch('data/members.json').then(r => `Status: ${r.status}`).catch(e => `Error: ${e.message}`));
};