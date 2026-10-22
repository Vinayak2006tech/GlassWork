# Axionix Team Task Tracker 🚀

A production-quality, responsive **Team Task Tracker** web application engineered for the Axionix Frontend Engineering Internship assignment. Designed with a modern "Floating Glass Dashboard" aesthetic featuring an optional decorative 3D visual layer, accessible semantic UI, simulated asynchronous service layer, and comprehensive behavior-focused testing.

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
9. [Decorative 3D Visual Layer & Graceful Degradation](#decorative-3d-visual-layer--graceful-degradation)
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

# 3. Start local development server
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
| `npm test` | Runs the full Vitest suite in run mode (18 behaviour-focused tests) |
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
│   ├── layout/         # AppShell, Footer, ErrorBoundaryFallback
│   ├── three/          # Scene3D, FloatingShape, Globe, HeroScene, ReducedMotionFallback (ALL 3D)
│   └── ui/             # Button, Input, Select, Modal, Badge, Spinner, EmptyState, ErrorMessage, StatCard, ProgressBar, GlassCard
├── data/
│   └── seed.ts         # 5 users, 4 projects, 20 tasks, dynamic date anchors
├── features/
│   ├── auth/           # AuthContext, LoginForm, LoginPage, ProtectedRoute
│   ├── dashboard/      # DashboardPage (metrics, overdue/due soon, hero strip)
│   ├── notfound/       # NotFoundPage (404)
│   ├── projects/       # ProjectsPage, ProjectModal
│   └── tasks/          # ProjectDetailsPage, TaskTable, TaskModal, DeleteTaskModal
├── hooks/              # useTasks, useProjects, useUsers, useDebounce, useAuth, usePrefersReducedMotion
├── services/           # api.ts (delay + failure engine), authService, projectService, taskService, userService
├── test/               # setup.ts, testUtils.tsx (renderWithProviders & 3D mocks)
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

All asynchronous operations flow through [api.ts](file:///Users/apple/Desktop/INTERNSHIP/src/services/api.ts) via `simulateNetwork()`:
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

## 🎨 Modern Visual Layer & React Bits `<DitherVeil />` Background

- **Interactive `<DitherVeil />` Background**: Powered by `ogl` (minimal WebGL library from React Bits), rendering a subtle, dynamic dithered background layer across every page (`/login`, `/`, `/projects`, `/projects/:id`, `/404`).
- **Interactive Features**: Mouse wander animation, interactive ripple shockwaves (`clickBurst`), Floyd-Steinberg dithering pattern, tailored indigo/slate color grading, and auto-fallback when running in headless/JSDOM environments.
- **Glassmorphism Layering**: Page content sits on a translucent frosted glass surface (`backdrop-blur-sm bg-slate-50/70 relative z-10`), allowing the organic veil texture to shine through while ensuring full WCAG AA contrast.
- **Pure Semantic UI**: All forms, tables, modals, cards, and navigation remain 100% semantic, keyboard-accessible, and unobstructed.

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

The testing suite contains **18 automated tests across 6 suites**, achieving 100% pass rate:

1. **Sign-in Validation**: Verifies empty/invalid email and password field errors.
2. **Sign-in Redirection**: Successful sign-in redirects to the dashboard.
3. **Protected Routes**: Unauthenticated visits to `/` redirect to `/login`.
4. **Project Search**: Filters the projects grid by search term.
5. **Project Search Empty State**: Displays empty state with "Clear search" button when no results match.
6. **Task Creation**: Creates a new task via modal and verifies it appears in the table.
7. **Loading & Populated States**: Validates skeleton transitions to live dashboard metrics.
8. **Error Resilience & Retry**: Simulated network failure displays alert with working Retry button.
9. **Modal Accessibility**: Escape key dismisses modal and restores focus to trigger button.
10. **Unit Tests**: Complete test coverage for `filterAndSortTasks()` and `calculateTaskStats()`.

Run the test suite:
```bash
npm test
```

---

## 🏆 Credits & Inspirations

- **Vite & React**: Fast frontend foundation.
- **Tailwind CSS**: Utility-first CSS framework.
- **Headless UI**: Unstyled, accessible UI primitives (Dialog, Menu).
- **Lucide Icons**: Consistent, semantic icon set.
- **Three.js / @react-three/fiber / @react-three/drei**: Declarative 3D canvas and procedural shapes (procedural Float, MeshDistortMaterial, torus knot, icosahedron).
- **date-fns**: Modular date math and formatting.
- **Unsplash**: Royalty-free placeholder avatars for team members.
- **Design Inspiration**: Linear and Vercel minimalist SaaS aesthetic with glassmorphism overlays.

---

## 📌 Assumptions & Known Limitations

1. **Mock Backend**: Operates over simulated asynchronous `localStorage`. Clearing browser data resets changes; the footer includes a "Reset Demo Data" button.
2. **Simulated Failure Rate**: Default failure rate is set to `0` in `.env` to prevent test flakiness, but can be raised or tested live via the footer toggle.
3. **No Drag-and-Drop**: Status changes use an accessible, keyboard-navigable Headless UI Menu ("Move to..."), per internship task instructions.
