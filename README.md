# EduPulse | Student Dashboard Single Page Application (SPA)

> **Week 5 Task – Developing a Single Page Application (SPA) Simulation**  
> A modern, responsive, and interactive frontend Single Page Application built with vanilla HTML5, CSS3, and ES6+ JavaScript, demonstrating dynamic view rendering, client-side hash routing, and persistent browser storage.

---

## 📌 1. Project Overview & Objective

The **EduPulse Student Dashboard** is a complete, production-grade frontend Single Page Application (SPA) simulation designed for university students. It provides an intuitive, high-performance interface for managing courses, tracking academic deadlines, completing module syllabi, and updating student profiles—all **without requiring page reloads** or external backend frameworks.

### Key Objectives:
- **Client-Side Routing:** Enable smooth view navigation (`#dashboard`, `#courses`, `#tasks`, `#profile`) using hash-based routing compatible with direct file system execution (`file:///`) and production web servers alike.
- **Dynamic Content Rendering:** Efficiently render state-driven user interfaces using modular JavaScript view templates and reactive updates.
- **Data Persistence:** Synchronize application state with browser `localStorage`, ensuring tasks, course progress, and profile modifications persist across browser refreshes.
- **Modern UI & UX:** Deliver an executive **Royal Blue & Deep Violet** design system with responsive layouts (desktop, tablet, mobile), dark/light theme switching, micro-interactions, accessible modal dialogs, and toast notifications.

---

## 🚀 2. Core Features

### 🌟 Dashboard View (`#dashboard`)
- **Personalized Hero Banner:** Contextual greeting tailored to the time of day, active academic semester badge, and quick action shortcuts.
- **Dynamic KPI Metrics Cards:**
  - *Active Courses:* Total enrolled subjects and credit hours.
  - *Pending Tasks:* Real-time count of outstanding deliverables and completion percentage.
  - *Semester Progress:* Dynamically calculated average module completion percentage across all courses.
  - *Cumulative GPA:* Real-time academic standing and honors classification.
- **Urgent Deadlines Preview:** Shows the top upcoming deliverables with quick-toggle completion checkboxes that update stats in real time.
- **Active Course Progress:** Visual progress bars indicating syllabus status for all enrolled subjects.

### 📚 Course Management View (`#courses`)
- **Filterable Course Catalog:** Category filter pills (*All Categories, Core CS, AI & Data, Software Eng, Web Tech*).
- **Course Cards:** Displays course codes, credits, instructors with avatar badges, comprehensive descriptions, and progress bars.
- **Interactive Syllabus & Module Modal:**
  - Click **"Syllabus & Modules"** on any course to open an accessible modal dialog.
  - Check or uncheck individual module checkboxes.
  - The course completion percentage, progress bar, and dashboard metrics update immediately and persist to `localStorage`.

### 📝 Task & Assignment Tracker (`#tasks`)
- **Comprehensive Task Lifecycle (CRUD):**
  - **Create:** Click *"Add New Task"* to open an accessible modal form with strict validation (title, associated course, due date, priority, category).
  - **Read:** Formatted task list with badges for course, category, priority, and friendly relative dates (*"Today"*, *"Tomorrow"*, *"Overdue"*, or formatted date).
  - **Update:** Interactive custom checkbox toggling task status between *Pending* and *Completed* with strike-through animations.
  - **Delete:** Trash button with an accessible confirmation dialog preventing accidental deletions.
- **Real-Time Filtering & Sorting:**
  - Status tabs: *All*, *Pending*, *Completed*.
  - Priority filter: *All Priorities*, *High*, *Medium*, *Low*.
  - Multi-attribute sort: *Due Date (Earliest)*, *Priority Level*, *Title (A-Z)*.
  - Live search filter by task name, course, or category.

### 👤 Student Profile View (`#profile`)
- **Profile Overview Card:** Displays dynamic initials avatar, student ID chip, academic biography, and aggregate metrics.
- **Editable Student Information Form:** Editable fields for First Name, Last Name, University Email, Degree Program, Academic Term, GPA, Academic Honors, and Biography.
- **Real-Time Synchronized UI:** Saving the profile instantly updates the user display in the top navigation bar and sidebar without reloading.
- **Data Reset Facility:** Built-in *"Reset to Factory Seed Data"* button allowing evaluators to safely re-seed initial mock data at any time.
- **Security Notice Card:** Explains client storage architecture and security boundaries.

### 🌓 Dark / Light Theme Switcher
- Toggle between light and dark modes with a single click.
- Detects system preference (`prefers-color-scheme`) by default, and preserves user preference in `localStorage`.

### 🛡️ 404 Unknown Route Handling
- Navigating to an unrecognized hash (e.g., `#unknown-route` or clicking *"Test 404 Route"*) displays a friendly, accessible 404 view with a direct button to return to the Dashboard.

