/**
 * ============================================================================
 * EDUPULSE STUDENT DASHBOARD - SINGLE PAGE APPLICATION (SPA) ENGINE
 * ============================================================================
 * Architecture Overview:
 * 1. State Management: Centralized reactive store for Courses, Tasks, Profile, Theme.
 * 2. Client-Side Routing: Hash-based routing (#dashboard, #courses, #tasks, #profile, 404).
 * 3. Dynamic Rendering: Modular template rendering for seamless SPA transitions.
 * 4. DOM Manipulation & Event Delegation: High-performance event listeners without memory leaks.
 * 5. Data Persistence: Resilient LocalStorage synchronization with error fallbacks.
 * ============================================================================
 */

'use strict';

(function () {
  // --------------------------------------------------------------------------
  // 1. DEFAULT SEED DATA (Used on initial load or reset)
  // --------------------------------------------------------------------------
  const DEFAULT_PROFILE = {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@university.edu',
    studentId: 'STU-2024-8842',
    major: 'Computer Science & Software Engineering',
    semester: 'Semester 6 • Fall 2026',
    gpa: '3.82',
    academicStanding: "Dean's Honor Roll",
    bio: 'Passionate frontend developer and undergraduate researcher exploring single-page applications, distributed systems, and accessibility in modern web applications.',
    emailNotifications: true,
    weeklyDigest: true
  };

  const DEFAULT_COURSES = [
    {
      id: 'CS-301',
      code: 'CS-301',
      title: 'Full-Stack Web Architectures',
      category: 'Web Tech',
      instructor: 'Dr. Evelyn Reed',
      instructorInitials: 'ER',
      credits: 4,
      description: 'Single-page applications, asynchronous DOM patterns, state management, REST APIs, and modern responsive frontend engineering.',
      modules: [
        { id: 1, title: 'Module 1: HTML5 Semantics & Accessible UI', completed: true },
        { id: 2, title: 'Module 2: Responsive CSS Layouts & Custom Properties', completed: true },
        { id: 3, title: 'Module 3: JavaScript ES6+ & DOM Events', completed: true },
        { id: 4, title: 'Module 4: Client-Side Routing & SPA Architecture', completed: true },
        { id: 5, title: 'Module 5: State Persistence & Storage Security', completed: false },
        { id: 6, title: 'Module 6: Capstone Project Deployment', completed: false }
      ]
    },
    {
      id: 'CS-340',
      code: 'CS-340',
      title: 'Distributed Systems & Cloud Computing',
      category: 'Core CS',
      instructor: 'Prof. Marcus Chen',
      instructorInitials: 'MC',
      credits: 4,
      description: 'Consensus algorithms, microservices architecture, horizontal scalability, message brokers, and fault-tolerant computing.',
      modules: [
        { id: 1, title: 'Module 1: Network Fundamentals & RPCs', completed: true },
        { id: 2, title: 'Module 2: Concurrency & Virtualization', completed: true },
        { id: 3, title: 'Module 3: Raft & Paxos Consensus Models', completed: false },
        { id: 4, title: 'Module 4: Container Orchestration & Kubernetes', completed: false }
      ]
    },
    {
      id: 'CS-380',
      code: 'CS-380',
      title: 'Artificial Intelligence & Neural Networks',
      category: 'AI & Data',
      instructor: 'Dr. Sarah Al-Mansoor',
      instructorInitials: 'SA',
      credits: 4,
      description: 'Supervised learning, deep neural networks, transformer models, reinforcement learning, and ethical considerations in AI.',
      modules: [
        { id: 1, title: 'Module 1: Classical Search & Heuristics', completed: true },
        { id: 2, title: 'Module 2: Linear Regression & Classification', completed: true },
        { id: 3, title: 'Module 3: Deep Backpropagation & PyTorch', completed: true },
        { id: 4, title: 'Module 4: Attention Mechanisms & LLMs', completed: false },
        { id: 5, title: 'Module 5: Reinforcement Learning Agents', completed: false }
      ]
    },
    {
      id: 'CS-250',
      code: 'CS-250',
      title: 'Database Management Systems',
      category: 'Core CS',
      instructor: 'Prof. David Vance',
      instructorInitials: 'DV',
      credits: 3,
      description: 'Relational algebra, SQL query optimization, ACID transactions, indexing data structures, and NoSQL document stores.',
      modules: [
        { id: 1, title: 'Module 1: Relational Schema Normalization', completed: true },
        { id: 2, title: 'Module 2: Advanced SQL & Query Plans', completed: true },
        { id: 3, title: 'Module 3: B-Trees & Index Optimization', completed: true },
        { id: 4, title: 'Module 4: Distributed ACID Transactions', completed: true }
      ]
    },
    {
      id: 'CS-410',
      code: 'CS-410',
      title: 'Mobile Application Development',
      category: 'Software Eng',
      instructor: 'Elena Gomez, M.S.',
      instructorInitials: 'EG',
      credits: 3,
      description: 'Cross-platform mobile UI development, offline-first architectures, touch gestures, push notifications, and device sensors.',
      modules: [
        { id: 1, title: 'Module 1: Mobile UI & View Hierarchies', completed: true },
        { id: 2, title: 'Module 2: State Lifecycle & Local DB Storage', completed: false },
        { id: 3, title: 'Module 3: Hardware Sensors & Geolocation', completed: false },
        { id: 4, title: 'Module 4: App Store Production Packaging', completed: false }
      ]
    }
  ];

  const DEFAULT_TASKS = [
    {
      id: 'task-1',
      title: 'Submit Single Page Application Simulation (Week 5)',
      course: 'CS-301',
      dueDate: getRelativeDateString(1),
      priority: 'high',
      category: 'Project',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Read Raft Consensus Algorithm Paper (Sections 1-4)',
      course: 'CS-340',
      dueDate: getRelativeDateString(3),
      priority: 'medium',
      category: 'Reading',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Implement Multi-Head Attention Mechanism Notebook',
      course: 'CS-380',
      dueDate: getRelativeDateString(5),
      priority: 'high',
      category: 'Assignment',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'Optimize B+ Tree Index Queries in SQLite',
      course: 'CS-250',
      dueDate: getRelativeDateString(-2), // overdue example
      priority: 'low',
      category: 'Assignment',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-5',
      title: 'Design Mobile Wireframes for Campus Transport App',
      course: 'CS-410',
      dueDate: getRelativeDateString(7),
      priority: 'medium',
      category: 'Project',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Helper to format ISO date offset
  function getRelativeDateString(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  // --------------------------------------------------------------------------
  // 2. CENTRAL APPLICATION STATE
  // --------------------------------------------------------------------------
  const AppState = {
    currentRoute: 'dashboard',
    profile: null,
    courses: [],
    tasks: [],
    theme: 'light',
    
    // UI Filters and active selections
    taskFilter: {
      status: 'all',     // 'all' | 'pending' | 'completed'
      priority: 'all',   // 'all' | 'high' | 'medium' | 'low'
      searchQuery: '',
      sortBy: 'dueDate'  // 'dueDate' | 'priority' | 'title'
    },
    courseFilter: {
      category: 'all',   // 'all' | 'Core CS' | 'AI & Data' | 'Software Eng' | 'Web Tech'
      searchQuery: ''
    },
    selectedCourseForModal: null,
    pendingConfirmAction: null
  };

  // --------------------------------------------------------------------------
  // 3. STORAGE SERVICE (Safe LocalStorage abstraction)
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    PROFILE: 'edupulse_spa_profile_v1',
    COURSES: 'edupulse_spa_courses_v1',
    TASKS: 'edupulse_spa_tasks_v1',
    THEME: 'edupulse_spa_theme_v1'
  };

  const StorageService = {
    isAvailable() {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        console.warn('LocalStorage is unavailable or restricted. Operating in-memory.', e);
        return false;
      }
    },

    load(key, fallbackValue) {
      if (!this.isAvailable()) return fallbackValue;
      try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) return fallbackValue;
        return JSON.parse(serialized);
      } catch (err) {
        console.error(`Failed to parse LocalStorage key "${key}". Falling back to default:`, err);
        return fallbackValue;
      }
    },

    save(key, value) {
      if (!this.isAvailable()) return;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error(`Failed to save to LocalStorage key "${key}":`, err);
      }
    },

    clearAll() {
      if (!this.isAvailable()) return;
      try {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      } catch (err) {
        console.error('Error clearing application LocalStorage:', err);
      }
    }
  };

  // --------------------------------------------------------------------------
  // 4. TOAST NOTIFICATION SERVICE
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSymbol = 'ℹ️';
    if (type === 'success') iconSymbol = '✅';
    if (type === 'error') iconSymbol = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${iconSymbol}</span>
      <span class="toast-message">${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 5. SECURITY & UTILITY HELPERS
  // --------------------------------------------------------------------------
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const s = String(str);
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function calculateCourseProgress(course) {
    if (!course.modules || course.modules.length === 0) return 0;
    const completedCount = course.modules.filter(m => m.completed).length;
    return Math.round((completedCount / course.modules.length) * 100);
  }

  function formatDateFriendly(dateString) {
    if (!dateString) return 'No date';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(year, month - 1, day);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);

    if (diffDays < 0) {
      return { text: `${formatted} (Overdue)`, status: 'overdue' };
    } else if (diffDays === 0) {
      return { text: `${formatted} (Today)`, status: 'today' };
    } else if (diffDays === 1) {
      return { text: `${formatted} (Tomorrow)`, status: 'soon' };
    } else {
      return { text: formatted, status: 'normal' };
    }
  }

  // --------------------------------------------------------------------------
  // 6. REACTIVE UI SYNCHRONIZATION
  // --------------------------------------------------------------------------
  function updateGlobalUI() {
    // 1. Update Profile representations in Topbar & Sidebar
    const fullName = `${AppState.profile.firstName} ${AppState.profile.lastName}`.trim();
    const initials = `${AppState.profile.firstName.charAt(0)}${AppState.profile.lastName.charAt(0)}`.toUpperCase() || 'AM';

    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserStatus = document.getElementById('sidebarUserStatus');
    const topbarAvatar = document.getElementById('topbarAvatar');
    const topbarUserName = document.getElementById('topbarUserName');

    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    if (sidebarUserName) sidebarUserName.textContent = fullName;
    if (sidebarUserStatus) sidebarUserStatus.textContent = `${AppState.profile.semester}`;
    if (topbarAvatar) topbarAvatar.textContent = initials;
    if (topbarUserName) topbarUserName.textContent = fullName;

    // 2. Update Badges
    const pendingTasksCount = AppState.tasks.filter(t => !t.completed).length;
    const tasksBadge = document.getElementById('tasksPendingBadge');
    if (tasksBadge) {
      tasksBadge.textContent = pendingTasksCount;
      tasksBadge.style.display = pendingTasksCount > 0 ? 'inline-block' : 'none';
    }

    const coursesBadge = document.getElementById('coursesCountBadge');
    if (coursesBadge) {
      coursesBadge.textContent = AppState.courses.length;
    }
  }

  // --------------------------------------------------------------------------
  // 7. CLIENT-SIDE ROUTER ENGINE
  // --------------------------------------------------------------------------
  const Router = {
    routes: {
      dashboard: renderDashboardView,
      courses: renderCoursesView,
      tasks: renderTasksView,
      profile: renderProfileView
    },

    init() {
      // Listen to hash changes for SPA navigation
      window.addEventListener('hashchange', () => this.handleRouting());
      
      // Handle initial route on first load
      this.handleRouting();
    },

    handleRouting() {
      // Parse hash e.g. "#tasks" -> "tasks"
      let hash = window.location.hash.replace(/^#\/?/, '').trim();
      
      // Default route
      if (!hash) {
        hash = 'dashboard';
        // Normalize hash in URL without re-triggering reload
        window.location.hash = '#dashboard';
        return;
      }

      AppState.currentRoute = hash;

      // Update Active Navigation link styling
      this.updateActiveNavLinks(hash);

      // Update Topbar Breadcrumb
      const breadcrumbEl = document.getElementById('currentBreadcrumb');
      if (breadcrumbEl) {
        if (this.routes[hash]) {
          breadcrumbEl.textContent = hash.charAt(0).toUpperCase() + hash.slice(1);
        } else {
          breadcrumbEl.textContent = '404 - Not Found';
        }
      }

      // Render corresponding view
      const renderFunc = this.routes[hash];
      const appView = document.getElementById('app-view');
      if (!appView) return;

      // Animate view transition
      appView.innerHTML = '';
      appView.classList.remove('view-enter');
      void appView.offsetWidth; // Trigger reflow for animation restart
      appView.classList.add('view-enter');

      if (typeof renderFunc === 'function') {
        renderFunc(appView);
      } else {
        renderNotFoundView(appView, hash);
      }

      // Focus management for accessibility
      appView.focus();

      // Close mobile drawer if opened
      closeMobileSidebar();
    },

    updateActiveNavLinks(activeRoute) {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        const route = link.getAttribute('data-route');
        if (route === activeRoute) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    },

    navigate(routeName) {
      window.location.hash = `#${routeName}`;
    }
  };

  // --------------------------------------------------------------------------
  // 8. VIEW 1: DASHBOARD COMPONENT
  // --------------------------------------------------------------------------
  function renderDashboardView(container) {
    const pendingTasks = AppState.tasks.filter(t => !t.completed);
    const completedTasks = AppState.tasks.filter(t => t.completed);
    const totalTasks = AppState.tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // Compute average course progress
    const totalCourseProgress = AppState.courses.reduce((acc, c) => acc + calculateCourseProgress(c), 0);
    const avgProgress = AppState.courses.length > 0 ? Math.round(totalCourseProgress / AppState.courses.length) : 0;

    // Greeting logic
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    container.innerHTML = `
      <!-- Welcome Hero Card -->
      <section class="dashboard-hero-card" aria-label="Welcome Banner">
        <div class="hero-text">
          <h2>${greeting}, ${escapeHTML(AppState.profile.firstName)}! 👋</h2>
          <p>
            You are enrolled in <strong>${AppState.courses.length} courses</strong> for ${escapeHTML(AppState.profile.semester)}. 
            You have <strong>${pendingTasks.length} pending tasks</strong> due soon. Keep up the high momentum!
          </p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-hero-white" id="quickAddTaskBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Task
          </button>
          <a href="#courses" class="btn btn-hero-ghost">
            View Courses
          </a>
        </div>
      </section>

      <!-- KPI Statistics Grid -->
      <section class="stats-grid" aria-label="Key Performance Indicators">
        <article class="card stat-card">
          <div class="stat-icon blue" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Active Courses</span>
            <span class="stat-value">${AppState.courses.length}</span>
            <span class="stat-subtitle">${AppState.courses.reduce((sum, c) => sum + c.credits, 0)} Total Credits</span>
          </div>
        </article>

        <article class="card stat-card">
          <div class="stat-icon violet" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Pending Tasks</span>
            <span class="stat-value">${pendingTasks.length}</span>
            <span class="stat-subtitle">${completedTasks.length} Completed (${taskCompletionRate}%)</span>
          </div>
        </article>

        <article class="card stat-card">
          <div class="stat-icon green" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Semester Progress</span>
            <span class="stat-value">${avgProgress}%</span>
            <span class="stat-subtitle">Curriculum Completed</span>
          </div>
        </article>

        <article class="card stat-card">
          <div class="stat-icon orange" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Cumulative GPA</span>
            <span class="stat-value">${escapeHTML(AppState.profile.gpa)}</span>
            <span class="stat-subtitle">${escapeHTML(AppState.profile.academicStanding)}</span>
          </div>
        </article>
      </section>

      <!-- Dashboard Two-Column Layout -->
      <div class="dashboard-layout-grid">
        <!-- Left: Urgent Deadlines & Tasks -->
        <div class="card">
          <div class="card-header-flex">
            <h3>Upcoming Deadlines</h3>
            <a href="#tasks" class="btn btn-outline-primary btn-sm">View All Tasks</a>
          </div>

          <div id="dashboardTaskList">
            ${renderQuickTaskSnippet(pendingTasks.slice(0, 4))}
          </div>
        </div>

        <!-- Right: Course Quick Progress -->
        <div class="card">
          <div class="card-header-flex">
            <h3>Enrolled Courses</h3>
            <a href="#courses" class="btn btn-outline-primary btn-sm">Manage Courses</a>
          </div>

          <div class="course-mini-list">
            ${AppState.courses.map(course => {
              const progress = calculateCourseProgress(course);
              return `
                <div class="course-mini-card">
                  <div class="course-mini-header">
                    <span class="course-mini-title">${escapeHTML(course.code)}: ${escapeHTML(course.title)}</span>
                    <span class="badge badge-blue">${progress}%</span>
                  </div>
                  <div class="progress-bar-container" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Hook up Quick Action button
    const quickAddBtn = container.querySelector('#quickAddTaskBtn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => openTaskModal());
    }

    // Attach event delegation for quick task toggle on dashboard
    const quickTaskListEl = container.querySelector('#dashboardTaskList');
    if (quickTaskListEl) {
      quickTaskListEl.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"][data-task-id]')) {
          const taskId = e.target.getAttribute('data-task-id');
          toggleTaskStatus(taskId);
          // Re-render dashboard to reflect KPI changes
          renderDashboardView(container);
        }
      });
    }
  }

  function renderQuickTaskSnippet(tasks) {
    if (tasks.length === 0) {
      return `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <div class="empty-state-icon" style="width:48px;height:48px;margin-bottom:0.75rem;">🎉</div>
          <h3>All caught up!</h3>
          <p>You have no pending deadlines. Enjoy your free time or prepare ahead!</p>
        </div>
      `;
    }

    return `
      <ul class="quick-task-list">
        ${tasks.map(task => {
          const dateInfo = formatDateFriendly(task.dueDate);
          return `
            <li class="quick-task-item ${task.priority}">
              <div class="task-left-section">
                <label class="custom-checkbox" aria-label="Mark task ${escapeHTML(task.title)} complete">
                  <input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                  <span class="checkmark"></span>
                </label>
                <div class="quick-task-info">
                  <span class="quick-task-title">${escapeHTML(task.title)}</span>
                  <div class="quick-task-meta">
                    <span class="badge badge-neutral">${escapeHTML(task.course)}</span>
                    <span class="badge ${dateInfo.status === 'overdue' ? 'badge-danger' : 'badge-neutral'}">
                      📅 ${dateInfo.text}
                    </span>
                  </div>
                </div>
              </div>
              <span class="badge ${task.priority === 'high' ? 'badge-danger' : (task.priority === 'medium' ? 'badge-warning' : 'badge-success')}">
                ${task.priority.toUpperCase()}
              </span>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  // --------------------------------------------------------------------------
  // 9. VIEW 2: COURSES COMPONENT
  // --------------------------------------------------------------------------
  function renderCoursesView(container) {
    // Filter courses based on active category & search query
    const filteredCourses = AppState.courses.filter(course => {
      const matchesCategory = AppState.courseFilter.category === 'all' || course.category === AppState.courseFilter.category;
      const query = AppState.courseFilter.searchQuery.toLowerCase();
      const matchesSearch = !query || 
        course.title.toLowerCase().includes(query) || 
        course.code.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    const categories = ['all', 'Core CS', 'AI & Data', 'Software Eng', 'Web Tech'];

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Enrolled Academic Courses
          </h1>
          <p>Explore your current semester curriculum, track syllabus modules, and view course details.</p>
        </div>
      </div>

      <!-- Courses Filter Toolbar -->
      <div class="courses-toolbar">
        <div class="filter-pills" role="tablist" aria-label="Course categories">
          ${categories.map(cat => `
            <button 
              type="button" 
              class="filter-pill ${AppState.courseFilter.category === cat ? 'active' : ''}" 
              data-category="${cat}"
              role="tab"
              aria-selected="${AppState.courseFilter.category === cat ? 'true' : 'false'}"
            >
              ${cat === 'all' ? 'All Categories' : cat}
            </button>
          `).join('')}
        </div>

        <div style="font-size: 0.88rem; color: var(--text-muted); font-weight: 500;">
          Showing <strong>${filteredCourses.length}</strong> of <strong>${AppState.courses.length}</strong> Courses
        </div>
      </div>

      <!-- Courses Cards Grid -->
      <div class="courses-grid" id="coursesGrid">
        ${filteredCourses.length === 0 ? `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">📚</div>
            <h3>No courses found</h3>
            <p>Try switching categories or clearing your search filter.</p>
          </div>
        ` : filteredCourses.map(course => {
          const progress = calculateCourseProgress(course);
          const completedModules = course.modules.filter(m => m.completed).length;
          const totalModules = course.modules.length;

          return `
            <article class="card course-card">
              <div>
                <div class="course-card-top">
                  <span class="course-code">${escapeHTML(course.code)}</span>
                  <span class="badge badge-violet">${escapeHTML(course.category)}</span>
                </div>
                <h3 class="course-title">${escapeHTML(course.title)}</h3>
                <p class="course-desc">${escapeHTML(course.description)}</p>
                <div class="course-instructor">
                  <div class="instructor-avatar">${course.instructorInitials}</div>
                  <span>${escapeHTML(course.instructor)} • <strong>${course.credits} Credits</strong></span>
                </div>
              </div>

              <div>
                <div class="course-progress-section">
                  <div class="course-progress-label">
                    <span>Course Completion</span>
                    <span>${completedModules}/${totalModules} Modules (${progress}%)</span>
                  </div>
                  <div class="progress-bar-container" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                  </div>
                </div>

                <div class="course-card-footer">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary btn-sm view-syllabus-btn" 
                    data-course-id="${course.id}"
                    style="flex: 1;"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Syllabus & Modules
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    // Event delegation for category filter pills
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        AppState.courseFilter.category = pill.getAttribute('data-category');
        renderCoursesView(container);
      });
    });

    // Event delegation for Syllabus modal
    container.addEventListener('click', (e) => {
      const syllabusBtn = e.target.closest('.view-syllabus-btn');
      if (syllabusBtn) {
        const courseId = syllabusBtn.getAttribute('data-course-id');
        const course = AppState.courses.find(c => c.id === courseId);
        if (course) {
          openCourseModal(course);
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. VIEW 3: TASKS COMPONENT
  // --------------------------------------------------------------------------
  function renderTasksView(container) {
    // 1. Filter Tasks
    let filteredTasks = AppState.tasks.filter(task => {
      // Status filter
      if (AppState.taskFilter.status === 'pending' && task.completed) return false;
      if (AppState.taskFilter.status === 'completed' && !task.completed) return false;

      // Priority filter
      if (AppState.taskFilter.priority !== 'all' && task.priority !== AppState.taskFilter.priority) {
        return false;
      }

      // Search query filter
      const query = AppState.taskFilter.searchQuery.toLowerCase();
      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCourse = task.course.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCourse && !matchesCategory) return false;
      }

      return true;
    });

    // 2. Sort Tasks
    filteredTasks.sort((a, b) => {
      if (AppState.taskFilter.sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (AppState.taskFilter.sortBy === 'priority') {
        const priorityRank = { high: 1, medium: 2, low: 3 };
        return (priorityRank[a.priority] || 4) - (priorityRank[b.priority] || 4);
      } else if (AppState.taskFilter.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    const pendingCount = AppState.tasks.filter(t => !t.completed).length;
    const completedCount = AppState.tasks.filter(t => t.completed).length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Task & Assignment Tracker
          </h1>
          <p>Organize academic deliverables, mark completed assignments, and maintain daily study goals.</p>
        </div>
        <button type="button" class="btn btn-primary" id="openCreateTaskBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Task
        </button>
      </div>

      <!-- Tasks Controls & Filter Bar -->
      <div class="tasks-toolbar">
        <div class="tasks-filter-group">
          <!-- Status Tabs -->
          <div class="tasks-tabs" role="tablist" aria-label="Task Status Filter">
            <button 
              type="button" 
              class="task-tab-btn ${AppState.taskFilter.status === 'all' ? 'active' : ''}" 
              data-status="all"
            >
              All (${AppState.tasks.length})
            </button>
            <button 
              type="button" 
              class="task-tab-btn ${AppState.taskFilter.status === 'pending' ? 'active' : ''}" 
              data-status="pending"
            >
              Pending (${pendingCount})
            </button>
            <button 
              type="button" 
              class="task-tab-btn ${AppState.taskFilter.status === 'completed' ? 'active' : ''}" 
              data-status="completed"
            >
              Completed (${completedCount})
            </button>
          </div>

          <!-- Priority Filter -->
          <select id="priorityFilterSelect" class="task-select-filter" aria-label="Filter tasks by priority">
            <option value="all" ${AppState.taskFilter.priority === 'all' ? 'selected' : ''}>All Priorities</option>
            <option value="high" ${AppState.taskFilter.priority === 'high' ? 'selected' : ''}>High Priority</option>
            <option value="medium" ${AppState.taskFilter.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
            <option value="low" ${AppState.taskFilter.priority === 'low' ? 'selected' : ''}>Low Priority</option>
          </select>
        </div>

        <!-- Sorting Selector -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="taskSortSelect" style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 500;">Sort By:</label>
          <select id="taskSortSelect" class="task-select-filter" aria-label="Sort tasks">
            <option value="dueDate" ${AppState.taskFilter.sortBy === 'dueDate' ? 'selected' : ''}>Due Date (Earliest)</option>
            <option value="priority" ${AppState.taskFilter.sortBy === 'priority' ? 'selected' : ''}>Priority Level</option>
            <option value="title" ${AppState.taskFilter.sortBy === 'title' ? 'selected' : ''}>Task Title (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Task Items List -->
      <div class="task-list-container" id="tasksList">
        ${filteredTasks.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h3>No tasks found</h3>
            <p>No tasks match your current criteria. Create a new task or adjust your active filters.</p>
            <button type="button" class="btn btn-primary btn-sm" id="emptyStateAddTaskBtn">Create Task Now</button>
          </div>
        ` : filteredTasks.map(task => {
          const dateInfo = formatDateFriendly(task.dueDate);
          return `
            <article class="task-card-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
              <div class="task-left-section">
                <label class="custom-checkbox" aria-label="Mark task ${escapeHTML(task.title)} as ${task.completed ? 'pending' : 'completed'}">
                  <input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                  <span class="checkmark"></span>
                </label>
                <div class="task-details">
                  <span class="task-title-text">${escapeHTML(task.title)}</span>
                  <div class="task-meta-pills">
                    <span class="badge badge-blue">${escapeHTML(task.course)}</span>
                    <span class="badge badge-neutral">${escapeHTML(task.category)}</span>
                    <span class="badge ${dateInfo.status === 'overdue' ? 'badge-danger' : 'badge-neutral'}">
                      📅 ${dateInfo.text}
                    </span>
                    <span class="badge ${task.priority === 'high' ? 'badge-danger' : (task.priority === 'medium' ? 'badge-warning' : 'badge-success')}">
                      ${task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div class="task-right-actions">
                <button 
                  type="button" 
                  class="task-delete-btn" 
                  data-action="delete" 
                  data-task-id="${task.id}" 
                  aria-label="Delete task ${escapeHTML(task.title)}"
                  title="Delete Task"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;

    // Hook up Add Task button
    const addTaskBtn = container.querySelector('#openCreateTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => openTaskModal());
    }

    const emptyAddBtn = container.querySelector('#emptyStateAddTaskBtn');
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener('click', () => openTaskModal());
    }

    // Hook up Status Tabs
    container.querySelectorAll('.task-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.taskFilter.status = btn.getAttribute('data-status');
        renderTasksView(container);
      });
    });

    // Hook up Priority Select
    const prioritySelect = container.querySelector('#priorityFilterSelect');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        AppState.taskFilter.priority = e.target.value;
        renderTasksView(container);
      });
    }

    // Hook up Sort Select
    const sortSelect = container.querySelector('#taskSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        AppState.taskFilter.sortBy = e.target.value;
        renderTasksView(container);
      });
    }

    // Event delegation for checkbox status and delete actions
    const taskListEl = container.querySelector('#tasksList');
    if (taskListEl) {
      taskListEl.addEventListener('click', (e) => {
        // Delete button clicked
        const deleteBtn = e.target.closest('button[data-action="delete"]');
        if (deleteBtn) {
          const taskId = deleteBtn.getAttribute('data-task-id');
          const task = AppState.tasks.find(t => t.id === taskId);
          if (task) {
            openConfirmModal({
              title: 'Delete Task',
              message: `Are you sure you want to delete the task "${task.title}"? This cannot be undone.`,
              confirmLabel: 'Delete Task',
              onConfirm: () => {
                deleteTask(taskId);
                renderTasksView(container);
              }
            });
          }
        }
      });

      taskListEl.addEventListener('change', (e) => {
        // Checkbox status changed
        if (e.target.matches('input[type="checkbox"][data-task-id]')) {
          const taskId = e.target.getAttribute('data-task-id');
          toggleTaskStatus(taskId);
          renderTasksView(container);
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 11. VIEW 4: STUDENT PROFILE COMPONENT
  // --------------------------------------------------------------------------
  function renderProfileView(container) {
    const fullName = `${AppState.profile.firstName} ${AppState.profile.lastName}`.trim();
    const initials = `${AppState.profile.firstName.charAt(0)}${AppState.profile.lastName.charAt(0)}`.toUpperCase() || 'AM';

    const completedTasksCount = AppState.tasks.filter(t => t.completed).length;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Student Account & Profile
          </h1>
          <p>Manage your academic registration information, degree program preferences, and simulation data.</p>
        </div>
      </div>

      <div class="profile-grid-layout">
        <!-- Left: Profile Summary Card -->
        <div>
          <article class="card profile-card-summary">
            <div class="profile-avatar-large" id="profileCardAvatar">${initials}</div>
            <h2 class="profile-summary-name" id="profileCardName">${escapeHTML(fullName)}</h2>
            <span class="profile-summary-id">${escapeHTML(AppState.profile.studentId)}</span>
            <p class="profile-summary-bio">${escapeHTML(AppState.profile.bio)}</p>

            <div class="profile-stats-row">
              <div class="profile-stat-item">
                <span class="profile-stat-num">${AppState.courses.length}</span>
                <span class="profile-stat-lbl">Courses</span>
              </div>
              <div class="profile-stat-item">
                <span class="profile-stat-num">${completedTasksCount}</span>
                <span class="profile-stat-lbl">Tasks Done</span>
              </div>
              <div class="profile-stat-item">
                <span class="profile-stat-num">${escapeHTML(AppState.profile.gpa)}</span>
                <span class="profile-stat-lbl">GPA</span>
              </div>
            </div>

            <button type="button" class="btn btn-secondary btn-sm" id="resetDemoDataBtn" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              Reset to Factory Seed Data
            </button>
          </article>

          <!-- Security Architecture Callout -->
          <div class="security-notice-card" role="note" aria-label="Storage architecture note">
            <div class="security-notice-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div class="security-notice-text">
              <h4>Client Storage Security Notice</h4>
              <p>
                This Single Page Application uses browser <strong>LocalStorage</strong> to preserve your tasks and profile state.
                LocalStorage is an unencrypted, synchronous client-side API intended for interface state and offline prototypes.
                Never store authentication tokens, passwords, or sensitive confidential information in LocalStorage in production.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Profile Editing Form -->
        <div class="card">
          <div class="card-header-flex">
            <h3>Edit Student Information</h3>
            <span class="badge badge-success">Active Registration</span>
          </div>

          <form id="profileForm" novalidate>
            <div class="form-row">
              <div class="form-group col-half">
                <label for="profFirstName" class="form-label">First Name <span class="required-star">*</span></label>
                <input 
                  type="text" 
                  id="profFirstName" 
                  name="firstName" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.firstName)}" 
                  required
                >
                <span class="form-error" id="profFirstNameError"></span>
              </div>

              <div class="form-group col-half">
                <label for="profLastName" class="form-label">Last Name <span class="required-star">*</span></label>
                <input 
                  type="text" 
                  id="profLastName" 
                  name="lastName" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.lastName)}" 
                  required
                >
                <span class="form-error" id="profLastNameError"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label for="profEmail" class="form-label">University Email <span class="required-star">*</span></label>
                <input 
                  type="email" 
                  id="profEmail" 
                  name="email" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.email)}" 
                  required
                >
                <span class="form-error" id="profEmailError"></span>
              </div>

              <div class="form-group col-half">
                <label for="profStudentId" class="form-label">Student ID</label>
                <input 
                  type="text" 
                  id="profStudentId" 
                  name="studentId" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.studentId)}" 
                  readonly 
                  style="background: var(--bg-subtle); cursor: not-allowed;"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label for="profMajor" class="form-label">Major & Degree Program <span class="required-star">*</span></label>
                <input 
                  type="text" 
                  id="profMajor" 
                  name="major" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.major)}" 
                  required
                >
                <span class="form-error" id="profMajorError"></span>
              </div>

              <div class="form-group col-half">
                <label for="profSemester" class="form-label">Current Academic Term <span class="required-star">*</span></label>
                <input 
                  type="text" 
                  id="profSemester" 
                  name="semester" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.semester)}" 
                  required
                >
                <span class="form-error" id="profSemesterError"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-half">
                <label for="profGPA" class="form-label">Cumulative GPA</label>
                <input 
                  type="text" 
                  id="profGPA" 
                  name="gpa" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.gpa)}" 
                  required
                >
                <span class="form-error" id="profGPAError"></span>
              </div>

              <div class="form-group col-half">
                <label for="profStanding" class="form-label">Academic Honors</label>
                <input 
                  type="text" 
                  id="profStanding" 
                  name="academicStanding" 
                  class="form-control" 
                  value="${escapeHTML(AppState.profile.academicStanding)}"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="profBio" class="form-label">Academic Biography & Research Focus</label>
              <textarea id="profBio" name="bio" class="form-control" rows="3">${escapeHTML(AppState.profile.bio)}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary" id="saveProfileBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Hook up Profile Form submission
    const profileForm = container.querySelector('#profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleProfileSave(profileForm, container);
      });
    }

    // Hook up Reset Demo Data button
    const resetBtn = container.querySelector('#resetDemoDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        openConfirmModal({
          title: 'Reset Application Data',
          message: 'Are you sure you want to reset all tasks, course progress, and profile details back to the default factory state? Any custom tasks will be erased.',
          confirmLabel: 'Reset Everything',
          onConfirm: () => {
            resetAllToDefaults();
            showToast('All application data reset to initial defaults.', 'info');
            renderProfileView(container);
          }
        });
      });
    }
  }

  function handleProfileSave(form, container) {
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const major = form.major.value.trim();
    const semester = form.semester.value.trim();
    const gpa = form.gpa.value.trim();
    const standing = form.academicStanding.value.trim();
    const bio = form.bio.value.trim();

    // Validation
    let isValid = true;

    // First Name
    const firstNameError = document.getElementById('profFirstNameError');
    if (!firstName) {
      firstNameError.textContent = 'First name is required.';
      isValid = false;
    } else {
      firstNameError.textContent = '';
    }

    // Last Name
    const lastNameError = document.getElementById('profLastNameError');
    if (!lastName) {
      lastNameError.textContent = 'Last name is required.';
      isValid = false;
    } else {
      lastNameError.textContent = '';
    }

    // Email
    const emailError = document.getElementById('profEmailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = 'Email address is required.';
      isValid = false;
    } else if (!emailPattern.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    } else {
      emailError.textContent = '';
    }

    // Major
    const majorError = document.getElementById('profMajorError');
    if (!major) {
      majorError.textContent = 'Major is required.';
      isValid = false;
    } else {
      majorError.textContent = '';
    }

    // Semester
    const semesterError = document.getElementById('profSemesterError');
    if (!semester) {
      semesterError.textContent = 'Academic term is required.';
      isValid = false;
    } else {
      semesterError.textContent = '';
    }

    if (!isValid) return;

    // Update state
    AppState.profile = {
      ...AppState.profile,
      firstName,
      lastName,
      email,
      major,
      semester,
      gpa,
      academicStanding: standing,
      bio
    };

    // Save to LocalStorage
    StorageService.save(STORAGE_KEYS.PROFILE, AppState.profile);

    // Update global UI (topbar/sidebar)
    updateGlobalUI();

    // Show toast
    showToast('Student profile updated successfully!', 'success');

    // Re-render to refresh left card
    renderProfileView(container);
  }

  // --------------------------------------------------------------------------
  // 12. VIEW 5: 404 UNKNOWN ROUTE COMPONENT
  // --------------------------------------------------------------------------
  function renderNotFoundView(container, invalidRoute) {
    container.innerHTML = `
      <section class="not-found-container" aria-label="Route Not Found Error">
        <div class="not-found-code">404</div>
        <h2 class="not-found-title">Route Not Found</h2>
        <p class="not-found-desc">
          The requested client-side view <span class="not-found-chip">#/${escapeHTML(invalidRoute)}</span> 
          does not exist in this Single Page Application simulation.
        </p>
        <a href="#dashboard" class="btn btn-primary" id="returnDashboardBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Return to Dashboard
        </a>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // 13. TASK CRUD LOGIC & PERSISTENCE
  // --------------------------------------------------------------------------
  function addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title,
      course: taskData.course,
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'Assignment',
      completed: false,
      createdAt: new Date().toISOString()
    };

    AppState.tasks.unshift(newTask);
    StorageService.save(STORAGE_KEYS.TASKS, AppState.tasks);
    updateGlobalUI();
    showToast(`Task "${newTask.title}" created successfully!`, 'success');
  }

  function toggleTaskStatus(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    StorageService.save(STORAGE_KEYS.TASKS, AppState.tasks);
    updateGlobalUI();

    const statusMessage = task.completed ? 'completed' : 'marked pending';
    showToast(`Task "${task.title}" ${statusMessage}.`, 'info', 2000);
  }

  function deleteTask(taskId) {
    const index = AppState.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;

    const [deleted] = AppState.tasks.splice(index, 1);
    StorageService.save(STORAGE_KEYS.TASKS, AppState.tasks);
    updateGlobalUI();
    showToast(`Task "${deleted.title}" deleted.`, 'error');
  }

  // --------------------------------------------------------------------------
  // 14. COURSE MODULE LOGIC & PERSISTENCE
  // --------------------------------------------------------------------------
  function toggleCourseModule(courseId, moduleId) {
    const course = AppState.courses.find(c => c.id === courseId);
    if (!course) return;

    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod) return;

    mod.completed = !mod.completed;
    StorageService.save(STORAGE_KEYS.COURSES, AppState.courses);
    updateGlobalUI();

    // Re-render modal content
    renderCourseModalContent(course);

    // If currently on Courses view or Dashboard view, refresh background
    if (AppState.currentRoute === 'courses' || AppState.currentRoute === 'dashboard') {
      Router.handleRouting();
    }
  }

  // --------------------------------------------------------------------------
  // 15. MODAL CONTROLLERS & ACCESSIBILITY
  // --------------------------------------------------------------------------
  let lastActiveElement = null;

  function openModal(backdropId) {
    lastActiveElement = document.activeElement;
    const modalBackdrop = document.getElementById(backdropId);
    if (!modalBackdrop) return;

    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden', 'false');

    // Focus first input or button in modal
    const focusable = modalBackdrop.querySelector('input, select, textarea, button');
    if (focusable) focusable.focus();

    document.body.style.overflow = 'hidden';
  }

  function closeModal(backdropId) {
    const modalBackdrop = document.getElementById(backdropId);
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to previously active element
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Task Modal handlers
  function openTaskModal() {
    const form = document.getElementById('taskForm');
    if (form) {
      form.reset();
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDateInput = document.getElementById('taskDueDateInput');
      if (dueDateInput) {
        dueDateInput.value = tomorrow.toISOString().split('T')[0];
      }
      // Clear errors
      document.getElementById('taskTitleError').textContent = '';
      document.getElementById('taskCourseError').textContent = '';
      document.getElementById('taskDueDateError').textContent = '';
    }
    openModal('taskModalBackdrop');
  }

  function closeTaskModal() {
    closeModal('taskModalBackdrop');
  }

  // Course Syllabus Modal handlers
  function openCourseModal(course) {
    AppState.selectedCourseForModal = course;
    const titleEl = document.getElementById('courseModalTitle');
    const codeEl = document.getElementById('courseModalCode');
    if (titleEl) titleEl.textContent = course.title;
    if (codeEl) codeEl.textContent = course.code;

    renderCourseModalContent(course);
    openModal('courseModalBackdrop');
  }

  function renderCourseModalContent(course) {
    const contentEl = document.getElementById('courseModalContent');
    if (!contentEl) return;

    const progress = calculateCourseProgress(course);
    const completedCount = course.modules.filter(m => m.completed).length;

    contentEl.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight:600;">
          <span>Syllabus Progress</span>
          <span>${completedCount}/${course.modules.length} Modules (${progress}%)</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${progress}%;"></div>
        </div>
      </div>

      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
        Check off modules as you complete reading assignments and lectures:
      </p>

      <ul class="syllabus-module-list">
        ${course.modules.map(mod => `
          <li class="syllabus-module-item">
            <label class="custom-checkbox" style="margin-right: 0.75rem;">
              <input 
                type="checkbox" 
                data-course-id="${course.id}" 
                data-module-id="${mod.id}" 
                ${mod.completed ? 'checked' : ''}
              >
              <span class="checkmark"></span>
            </label>
            <span style="flex:1; font-size:0.9rem; font-weight:500; ${mod.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
              ${escapeHTML(mod.title)}
            </span>
            <span class="badge ${mod.completed ? 'badge-success' : 'badge-neutral'}">
              ${mod.completed ? 'Completed' : 'In Progress'}
            </span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  function closeCourseModal() {
    closeModal('courseModalBackdrop');
  }

  // Confirmation Modal
  function openConfirmModal(config) {
    AppState.pendingConfirmAction = config.onConfirm;
    const titleEl = document.getElementById('confirmModalTitle');
    const descEl = document.getElementById('confirmModalDesc');
    const actionBtn = document.getElementById('confirmActionBtn');

    if (titleEl) titleEl.textContent = config.title || 'Confirm Action';
    if (descEl) descEl.textContent = config.message || 'Are you sure you want to proceed?';
    if (actionBtn) actionBtn.textContent = config.confirmLabel || 'Confirm';

    openModal('confirmModalBackdrop');
  }

  function closeConfirmModal() {
    AppState.pendingConfirmAction = null;
    closeModal('confirmModalBackdrop');
  }

  // --------------------------------------------------------------------------
  // 16. DATA RESET TO FACTORY SEED
  // --------------------------------------------------------------------------
  function resetAllToDefaults() {
    StorageService.clearAll();
    AppState.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    AppState.courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
    AppState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));

    StorageService.save(STORAGE_KEYS.PROFILE, AppState.profile);
    StorageService.save(STORAGE_KEYS.COURSES, AppState.courses);
    StorageService.save(STORAGE_KEYS.TASKS, AppState.tasks);

    updateGlobalUI();
  }

  // --------------------------------------------------------------------------
  // 17. MOBILE SIDEBAR & OVERLAY HANDLERS
  // --------------------------------------------------------------------------
  function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !overlay) return;

    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) {
      closeMobileSidebar();
    } else {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('show');
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('show');
  }

  // --------------------------------------------------------------------------
  // 18. THEME TOGGLE (DARK / LIGHT)
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = StorageService.load(STORAGE_KEYS.THEME, null);
    if (savedTheme) {
      AppState.theme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      AppState.theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(AppState.theme);
  }

  function applyTheme(theme) {
    AppState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    StorageService.save(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info', 1800);
  }

  // --------------------------------------------------------------------------
  // 19. GLOBAL SEARCH INTEGRATION
  // --------------------------------------------------------------------------
  function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.trim();
      
      if (AppState.currentRoute === 'tasks') {
        AppState.taskFilter.searchQuery = term;
        const appView = document.getElementById('app-view');
        renderTasksView(appView);
      } else if (AppState.currentRoute === 'courses') {
        AppState.courseFilter.searchQuery = term;
        const appView = document.getElementById('app-view');
        renderCoursesView(appView);
      } else {
        // If searching from dashboard, route to tasks with this query
        if (term.length > 2) {
          AppState.taskFilter.searchQuery = term;
          Router.navigate('tasks');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 20. INITIALIZATION & GLOBAL EVENT ATTACHMENTS
  // --------------------------------------------------------------------------
  function initApp() {
    // 1. Initialize State from LocalStorage or Defaults
    AppState.profile = StorageService.load(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    AppState.courses = StorageService.load(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
    AppState.tasks = StorageService.load(STORAGE_KEYS.TASKS, DEFAULT_TASKS);

    // 2. Initialize Theme
    initTheme();

    // 3. Update Dynamic Badges and Profile info
    updateGlobalUI();

    // 4. Initialize Router
    Router.init();

    // 5. Initialize Search
    initGlobalSearch();

    // 6. Hook up Static Global UI Event Listeners
    setupGlobalEventListeners();

    console.info('EduPulse Student Dashboard SPA initialized successfully.');
  }

  function setupGlobalEventListeners() {
    // Theme toggle button
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Mobile menu toggle & close
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', toggleMobileSidebar);
    }

    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    }

    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Notification dropdown toggle
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.classList.contains('show');
        notifDropdown.classList.toggle('show');
        notifBtn.setAttribute('aria-expanded', !isOpen);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
          notifDropdown.classList.remove('show');
          notifBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Task Modal listeners
    const taskModalCloseBtn = document.getElementById('taskModalCloseBtn');
    const taskModalCancelBtn = document.getElementById('taskModalCancelBtn');
    if (taskModalCloseBtn) taskModalCloseBtn.addEventListener('click', closeTaskModal);
    if (taskModalCancelBtn) taskModalCancelBtn.addEventListener('click', closeTaskModal);

    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titleInput = document.getElementById('taskTitleInput');
        const courseSelect = document.getElementById('taskCourseSelect');
        const dueDateInput = document.getElementById('taskDueDateInput');
        const prioritySelect = document.getElementById('taskPrioritySelect');
        const categorySelect = document.getElementById('taskCategorySelect');

        const title = titleInput.value.trim();
        const course = courseSelect.value;
        const dueDate = dueDateInput.value;

        let isValid = true;
        if (!title) {
          document.getElementById('taskTitleError').textContent = 'Please enter a task title.';
          titleInput.classList.add('input-error');
          isValid = false;
        } else {
          document.getElementById('taskTitleError').textContent = '';
          titleInput.classList.remove('input-error');
        }

        if (!course) {
          document.getElementById('taskCourseError').textContent = 'Please select a course.';
          courseSelect.classList.add('input-error');
          isValid = false;
        } else {
          document.getElementById('taskCourseError').textContent = '';
          courseSelect.classList.remove('input-error');
        }

        if (!dueDate) {
          document.getElementById('taskDueDateError').textContent = 'Please choose a due date.';
          dueDateInput.classList.add('input-error');
          isValid = false;
        } else {
          document.getElementById('taskDueDateError').textContent = '';
          dueDateInput.classList.remove('input-error');
        }

        if (!isValid) return;

        addTask({
          title,
          course,
          dueDate,
          priority: prioritySelect.value,
          category: categorySelect.value
        });

        closeTaskModal();

        // Refresh active view
        if (AppState.currentRoute === 'tasks' || AppState.currentRoute === 'dashboard') {
          Router.handleRouting();
        }
      });
    }

    // Course Syllabus Modal listeners
    const courseModalCloseBtn = document.getElementById('courseModalCloseBtn');
    const courseModalDoneBtn = document.getElementById('courseModalDoneBtn');
    if (courseModalCloseBtn) courseModalCloseBtn.addEventListener('click', closeCourseModal);
    if (courseModalDoneBtn) courseModalDoneBtn.addEventListener('click', closeCourseModal);

    // Course Module check toggle (inside syllabus modal)
    const courseModalContent = document.getElementById('courseModalContent');
    if (courseModalContent) {
      courseModalContent.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"][data-course-id]')) {
          const courseId = e.target.getAttribute('data-course-id');
          const moduleId = parseInt(e.target.getAttribute('data-module-id'), 10);
          toggleCourseModule(courseId, moduleId);
        }
      });
    }

    // Confirmation Modal listeners
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeConfirmModal);
    if (confirmActionBtn) {
      confirmActionBtn.addEventListener('click', () => {
        if (typeof AppState.pendingConfirmAction === 'function') {
          AppState.pendingConfirmAction();
        }
        closeConfirmModal();
      });
    }

    // Close modals on Backdrop click
    ['taskModalBackdrop', 'courseModalBackdrop', 'confirmModalBackdrop'].forEach(id => {
      const backdrop = document.getElementById(id);
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            closeModal(id);
          }
        });
      }
    });

    // Handle hash links to ensure clicks on currently active route re-render seamlessly
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const targetRoute = link.getAttribute('href').replace(/^#\/?/, '').trim();
        if (targetRoute && targetRoute === AppState.currentRoute) {
          Router.handleRouting();
        }
      }
    });

    // Global Keyboard Accessibility: Close active modal or dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTaskModal();
        closeCourseModal();
        closeConfirmModal();
        closeMobileSidebar();
        const notifDropdown = document.getElementById('notifDropdown');
        if (notifDropdown) notifDropdown.classList.remove('show');
      }
    });
  }

  // Kickstart Application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
