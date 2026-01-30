// ============================
// COURSE MANAGER MODULE
// ============================
const CourseManager = (() => {
  // Course data with enhanced structure
  const courses = [
    { 
      id: 1, 
      subject: "WDD", 
      number: 130, 
      title: "Web Fundamentals", 
      credits: 2, 
      completed: true,
      description: "Introduction to web development with HTML and CSS",
      certificate: "Web & Computer Programming Certificate",
      technology: ["HTML5", "CSS3", "Git"],
      term: "Spring 2025"
    },
    { 
      id: 2, 
      subject: "WDD", 
      number: 131, 
      title: "Dynamic Web Fundamentals", 
      credits: 2, 
      completed: true,
      description: "Dynamic web content with JavaScript fundamentals",
      certificate: "Web & Computer Programming Certificate",
      technology: ["JavaScript", "DOM", "APIs"],
      term: "Fall 2025"
    },
    { 
      id: 3, 
      subject: "WDD", 
      number: 231, 
      title: "Web Frontend Development I", 
      credits: 2, 
      completed: false,
      description: "Advanced frontend development with modern frameworks",
      certificate: "Web Development Certificate",
      technology: ["React", "TypeScript", "SASS"],
      term: "Winter 2026"
    },
    { 
      id: 4, 
      subject: "WDD", 
      number: 330, 
      title: "Frontend Web Development II", 
      credits: 3, 
      completed: false,
      description: "Advanced web application development",
      certificate: "Web Development Certificate",
      technology: ["Next.js", "GraphQL", "Testing"],
      term: "Spring 2026"
    },
    { 
      id: 5, 
      subject: "CSE", 
      number: 111, 
      title: "Programming with Functions", 
      credits: 2, 
      completed: true,
      description: "Functional programming concepts and patterns",
      certificate: "Computer Programming Certificate",
      technology: ["Python", "Algorithms", "OOP"],
      term: "Fall 2025"
    },
    { 
      id: 6, 
      subject: "CSE", 
      number: 210, 
      title: "Programming with Classes", 
      credits: 2, 
      completed: true,
      description: "Object-oriented programming and design patterns",
      certificate: "Computer Programming Certificate",
      technology: ["C#", ".NET", "Design Patterns"],
      term: "Winter 2026"
    }
  ];

  // Public methods
  return {
    getAllCourses: () => [...courses],
    getCseCourses: () => courses.filter(course => course.subject === 'CSE'),
    getWddCourses: () => courses.filter(course => course.subject === 'WDD'),
    getCourseById: (id) => courses.find(course => course.id === id),
    toggleCompletion: (id) => {
      const course = courses.find(c => c.id === id);
      if (course) {
        course.completed = !course.completed;
        return true;
      }
      return false;
    },
    getCompletedCredits: () => 
      courses
        .filter(course => course.completed)
        .reduce((sum, course) => sum + course.credits, 0),
    getTotalCredits: () => 
      courses.reduce((sum, course) => sum + course.credits, 0),
    getProgressPercentage: () => {
      const total = CourseManager.getTotalCredits();
      const completed = CourseManager.getCompletedCredits();
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }
  };
})();