### 🔔 Notification Drawer & Feedback Toasts
- Topbar bell icon toggles an announcement dropdown.
- Non-blocking, accessible toast notifications confirm operations (*"Task created"*, *"Profile updated"*, *"Task deleted"*).

---

## 🛠️ 3. Technologies Used

| Technology | Role in Project |
| :--- | :--- |
| **HTML5** | Semantic markup (`<aside>`, `<header>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<dialog>`, form controls). |
| **CSS3** | Custom properties (CSS variables), Flexbox, CSS Grid, Glassmorphism, keyframe animations, `@media` queries. |
| **Vanilla JavaScript (ES6+)** | IIFE encapsulation, client-side hash router, state management, DOM event delegation, input validation. |
| **HTML5 Web Storage (`localStorage`)** | Client-side serialization and persistence for tasks, courses, profile, and theme. |
| **Inline SVGs** | Scalable, crisp icons with zero external CDN dependencies for 100% offline reliability. |

---

## 📂 4. Project Structure

```text
yuva-spa-simulation-week5/
│
├── index.html        # Main SPA HTML document with shell structure & modals
├── style.css         # Complete responsive styles, theme tokens, and animations
├── script.js         # Central SPA engine: router, state store, views, storage
└── README.md         # Full project documentation, architecture, & testing guide
```

---

## ⚡ 5. Setup & Execution Instructions

This application is completely self-contained. It requires **no build tools**, **no npm packages**, and **no server runtime**.

### Method 1: Direct File Execution (Simplest)
1. Navigate to the project directory:
   ```text
   C:\Users\ELCOT\.gemini\antigravity\scratch\yuva-spa-simulation-week5\
   ```
