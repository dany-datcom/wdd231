
console.log('🎬 directory.js loaded successfully');

const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const display = document.querySelector("article"); 
const memberDirectory = document.getElementById("member-directory");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');
    
    if (menuToggle && navMenu) {
        console.log('✅ Mobile menu elements found');
        
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show"); 
            menuToggle.textContent = navMenu.classList.contains("show") ? "✕" : "☰"; 
            console.log('🍔 Mobile menu toggled');
        });
        
        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 768) { 
                    navMenu.classList.remove("show"); 
                    menuToggle.textContent = "☰";
                }
            });
        });
        
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && 
                navMenu.classList.contains('show') &&
                !navMenu.contains(e.target) && 
                e.target !== menuToggle) {
                
                navMenu.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
        
    } else {
        console.warn('⚠️ Mobile menu elements not found');
    }
}

function setupViewToggle() {
    console.log('🔄 Setting up view toggle...');
    
    if (!gridButton || !listButton || !display) {
        console.error("❌ Missing required elements for view toggle:");
        console.error("  gridButton:", gridButton ? "Found ✅" : "Not found ❌");
        console.error("  listButton:", listButton ? "Found ✅" : "Not found ❌");
        console.error("  display (<article>):", display ? "Found ✅" : "Not found ❌");
        
        if (memberDirectory && !display) {
            console.log("🔄 Using memberDirectory as fallback");
            display = memberDirectory;
        } else {
            return;
        }
    }
    
    console.log('✅ View toggle elements found');
    
    function showList() {
        console.log('📋 Switching to LIST view');
        display.classList.add("list");
        display.classList.remove("grid");
        
        if (listButton) listButton.classList.add("active");
        if (gridButton) gridButton.classList.remove("active");
    }
    
    gridButton.addEventListener("click", () => {
        console.log('🔳 Switching to GRID view');
        display.classList.add("grid");
        display.classList.remove("list");
        
        if (gridButton) gridButton.classList.add("active");
        if (listButton) listButton.classList.remove("active");
    });
    
    listButton.addEventListener("click", showList);
    
    console.log('🎯 Setting initial view to GRID');
    display.classList.add("grid");
    if (gridButton) gridButton.classList.add("active");
}

async function loadMembers() {
    console.log('📂 Starting to load members from JSON...');
    
    try {
        const container = display || memberDirectory;
        if (!container) {
            throw new Error("No container found to display members");
        }
        
        container.innerHTML = '<p class="loading">🔄 Loading business directory...</p>';
        
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
        
        displayMembers(members);
        
    } catch (error) {
        console.error("❌ Error loading members:", error);
        
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
    
    container.innerHTML = "";
    
    members.forEach(member => {
        const card = createMemberCard(member);
        container.appendChild(card);
    });
    
    updateMemberCount(members.length);
    
    console.log(`✅ Successfully displayed ${members.length} members`);
}

function createMemberCard(member) {
    console.log(`   Creating card for: ${member.name}`);
    
    const card = document.createElement("div");
    card.className = "member-card";
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
    
    let imageSrc = member.image;
    
    if (imageSrc && !imageSrc.startsWith("http") && !imageSrc.includes("/")) {
        imageSrc = "images/" + imageSrc;
        console.log(`   🖼️ Fixed image path: ${imageSrc}`);
    }
    
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

function setupFooter() {
    console.log('🦶 Setting up footer dynamic content...');
    
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("currentYear");
    if (yearElement) {
        yearElement.textContent = currentYear;
        console.log(`✅ Copyright year set to: ${currentYear}`);
    }
    
    const lastModifiedElement = document.getElementById("lastModified");
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
        console.log(`✅ Last modified date set to: ${document.lastModified}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('🎉 DOM fully loaded - Initializing chamber directory...');
    
    setupMobileMenu();
    setupViewToggle();
    setupFooter();
    loadMembers();
    
    console.log('✅ Chamber directory initialization complete!');
    
    const style = document.createElement("style");
    style.textContent = `
        .member-count {
            font-size: 1rem;
            color: var(--color-dark);
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
            background-color: var(--color-primary);
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
    `;
    document.head.appendChild(style);
    console.log('🎨 Dynamic styles added');
});