// ============================
// DOM MANAGER MODULE
// ============================
const DOMManager = (() => {
  // Cache DOM elements with meaningful names
  const elements = {
    loadingIndicator: document.getElementById('loading-indicator'),
    contentArea: document.getElementById('content-area'),
    currentYear: document.getElementById('current-year'),
    modifiedDate: document.getElementById('modified-date'),
    visitorCount: document.getElementById('visitor-count'),
    menuToggle: document.getElementById('menu-toggle'),
    navMenu: document.getElementById('nav-menu'),
    courseDetailsDialog: document.getElementById('course-details-dialog'),
    courseDialogTitle: document.getElementById('course-dialog-title'),
    courseDetailsContent: document.getElementById('course-details-content'),
    closeDialog: document.getElementById('close-dialog'),
    totalCredits: document.getElementById('total-credits'),
    creditsNumber: document.querySelector('.credits-number'),
    coursesAll: document.getElementById('courses-all'),
    coursesCSE: document.getElementById('courses-cse'),
    coursesWDD: document.getElementById('courses-wdd'),
    filterAll: document.getElementById('filter-all'),
    filterCSE: document.getElementById('filter-cse'),
    filterWDD: document.getElementById('filter-wdd'),
    columnAll: document.getElementById('column-all'),
    columnCSE: document.getElementById('column-cse'),
    columnWDD: document.getElementById('column-wdd')
  };

  // Element creation utilities
  const createElement = (tag, attributes = {}, textContent = '') => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    if (textContent) element.textContent = textContent;
    return element;
  };

  return {
    getElement: (key) => elements[key],
    getAllElements: () => ({ ...elements }),
    
    createCourseCard: (course) => {
      const card = createElement('article', {
        'class': `course-card ${course.completed ? 'completed' : 'in-progress'}`,
        'tabindex': '0',
        'role': 'button',
        'aria-label': `Course: ${course.subject} ${course.number}. ${course.completed ? 'Completed' : 'In progress'}. Click for details`,
        'data-course-id': course.id
      });

      card.innerHTML = `
        <div class="course-card-header">
          <h3 class="course-code">${course.subject} ${course.number}</h3>
          <span class="course-badge ${course.completed ? 'badge-completed' : 'badge-progress'}">
            ${course.completed ? '✓' : '▶'} ${course.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
        <div class="course-card-body">
          <h4 class="course-title">${course.title}</h4>
          <div class="course-meta">
            <span class="credits">
              <i class="fas fa-credit-card" aria-hidden="true"></i>
              ${course.credits} ${course.credits === 1 ? 'Credit' : 'Credits'}
            </span>
            <span class="term">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              ${course.term}
            </span>
          </div>
          <p class="course-description">${course.description}</p>
        </div>
        <div class="course-card-footer">
          <button class="btn-details" data-course-id="${course.id}" aria-label="View details for ${course.title}">
            View Details <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      `;

      return card;
    },

    updateProgressDisplay: () => {
      const completed = CourseManager.getCompletedCredits();
      const total = CourseManager.getTotalCredits();
      const percentage = CourseManager.getProgressPercentage();
      
      if (elements.creditsNumber) {
        elements.creditsNumber.textContent = `${completed} / ${total}`;
      }
      
      // Update progress bar if exists
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
      }
      
      return { completed, total, percentage };
    },

    showLoading: () => {
      elements.loadingIndicator?.removeAttribute('hidden');
      elements.contentArea?.setAttribute('hidden', '');
    },

    hideLoading: () => {
      elements.loadingIndicator?.setAttribute('hidden', '');
      elements.contentArea?.removeAttribute('hidden');
    },

    toggleMenu: (forceState) => {
      const isExpanded = forceState ?? elements.navMenu?.classList.toggle('open');
      elements.menuToggle?.setAttribute('aria-expanded', isExpanded);
      return isExpanded;
    },

    closeMenu: () => {
      elements.navMenu?.classList.remove('open');
      elements.menuToggle?.setAttribute('aria-expanded', 'false');
    },

    showCourseDetails: (course) => {
      if (!course || !elements.courseDetailsDialog) return;
      
      elements.courseDialogTitle.textContent = `${course.subject} ${course.number}: ${course.title}`;
      
      elements.courseDetailsContent.innerHTML = `
        <div class="course-details-header">
          <div class="course-status-badge ${course.completed ? 'badge-completed' : 'badge-progress'}">
            ${course.completed ? '✓ Completed' : 'In Progress'}
          </div>
          <p class="course-term"><i class="fas fa-calendar"></i> ${course.term}</p>
        </div>
        
        <div class="course-details-body">
          <section class="details-section" aria-labelledby="description-heading">
            <h3 id="description-heading">Description</h3>
            <p>${course.description}</p>
          </section>
          
          <div class="details-grid">
            <section class="details-section" aria-labelledby="credits-heading">
              <h3 id="credits-heading"><i class="fas fa-credit-card"></i> Credits</h3>
              <p class="detail-value">${course.credits}</p>
            </section>
            
            <section class="details-section" aria-labelledby="certificate-heading">
              <h3 id="certificate-heading"><i class="fas fa-certificate"></i> Certificate</h3>
              <p class="detail-value">${course.certificate}</p>
            </section>
            
            <section class="details-section" aria-labelledby="tech-heading">
              <h3 id="tech-heading"><i class="fas fa-code"></i> Technologies</h3>
              <ul class="tech-list" role="list">
                ${course.technology.map(tech => 
                  `<li><span class="tech-tag">${tech}</span></li>`
                ).join('')}
              </ul>
            </section>
            
            <section class="details-section" aria-labelledby="progress-heading">
              <h3 id="progress-heading"><i class="fas fa-tasks"></i> Progress</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${course.completed ? '100' : '30'}%" 
                     role="progressbar" 
                     aria-valuenow="${course.completed ? 100 : 30}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div class="course-details-footer">
          <button class="btn-toggle-completion" data-course-id="${course.id}">
            ${course.completed ? 'Mark as In Progress' : 'Mark as Completed'}
          </button>
        </div>
      `;
      
      // Show dialog as modal
      elements.courseDetailsDialog.showModal();
      
      // Focus first interactive element for accessibility
      const firstFocusable = elements.courseDetailsDialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    },

    closeCourseDetails: () => {
      elements.courseDetailsDialog?.close();
    },

    displayCourses: (courseList, container) => {
      if (!container) return;
      
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();
      
      courseList.forEach(course => {
        fragment.appendChild(DOMManager.createCourseCard(course));
      });
      
      container.appendChild(fragment);
    },

    setActiveFilter: (filterType) => {
      // Update button states
      [elements.filterAll, elements.filterCSE, elements.filterWDD].forEach(btn => {
        if (!btn) return;
        const isActive = btn.dataset.filter === filterType;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
      });
      
      // Show/hide columns
      [elements.columnAll, elements.columnCSE, elements.columnWDD].forEach(col => {
        if (!col) return;
        col.classList.toggle('hidden', col.id !== `column-${filterType}`);
        col.hidden = col.id !== `column-${filterType}`;
      });
    },

    updateVisitorCount: (count) => {
      if (elements.visitorCount) {
        elements.visitorCount.textContent = count.toLocaleString();
      }
    },

    updateDates: () => {
      if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
      }
      if (elements.modifiedDate) {
        const modified = new Date(document.lastModified);
        elements.modifiedDate.textContent = modified.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        elements.modifiedDate.setAttribute('datetime', modified.toISOString());
      }
    }
  };
})();