2. Double-click `index.html` (or right-click → **Open With** → Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
3. The application will initialize immediately with the `#dashboard` route.

### Method 2: Local HTTP Server (Optional)
If you prefer running via a local development server:
- **Using VS Code Live Server:** Right-click `index.html` and select **"Open with Live Server"**.
- **Using Python 3:**
  ```bash
  python -m http.server 8080
  ```
  Open `http://localhost:8080` in your web browser.
- **Using Node.js (`npx serve`):**
  ```bash
  npx serve .
  ```

---

## 🧭 6. SPA Navigation Architecture

### Why Hash-Based Routing (`#`)?
In Single Page Applications, two primary client-side routing paradigms exist:
1. **History API (`pushState` / `popstate`):** Creates pretty URLs (e.g. `/courses`), but **requires server-side URL rewriting**. If a user refreshes the page or opens the file directly via `file:///C:/path/index.html`, the browser issues a 404 error because no physical `courses.html` file exists on disk.
2. **Hash-Based Routing (`window.location.hash`):** Changes the fragment identifier (e.g. `index.html#courses`). Hash fragments are never sent to the server and do not cause browser page reloads. This guarantees that:
   - The application works seamlessly both via `file:///` and web servers.
   - Deep-linking is fully supported (bookmarking `index.html#tasks` opens directly to Tasks).
   - Browser **Back** and **Forward** history buttons work natively via the `hashchange` event.
   - Navigating to an unknown hash dynamically triggers the 404 fallback view.

### Routing Mechanism (`script.js`):
```javascript
const Router = {
  routes: {
    dashboard: renderDashboardView,
    courses: renderCoursesView,
    tasks: renderTasksView,
    profile: renderProfileView
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting(); // Render initial route
  },

  handleRouting() {
    let hash = window.location.hash.replace(/^#\/?/, '').trim() || 'dashboard';
    const renderFunc = this.routes[hash];
    const appView = document.getElementById('app-view');
    
    if (typeof renderFunc === 'function') {
      renderFunc(appView);
    } else {
      renderNotFoundView(appView, hash);
    }
  }
};
```

---

## 🔄 7. DOM Manipulation & Event Handling Strategy

1. **Modular Functional Rendering:** Each view is an isolated render function that accepts the `<main id="app-view">` container. Components build semantic markup templates using clean interpolation and escape user-supplied strings via `escapeHTML()` to prevent XSS vulnerabilities.
2. **Event Delegation:** To avoid memory leaks and ensure dynamically injected elements (like newly added task checkboxes or syllabus module checks) remain interactive, event listeners are attached to persistent parent containers (e.g., `#tasksList`, `#courseModalContent`) using `event.target.closest()`.
3. **Prevention of Unintended Page Reloads:** Every form submission event intercepts the default browser behavior using `event.preventDefault()`, running custom validation and state updates purely within JavaScript.
4. **Keyboard & Screen Reader Accessibility:**
   - Active navigation items receive `aria-current="page"`.
   - Modals trap focus and can be closed using the `Escape` key or backdrop clicks.
   - Live regions (`role="status"` and `aria-live="polite"`) ensure screen readers announce toast notifications.

---

## 💾 8. Client-Side Data Persistence & Security Analysis

### Data Storage Architecture
State is stored under designated namespace keys:
- `edupulse_spa_profile_v1`
- `edupulse_spa_courses_v1`
- `edupulse_spa_tasks_v1`
- `edupulse_spa_theme_v1`

### Resilient Storage Service:
- Every `localStorage` call is wrapped in a `try...catch` block within `StorageService`. If private browsing restrictions or storage quotas trigger an exception, the application falls back safely to in-memory state without crashing.
- Corrupted JSON payloads automatically fall back to the factory seed dataset.

### ⚠️ Security Considerations:
- **Client-Side Only:** `localStorage` is accessible to any script executing on the same origin. It is completely unencrypted.
- **Appropriate Use Cases:** Storing client interface preferences (theme, filters), offline task lists, and simulation mock states.
- **Inappropriate Use Cases:** Storing authentication tokens (JWTs), passwords, payment data, or confidential academic records. Production systems must utilize `HttpOnly`, `Secure` cookies with server-side session validation.

---

## 🧪 9. Testing Procedure Checklist

Follow this checklist to verify full functionality:

| Test Case | Procedure | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Initial Launch** | Open `index.html` in browser | Dashboard view renders with KPI cards, welcome banner, and 5 courses. | ✅ Pass |
| **2. Navigation** | Click *Courses*, *Tasks*, *Profile* in sidebar | Views transition smoothly with animations; active link highlights; no page reload. | ✅ Pass |
| **3. Browser History** | Navigate: Dashboard → Courses → Tasks → Click Back button | Browser returns to Courses view; Forward returns to Tasks. | ✅ Pass |
| **4. 404 Route Handling** | Click *"Test 404 Route"* in sidebar | 404 Not Found view renders; clicking *"Return to Dashboard"* routes to `#dashboard`. | ✅ Pass |
| **5. Task Creation** | Click *"+ Add Task"*, submit empty form | Red validation errors appear; form does not submit. | ✅ Pass |
| **6. Task CRUD** | Enter title, course, date; click *Save Task* | New task appears at top of list; success toast displays; pending counter increments. | ✅ Pass |
| **7. Task Toggle** | Check the checkbox on a task | Task title gets strike-through styling; task moves to completed; pending count decrements. | ✅ Pass |
| **8. Task Deletion** | Click trash icon on task; confirm modal | Task is removed; toast appears; statistics recalculate immediately. | ✅ Pass |
| **9. Course Syllabus** | On Courses view, click *Syllabus & Modules* on CS-301; check Module 5 | Progress bar updates in modal and card; changes reflect on Dashboard progress stat. | ✅ Pass |
| **10. Profile Update** | Edit name in Profile view, click *Save Profile* | Topbar & sidebar user names/avatars update immediately; toast displays. | ✅ Pass |
| **11. Data Persistence** | Refresh the browser (`F5` or `Ctrl+R`) | All created tasks, toggled checkboxes, and profile updates remain intact. | ✅ Pass |
| **12. Dark Mode** | Click the theme toggle button in the topbar | Theme switches between dark and light; preference persists after refresh. | ✅ Pass |
| **13. Mobile Drawer** | Resize window to < 768px; click hamburger menu | Sidebar slides in; clicking overlay or close button dismisses it. | ✅ Pass |
| **14. Reset Data** | On Profile view, click *Reset to Factory Seed Data* | Confirmation modal appears; confirming restores initial demo dataset. | ✅ Pass |

---

## 📤 10. How to Upload to GitHub

Follow these steps to upload this project to your GitHub account:

### Step 1: Initialize Git Repository
Open PowerShell or your terminal in the project directory:
```bash
cd "C:\Users\ELCOT\.gemini\antigravity\scratch\yuva-spa-simulation-week5"
git init
git add .
git commit -m "feat: complete Week 5 Student Dashboard SPA simulation"
```

### Step 2: Create a New Repository on GitHub
1. Go to [github.com](https://github.com) and log in.
2. Click the **"+"** icon in the top right → **New repository**.
3. Name your repository (e.g., `student-dashboard-spa` or `yuva-spa-simulation-week5`).
4. Set visibility to **Public**.
5. Leave "Initialize this repository with a README" **unchecked** (we already have a complete README).
6. Click **Create repository**.

### Step 3: Link and Push
Copy your repository URL from GitHub and run:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY-NAME>.git
git push -u origin main
```

### Step 4: Enable Free GitHub Pages Hosting (Optional)
To showcase a live interactive demo of your project:
1. In your GitHub repository, go to **Settings** → **Pages** (in the left sidebar).
2. Under **Branch**, select `main` and root folder `/ (root)`.
3. Click **Save**.
4. In a few moments, GitHub will provide a live public URL (e.g., `https://<YOUR-USERNAME>.github.io/<YOUR-REPOSITORY-NAME>/`).
5. Open the link to explore your live SPA!

---

## 👨‍💻 Author & Academic Attribution
- **Project:** Week 5 Task – Developing a Single Page Application (SPA) Simulation
- **Candidate:** Frontend Web Development Intern / Student
- **License:** MIT License (Open Source)
