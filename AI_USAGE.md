# AI Usage Disclosure & Collaboration Log

This document outlines the tools, prompts, human oversight, verification steps, and code refactorings involved in building the **Axionix Team Task Tracker**.

---

## 🤖 Tools Used
- **Antigravity IDE**: AI-assisted software engineering agent.
- **Model**: Advanced Reasoning Model (Gemini 3.8 Flash).
- **Core CLI Tools**: Node.js (v24), npm, Git, Vitest, ESLint.

---

## 💬 Prompts & Collaborative Workflow
Key prompts and directives utilized during the implementation:
1. *Scaffold project architecture with React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, and React Hook Form + Zod.*
2. *Enforce strict architectural boundaries: Components must never touch localStorage directly; all operations route strictly through `component -> hook -> service -> storage`.*
3. *Implement simulated network delay and error injection engine with a runtime toggle in the application footer for demo evaluation.*
4. *Design semantic, accessible UI with focus trapping, visible focus indicators, keyboard navigation, and explicit accessible labels.*
5. *Design a modern "Floating Glass Dashboard" aesthetic using a lightweight ambient WebGL fluid shader (`<Iridescence />` powered by `ogl`), frosted glass cards (`<GlassCard />`), and graceful static fallbacks for `prefers-reduced-motion` and environments without WebGL.*
6. *Construct a comprehensive, behavior-driven test suite with Vitest and React Testing Library covering authentication, project filtering, modal flows, keyboard accessibility, calendar date validation, and utility functions without fragile snapshots.*

---

## 🛠 What Was Generated
- **Project Structure**: Clean modular layout separating UI primitives (`src/components/ui/`), visual layers (`src/components/visuals/`), layout shells (`src/components/layout/`), feature views (`src/features/`), custom hooks (`src/hooks/`), services (`src/services/`), seed data (`src/data/`), and utilities (`src/utils/`).
- **Data Models & Seed**: 5 realistic team members, 4 projects (including 1 zero-task project for empty states), and initial seed tasks with dynamic relative date anchors.
- **Service Layer**: Asynchronous Promise-based mock storage service with configurable delay and failure injection (`api.ts`), domain services (`authService.ts`, `projectService.ts`, `taskService.ts`), and high-level system service (`systemService.ts`).
- **Feature Pages**:
  - `/login`: Accessible form with Zod validation, password show/hide toggle, and 1-click demo credential autofill.
  - `/`: Workspace dashboard with 5 metric stat cards, completion progress bar, active projects grid, and overdue/due-soon lists.
  - `/projects`: Responsive grid, debounced URL search, project creation modal, and empty search state.
  - `/projects/:id`: Dual view (interactive Table and Kanban board), URL query filter controls (search, status, priority, assignee, sort), task creation/edit modal, and delete confirmation modal.
  - `/404`: Accessible not-found page with return home navigation.
- **Testing Infrastructure**: `testUtils.tsx` provider wrapper and 31 automated tests across 9 test suites with Vitest + React Testing Library.

---

## 🔍 What Was Verified and Refactored by Human Engineer
1. **Elimination of Three.js & Bundle Optimization**: The initial AI scaffold proposed a heavy `@react-three/fiber` / Three.js 3D layer. This introduced over 800 KB of bundle overhead, continuous CPU-draining requestAnimationFrame loops, and brittle WebGL canvas mocking issues in headless JSDOM. I refactored the visual layer to eliminate Three.js entirely, replacing it with an ultra-lightweight ambient WebGL shader (`<Iridescence />` via `ogl`) that halts animation when `prefers-reduced-motion` is detected and smoothly falls back to CSS gradients when WebGL is unavailable.
2. **Strict Service Layer Boundary**: Audited all UI components to verify that no component references `localStorage`. Discovered that `Footer.tsx` originally contained a direct reference in a tooltip string and internal flags; refactored all runtime developer controls and storage resets behind `src/services/systemService.ts`.
3. **Calendar Date Validation Refinement**: Replaced naive date regex matching with a strict calendar validator (`isValidCalendarDate`) that verifies authentic year, month, and day combinations (rejecting invalid dates like `2026-13-45` and accounting for leap years).
4. **ESLint Accessibility Compliance**: Enforced `eslint-plugin-jsx-a11y` rules to ensure proper form labels, `aria-describedby` for error messages, `role="alert"`, and `aria-current` on navigation links.
5. **JSDOM Headless Polyfills**: Detected missing `ResizeObserver` in JSDOM during modal testing and implemented a polyfill mock in `src/test/setup.ts` to ensure reliable test execution.
6. **URL Query Synchronization**: Audited `filterAndSortTasks` to confirm search, status, priority, assignee, and sort states persist cleanly across back/forward browser navigation.

---

## ⚠️ One AI Mistake I Caught

During the implementation of the task creation form, the AI generated a Zod schema that validated the due date field with a simple regular expression:
```typescript
dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format')
```

While this regex confirmed the syntactic structure of four digits followed by two-digit groups, it completely failed to validate semantic calendar validity. As a result, impossible inputs like `2026-13-45` or `2026-02-30` passed client-side validation without error. When passed down into the service layer and consumed by `date-fns` calculation functions (`isOverdue`, `isDueSoon`, `formatDate`), these invalid strings produced `NaN` date comparisons and corrupted dashboard metric computations.

**How I resolved it:**
1. Created a dedicated pure utility function `isValidCalendarDate(dateStr: string): boolean` in `src/utils/dates.ts` that parses the string into numeric year, month, and day components, enforces month bounds (1–12) and day bounds (1–31), and validates that `new Date(year, month - 1, day)` matches the input components exactly without rolling over (handling 28/29/30/31-day months and leap years).
2. Refactored `TaskModal.tsx` to refine the Zod schema using `.refine((val) => isValidCalendarDate(val), 'Please enter a valid calendar date in YYYY-MM-DD format')`.
3. Wrote comprehensive unit tests in `src/utils/dates.test.ts` and integration assertions in `src/features/tasks/TaskFlow.test.tsx` verifying that malformed and non-existent calendar dates are rejected with helpful error feedback.
