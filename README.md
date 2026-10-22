# Axionix Team Task Tracker 🚀

A production-quality, responsive **Team Task Tracker** web application engineered for the Axionix Frontend Engineering Internship assignment. Designed with a modern "Floating Glass Dashboard" aesthetic featuring an interactive ambient WebGL shader visual layer, accessible semantic UI, simulated asynchronous service layer, and comprehensive behavior-focused testing.

- **Time spent**: ~7 hours (architecture, glassmorphism design system, simulated service layer, Vitest test suites, and WCAG AA accessibility).

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quickstart Setup](#quickstart-setup)
3. [Demo Reviewer Credentials](#demo-reviewer-credentials)
4. [Available Scripts](#available-scripts)
5. [Architecture & Design System](#architecture--design-system)
6. [Why TanStack Query + React Context](#why-tanstack-query--react-context)
7. [Simulated Service Layer & Error Injection](#simulated-service-layer--error-injection)
8. [URL-Driven Filters & Navigation](#url-driven-filters--navigation)
9. [Modern Visual Layer & Glassmorphism Design System](#modern-visual-layer--glassmorphism-design-system)
10. [Accessibility (a11y) & Responsiveness](#accessibility-a11y--responsiveness)
11. [Testing Suite](#testing-suite)
12. [Credits & Inspirations](#credits--inspirations)
13. [Assumptions & Known Limitations](#assumptions--known-limitations)

---

## 🛠 Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended, tested on Node v24)
- **npm**: v9.0.0 or higher
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox with standard ES2020+ support

---

## ⚡ Quickstart Setup

To clone and run the application locally:

```bash
# 1. Clone repository (or navigate to workspace)
git clone <repository-url>
cd INTERNSHIP

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
cp .env.example .env    # Optional: sensible defaults (500ms delay, 0 failure rate) apply automatically

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Reviewer Credentials

The app includes pre-seeded demo credentials displayed in a quick-hint box on the login screen, with a 1-click **"Auto-fill"** button:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Tech Lead** | `demo@axionix.dev` | `Demo@1234` |

> **Session Persistence**: Sessions persist across browser page refreshes. The app displays an initial loading state during session restoration to eliminate layout flash.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR) at `localhost:5173` |
| `npm test` | Runs the full Vitest suite in run mode (21 behaviour-focused tests across 8 test suites) |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run lint` | Lints TypeScript and TSX files with ESLint + `eslint-plugin-jsx-a11y` |
| `npm run lint:fix` | Automatically fixes mechanical ESLint issues |
| `npm run build` | Typechecks with `tsc` and bundles for production in `dist/` |
| `npm run preview` | Locally serves the production build |

---

## 🏛 Architecture & Design System

### 1. Separation of Concerns (Data Flow)
Components **never** touch `localStorage` directly. Every operation strictly adheres to this unidirection flow:
```
Component ➔ Hook ➔ Service ➔ Storage / Network Simulator
```

### 2. Folder Structure
```
src/
├── components/
│   ├── layout/         # AppShell, Footer, ErrorBoundaryFallback, GlobalIridescenceBackground
│   ├── three/          # HeroScene (2D glass illustration), ReducedMotionFallback
│   └── ui/             # Button, Input, Select, Modal, Badge, Spinner, EmptyState, ErrorMessage, StatCard, ProgressBar, GlassCard, Iridescence, DitherVeil, CommandPalette, KeyboardShortcutsModal
├── data/
│   └── seed.ts         # 5 users, 4 projects, 20 tasks, dynamic date anchors
├── features/
│   ├── auth/           # AuthContext, LoginForm, LoginPage, ProtectedRoute
│   ├── dashboard/      # DashboardPage (metrics, overdue/due soon, hero strip)
│   ├── notfound/       # NotFoundPage (404)
│   ├── projects/       # ProjectsPage, ProjectModal
│   └── tasks/          # ProjectDetailsPage, TaskTable, KanbanBoard, TaskModal, DeleteTaskModal
├── hooks/              # useTasks, useProjects, useUsers, useDebounce, useAuth, usePrefersReducedMotion
├── services/           # api.ts (delay + failure engine), authService, projectService, taskService, userService
├── test/               # setup.ts, testUtils.tsx (renderWithProviders & visual mocks)
├── types/              # models.ts (User, Project, Task, TaskStats, TaskFilters)
└── utils/              # filterAndSortTasks, taskStats, dates
```


---

## 🧠 Why TanStack Query + React Context

- **React Context (`AuthContext`)**: Used exclusively for synchronous client session identity (logged-in user, restoring session status, logout handler). React Context is ideal for low-frequency, application-wide client session state.
- **TanStack Query (`@tanstack/react-query`)**: Powers **all** server and data state (projects, tasks, users). It provides:
  - Automatic background caching and deduplication.
  - Built-in loading, error, and refetching states (`isFetching`, `isError`, `refetch()`).
  - Cache invalidation on mutations (`createTask`, `updateTask`, `deleteTask`) to keep UI in sync without duplicating server data into local state.

---

## 🧪 Simulated Service Layer & Error Injection

All asynchronous operations flow through [api.ts](src/services/api.ts) via `simulateNetwork()`:
- **Configurable Network Delay**: Controlled by `VITE_API_DELAY_MS` in `.env` (default: `500ms`).
- **Configurable Failure Rate**: Controlled by `VITE_API_FAILURE_RATE` in `.env` (default: `0`).
- **Live "Simulate error" Toggle**: A visible checkbox toggle in the application footer allows reviewers to immediately force API failures on camera to verify error states and retry buttons.
- **"Reset Demo Data" Trigger**: A footer button allowing reviewers to instantly restore the 20 initial seed tasks and 4 projects.

---

## 🔗 URL-Driven Filters & Navigation

All filter, search, and sort states on the Project Details page (`/projects/:id`) and Projects search (`/projects`) are stored directly in URL query parameters using `useSearchParams`:
- `?search=wcag`
- `?status=IN_PROGRESS`
- `?priority=HIGH`
- `?assigneeId=user-2`
- `?sortBy=dueDate&sortOrder=asc`

### Advantages:
1. **Shareable URLs**: Filters remain intact when sharing links or bookmarking.
2. **Browser History**: Full browser back/forward navigation operates smoothly without breaking user state.
3. **Pure Function Filtering**: All task filtering and sorting executes through one pure function: `filterAndSortTasks()`.

---

## 🎨 Modern Visual Layer & Glassmorphism Design System

- **Interactive Ambient Background (`<Iridescence />`)**: Integrated the open-source `<Iridescence />` WebGL shader component from **React Bits** (powered by `ogl`) as a dynamic ambient backdrop with pointer reactivity, liquid stir, sheen, and click swirl effects.
- **Behavior with `prefers-reduced-motion`**: When the user's OS preference has reduced motion enabled (`prefers-reduced-motion: reduce`), the shader loop automatically freezes animation progression, pointer tracking, and swirl dynamics to prevent motion sickness and respect accessibility guidelines.
- **Behavior without WebGL**: If WebGL/WebGL2 is unavailable, unsupported by the GPU, or disabled in the browser (or in headless test environments like Vitest/JSDOM), `<Iridescence />` safely catches the absence of a WebGL context and aborts initialization gracefully without throwing errors. The application smoothly falls back to CSS-only background gradients (`.glass-mesh-bg`) ensuring 100% functionality, readability, and contrast for all interactive controls.
- **Glassmorphism Visual Accents**: Uses high-contrast 2D CSS visual cards (`<GlassCard />`) with frosted glass backgrounds (`backdrop-blur`), subtle borders, soft shadows, and team status metrics.
- **Pure Semantic UI**: All forms, tables, modals, cards, and navigation are 100% semantic and accessible HTML controls layered on top of the ambient canvas.

---

## ♿ Accessibility (a11y) & Responsiveness

- **Semantic HTML**: `<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, `<table>`, `<caption className="sr-only">`.
- **Keyboard Navigation**: Dedicated `"Skip to main content"` link, visible `:focus-visible` rings on all interactive elements.
- **Dialogs & Focus Trapping**: Modals trap focus, dismiss on `Escape`, and return focus to the trigger button.
- **Mobile Drawer**: Sidebar collapses into a hamburger-triggered slide-over drawer below `md` breakpoint (`768px`).
- **No Horizontal Body Scroll**: Responsive testing verified at `375px`, `768px`, and `1280px`. Tables scroll horizontally inside their own container.
- **Color Independence**: Badges and status indicators pair text labels and icons (`CheckCircle2`, `Clock`, `ArrowUp`, etc.), never color alone.

---

## 🧪 Testing Suite

Execute the test suite with the exact test command:
```bash
npm test
```

The test suite runs **21 automated tests across 8 test suites** using Vitest and React Testing Library, achieving a 100% pass rate:

1. **`LoginForm.test.tsx` (3 tests)**:
   - Validates email and password required field validation errors.
   - Rejects invalid email formats with informative error messaging.
   - Successfully signs in with valid credentials and redirects to dashboard.
2. **`filterAndSortTasks.test.ts` (7 tests)**:
   - Pure function unit tests verifying filtering by search query (title and description).
   - Verifies status filtering (`TODO`, `IN_PROGRESS`, `DONE`).
   - Verifies priority filtering (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
   - Verifies assignee filtering and sorting by dueDate, priority, and title (ascending and descending).
3. **`TaskFlow.test.tsx` (2 tests)**:
   - Creates a new task through the modal and verifies it appears in the table.
   - Closes modal on `Escape` key press and restores focus to trigger button.
4. **`Dashboard.test.tsx` (2 tests)**:
   - Renders loading skeletons and transitions to live metric values.
   - Displays project and task quick-action navigation and hero strip.
5. **`ProjectsPage.test.tsx` (2 tests)**:
   - Filters the projects grid by search keyword.
   - Displays empty state with "Clear search" button when no results match.
6. **`taskStats.test.ts` (2 tests)**:
   - Accurately computes total, completed, in-progress, overdue, and due soon counts.
   - Handles empty task lists without errors.
7. **`Iridescence.test.tsx` (1 test)**:
   - Renders ambient shader component container safely in headless JSDOM without WebGL context.
8. **`PowerFeatures.test.tsx` (2 tests)**:
   - Renders all three Kanban board columns, group status counts, and 1-click status advances.
   - Verifies multi-select checkbox workflows and floating batch action bar.


---

## 🏆 Credits & Inspirations

- **Vite & React**: Fast frontend foundation.
- **Tailwind CSS**: Utility-first CSS framework.
- **Headless UI**: Unstyled, accessible UI primitives (Dialog, Menu).
- **Lucide Icons**: Consistent, semantic icon set.
- **React Bits (`Iridescence`)**: Ambient fluid WebGL shader background component.
- **ogl**: Minimal, performant WebGL library powering the Iridescence shader.
- **motion**: Modern animation library for smooth UI transitions and dialog reveals.
- **date-fns**: Modular date math and formatting.
- **Unsplash**: Royalty-free placeholder portrait avatars for seed team members in `src/data/seed.ts`.
- **Design Inspiration**: Linear and Vercel minimalist SaaS aesthetic with frosted glassmorphism overlays.

---

## 📌 Assumptions & Known Limitations

1. **Mock Backend & Local Storage**: Operates entirely over simulated asynchronous `localStorage` with configurable network latency and error rates. The footer includes a "Reset Demo Data" button to restore initial state at any time.
2. **No Remote Deployment**: This repository is designed and configured for local reviewer evaluation and grading via `npm run dev` and `npm test`; no remote cloud hosting (e.g. Vercel/Netlify) is currently deployed.
3. **No Optimistic Updates**: Task and project mutations await simulated network resolution before invalidating queries and refreshing the UI. This intentional choice guarantees that reviewers observe authentic loading skeletons, spinner feedback, and error recovery states.
4. **No Theme Switcher (Dark Mode Only)**: The application features an intentional dark-mode glassmorphism visual system; a light-mode toggle is not implemented.
5. **No Drag-and-Drop Reordering**: Task status changes utilize an accessible, keyboard-navigable Headless UI Menu ("Move to..."), ensuring full WCAG compliance without complex pointer-only drag interactions.
6. **No Real-Time WebSocket Synchronization**: Multi-tab synchronization relies on browser storage events and manual query refetches rather than a dedicated WebSocket server.