// ============================
// STORAGE MANAGER MODULE
// ============================
const StorageManager = (() => {
  const STORAGE_KEYS = {
    VISITOR_COUNT: 'wdd231_visitor_count',
    COURSE_COMPLETIONS: 'wdd231_course_completions',
    LAST_VISIT: 'wdd231_last_visit'
  };

  return {
    getVisitorCount: () => {
      let count = parseInt(localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT)) || 0;
      const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
      const today = new Date().toDateString();
      
      // Only increment if this is a new day visit
      if (lastVisit !== today) {
        count++;
        localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, count);
        localStorage.setItem(STORAGE_KEYS.LAST_VISIT, today);
      }
      
      return count;
    },

    saveCourseCompletions: (completions) => {
      localStorage.setItem(STORAGE_KEYS.COURSE_COMPLETIONS, JSON.stringify(completions));
    },

    loadCourseCompletions: () => {
      const data = localStorage.getItem(STORAGE_KEYS.COURSE_COMPLETIONS);
      return data ? JSON.parse(data) : null;
    }
  };
})();

// ============================
// EVENT MANAGER MODULE
// ============================
const EventManager = (() => {
  let eventHandlers = [];
  
  const addEvent = (element, eventType, handler, options = {}) => {
    element.addEventListener(eventType, handler, options);
    eventHandlers.push({ element, eventType, handler });
  };

  const removeAllEvents = () => {
    eventHandlers.forEach(({ element, eventType, handler }) => {
      element.removeEventListener(eventType, handler);
    });
    eventHandlers = [];
  };

  const initializeCourseEvents = () => {
    const elements = DOMManager.getAllElements();
    
    // Course card clicks
    document.addEventListener('click', (event) => {
      const card = event.target.closest('.course-card');
      if (card) {
        const courseId = parseInt(card.dataset.courseId);
        const course = CourseManager.getCourseById(courseId);
        if (course) {
          DOMManager.showCourseDetails(course);
          event.preventDefault();
        }
      }
      
      // Details button clicks
      const detailsBtn = event.target.closest('.btn-details');
      if (detailsBtn) {
        const courseId = parseInt(detailsBtn.dataset.courseId);
        const course = CourseManager.getCourseById(courseId);
        if (course) {
          DOMManager.showCourseDetails(course);
          event.preventDefault();
          event.stopPropagation();
        }
      }
      
      // Toggle completion in dialog
      const toggleBtn = event.target.closest('.btn-toggle-completion');
      if (toggleBtn) {
        const courseId = parseInt(toggleBtn.dataset.courseId);
        CourseManager.toggleCompletion(courseId);
        DOMManager.updateProgressDisplay();
        // Refresh current view
        AppController.refreshCourses();
        event.preventDefault();
      }
    });

    // Filter buttons
    if (elements.filterAll) {
      addEvent(elements.filterAll, 'click', () => {
        DOMManager.setActiveFilter('all');
        DOMManager.displayCourses(CourseManager.getAllCourses(), elements.coursesAll);
      });
    }

    if (elements.filterCSE) {
      addEvent(elements.filterCSE, 'click', () => {
        DOMManager.setActiveFilter('cse');
        DOMManager.displayCourses(CourseManager.getCseCourses(), elements.coursesCSE);
      });
    }

    if (elements.filterWDD) {
      addEvent(elements.filterWDD, 'click', () => {
        DOMManager.setActiveFilter('wdd');
        DOMManager.displayCourses(CourseManager.getWddCourses(), elements.coursesWDD);
      });
    }

    // Menu toggle
    if (elements.menuToggle) {
      addEvent(elements.menuToggle, 'click', () => DOMManager.toggleMenu());
    }

    // Close dialog
    if (elements.closeDialog) {
      addEvent(elements.closeDialog, 'click', () => DOMManager.closeCourseDetails());
    }

    // Close dialog with Escape key
    addEvent(document, 'keydown', (event) => {
      if (event.key === 'Escape') {
        DOMManager.closeCourseDetails();
        DOMManager.closeMenu();
      }
    });

    // Close menu when clicking outside on mobile
    addEvent(document, 'click', (event) => {
      const elements = DOMManager.getAllElements();
      if (window.innerWidth <= 768 && elements.navMenu?.classList.contains('open')) {
        const isClickInside = elements.navMenu.contains(event.target);
        const isClickOnToggle = elements.menuToggle?.contains(event.target);
        
        if (!isClickInside && !isClickOnToggle) {
          DOMManager.closeMenu();
        }
      }
    });

    // Handle dialog clicks outside content
    if (elements.courseDetailsDialog) {
      addEvent(elements.courseDetailsDialog, 'click', (event) => {
        if (event.target === elements.courseDetailsDialog) {
          DOMManager.closeCourseDetails();
        }
      });
    }

    // Course card keyboard navigation
    addEvent(document, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const activeCard = document.activeElement.closest('.course-card');
        if (activeCard && document.activeElement === activeCard) {
          event.preventDefault();
          activeCard.click();
        }
      }
    });
  };

  return {
    initialize: initializeCourseEvents,
    cleanup: removeAllEvents
  };
})();

