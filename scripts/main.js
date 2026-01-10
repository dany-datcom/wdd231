// ============================
// COURSE DATA
// ============================
const courses = [
  { id: 1, subject: "WDD", number: 130, title: "Web Fundamentals", credits: 3, completed: true },
  { id: 2, subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 3, completed: true },
  { id: 3, subject: "WDD", number: 231, title: "Frontend Web Development I", credits: 3, completed: false },
  { id: 4, subject: "WDD", number: 330, title: "Frontend Web Development II", credits: 3, completed: false },
  { id: 5, subject: "CSE", number: 121, title: "Programming with Functions", credits: 3, completed: true },
  { id: 6, subject: "CSE", number: 210, title: "Programming with Classes", credits: 3, completed: false }
];

// ============================
// DOM ELEMENTS
// ============================
const loadingIndicator = document.getElementById('loading-indicator');
const contentArea = document.getElementById('content-area');
const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastModified');
const visitorCountSpan = document.getElementById('visitorCount');
const menuButton = document.getElementById('menu');
const navMenu = document.getElementById('nav');

// Course containers
const coursesAll = document.getElementById('courses-all');
const coursesCSE = document.getElementById('courses-cse');
const coursesWDD = document.getElementById('courses-wdd');
const totalCreditsElement = document.getElementById('total-credits');

// Filter buttons
const filterAllBtn = document.getElementById('filter-all');
const filterCSEBtn = document.getElementById('filter-cse');
const filterWDDBtn = document.getElementById('filter-wdd');

// Columns
const columnAll = document.getElementById('column-all');
const columnCSE = document.getElementById('column-cse');
const columnWDD = document.getElementById('column-wdd');

// ============================
// UTILITY FUNCTIONS
// ============================

function updateDates() {
  currentYearSpan.textContent = new Date().getFullYear();
  lastModifiedSpan.textContent = document.lastModified;
}

function updateVisitorCount() {
  let count = localStorage.getItem('visitorCount') || 0;
  count = parseInt(count) + 1;
  localStorage.setItem('visitorCount', count);
  visitorCountSpan.textContent = count;
}

function setupMobileMenu() {
  menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isExpanded = navMenu.classList.contains('open');
    menuButton.setAttribute('aria-expanded', isExpanded);
  });
  
  // Close menu when clicking on links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function createCourseCard(course) {
  const card = document.createElement('div');
  card.className = `course-card ${course.completed ? 'completed' : ''}`;
  
  card.innerHTML = `
    <h3>${course.subject} ${course.number}</h3>
    <p>${course.title}</p>
    <p><strong>Credits:</strong> ${course.credits}</p>
    <p class="course-status">
      ${course.completed ? '✓ Completed' : 'In Progress'}
    </p>
  `;
  
  // Add click event to toggle completion
  card.addEventListener('click', () => {
    course.completed = !course.completed;
    card.classList.toggle('completed');
    card.querySelector('.course-status').textContent = 
      course.completed ? '✓ Completed' : 'In Progress';
    updateTotalCredits();
  });
  
  return card;
}

function clearCourses() {
  coursesAll.innerHTML = '';
  coursesCSE.innerHTML = '';
  coursesWDD.innerHTML = '';
}

function updateTotalCredits() {
  const total = courses.reduce((sum, course) => sum + course.credits, 0);
  const completed = courses
    .filter(course => course.completed)
    .reduce((sum, course) => sum + course.credits, 0);
  
  totalCreditsElement.innerHTML = `
    <strong>Progress:</strong> ${completed} / ${total} credits completed
    <br>
    <small>(${courses.length} courses total)</small>
  `;
}

function showAllCourses() {
  clearCourses();
  
  // Hide all columns
  columnAll.classList.remove('hidden');
  columnCSE.classList.add('hidden');
  columnWDD.classList.add('hidden');
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  filterAllBtn.classList.add('active');
  
  // Display all courses
  courses.forEach(course => {
    coursesAll.appendChild(createCourseCard(course));
  });
  
  updateTotalCredits();
}

function showCSECourses() {
  clearCourses();
  
  // Show CSE column, hide others
  columnAll.classList.add('hidden');
  columnCSE.classList.remove('hidden');
  columnWDD.classList.add('hidden');
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  filterCSEBtn.classList.add('active');
  
  // Display CSE courses
  const cseCourses = courses.filter(course => course.subject === 'CSE');
  cseCourses.forEach(course => {
    coursesCSE.appendChild(createCourseCard(course));
  });
  
  updateTotalCredits();
}

function showWDDCourses() {
  clearCourses();
  
  // Show WDD column, hide others
  columnAll.classList.add('hidden');
  columnCSE.classList.add('hidden');
  columnWDD.classList.remove('hidden');
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  filterWDDBtn.classList.add('active');
  
  // Display WDD courses
  const wddCourses = courses.filter(course => course.subject === 'WDD');
  wddCourses.forEach(course => {
    coursesWDD.appendChild(createCourseCard(course));
  });
  
  updateTotalCredits();
}

function initializeEventListeners() {
  // Filter buttons
  filterAllBtn.addEventListener('click', showAllCourses);
  filterCSEBtn.addEventListener('click', showCSECourses);
  filterWDDBtn.addEventListener('click', showWDDCourses);
  
  // Close dropdown when clicking outside on mobile
  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnButton = menuButton.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnButton && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    }
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

function hideLoading() {
  // Simulate loading delay (remove in production)
  setTimeout(() => {
    loadingIndicator.style.display = 'none';
    contentArea.style.display = 'block';
    console.log('Page loaded successfully!');
  }, 800); // 800ms delay to show loading animation
}

// ============================
// INITIALIZATION
// ============================
function init() {
  console.log('Initializing application...');
  
  // Initialize dates and visitor count
  updateDates();
  updateVisitorCount();
  
  // Setup mobile menu
  setupMobileMenu();
  
  // Initialize courses
  showAllCourses();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Hide loading indicator after setup
  hideLoading();
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// For debugging
console.log('Script loaded successfully');