// ============================
// APP CONTROLLER
// ============================
const AppController = (() => {
  let isInitialized = false;
  
  const init = async () => {
    if (isInitialized) return;
    
    console.log('🚀 Initializing WDD231 Portfolio Application...');
    DOMManager.showLoading();
    
    try {
      // Initialize data
      await loadInitialData();
      
      // Initialize UI
      initializeUI();
      
      // Initialize events
      EventManager.initialize();
      
      // Finalize
      DOMManager.hideLoading();
      isInitialized = true;
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing application:', error);
      showErrorState();
    }
  };
  
  const loadInitialData = async () => {
    // Simulate async data loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Update visitor count
    const visitorCount = StorageManager.getVisitorCount();
    DOMManager.updateVisitorCount(visitorCount);
    
    // Update dates
    DOMManager.updateDates();
    
    // Load saved course completions if any
    const savedCompletions = StorageManager.loadCourseCompletions();
    if (savedCompletions) {
      console.log('📂 Loaded saved course progress');
    }
  };
  
  const initializeUI = () => {
    // Set initial filter
    DOMManager.setActiveFilter('all');
    
    // Display courses
    DOMManager.displayCourses(CourseManager.getAllCourses(), DOMManager.getElement('coursesAll'));
    DOMManager.displayCourses(CourseManager.getCseCourses(), DOMManager.getElement('coursesCSE'));
    DOMManager.displayCourses(CourseManager.getWddCourses(), DOMManager.getElement('coursesWDD'));
    
    // Update progress display
    const progress = DOMManager.updateProgressDisplay();
    console.log(`📊 Progress: ${progress.percentage}% (${progress.completed}/${progress.total} credits)`);
  };
  
  const refreshCourses = () => {
    const elements = DOMManager.getAllElements();
    const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    switch (currentFilter) {
      case 'cse':
        DOMManager.displayCourses(CourseManager.getCseCourses(), elements.coursesCSE);
        break;
      case 'wdd':
        DOMManager.displayCourses(CourseManager.getWddCourses(), elements.coursesWDD);
        break;
      default:
        DOMManager.displayCourses(CourseManager.getAllCourses(), elements.coursesAll);
    }
    
    DOMManager.updateProgressDisplay();
  };
  
  const showErrorState = () => {
    DOMManager.hideLoading();
    const contentArea = DOMManager.getElement('content-area');
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
          <h2>Something went wrong</h2>
          <p>Unable to load the application. Please try refreshing the page.</p>
          <button class="btn-retry" onclick="location.reload()">Retry</button>
        </div>
      `;
      contentArea.removeAttribute('hidden');
    }
  };
  
  const destroy = () => {
    EventManager.cleanup();
    isInitialized = false;
    console.log('🔄 Application cleaned up');
  };
  
  return {
    init,
    refreshCourses,
    destroy
  };
})();

// ============================
// SERVICE WORKER REGISTRATION
// ============================
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/wdd231/sw.js')
        .then(registration => {
          console.log('✅ ServiceWorker registered:', registration.scope);
        })
        .catch(error => {
          console.log('❌ ServiceWorker registration failed:', error);
        });
    });
  }
};

// ============================
// PERFORMANCE MONITORING
// ============================
const PerformanceMonitor = {
  startTime: 0,
  
  start: () => {
    PerformanceMonitor.startTime = performance.now();
  },
  
  log: (message) => {
    const duration = performance.now() - PerformanceMonitor.startTime;
    console.log(`⏱️ ${message} - ${duration.toFixed(2)}ms`);
  }
};

// ============================
// INITIALIZE APPLICATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
  PerformanceMonitor.start();
  
  // Initialize app
  AppController.init();
  
  // Register service worker
  registerServiceWorker();
  
  PerformanceMonitor.log('DOM Content Loaded');
});

// ============================
// WINDOW EVENT LISTENERS
// ============================
window.addEventListener('beforeunload', () => {
  // Save course completions before leaving
  const completions = CourseManager.getAllCourses()
    .filter(course => course.completed)
    .map(course => course.id);
  StorageManager.saveCourseCompletions(completions);
});

window.addEventListener('resize', () => {
  // Close menu on resize to desktop
  if (window.innerWidth > 768) {
    DOMManager.closeMenu();
  }
});

// ============================
// EXPORTS FOR DEBUGGING
// ============================
if (process.env.NODE_ENV === 'development') {
  window.AppDebug = {
    CourseManager,
    DOMManager,
    StorageManager,
    AppController,
    PerformanceMonitor
  };
}