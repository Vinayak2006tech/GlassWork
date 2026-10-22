# AI Usage Disclosure & Collaboration Log

This document outlines the tools, prompts, human oversight, verification steps, and code refactorings involved in building the **Axionix Team Task Tracker**.

---

## 🤖 Tools Used
- **Antigravity IDE**: AI-assisted software engineering agent.
- **Model**: Advanced Reasoning Model (Gemini 3.8 Flash).
- **Core CLI Tools**: Node.js, npm, Git, Vitest, ESLint.

---

## 💬 Prompts & Collaborative Workflow
Key prompts and directives utilized during the implementation:
1. *Scaffold project architecture with React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, and React Hook Form + Zod.*
2. *Enforce architecture boundary: Components never touch localStorage; all operations route through `component -> hook -> service -> storage`.*
3. *Implement simulated delay and error engine with runtime toggle for presentation demo.*
4. *Design semantic, accessible UI with focus trapping, keyboard navigation, and visible labels.*
5. *Develop decorative 3D layer with Three.js / @react-three/fiber with zero intrusion on functional UI and graceful degradation (`ReducedMotionFallback`).*
6. *Construct 18 behavior-driven tests with JSDOM covering full user flows without snapshots.*

---

## 🛠 What Was Generated
- **Project Structure**: Modular layout separating UI primitives, feature views, custom hooks, services, seed data, and utilities.
- **Data Models & Seed**: 5 realistic users, 4 projects (including 1 zero-task project for empty states), and 20 tasks with dynamic relative date offsets.
- **Service Layer**: Asynchronous Promise-based localStorage service with delay simulator, configurable failure injection, and footer toggle.
- **Feature Pages**:
  - `/login`: Accessible form with Zod validation, password show/hide toggle, and demo auto-fill.
  - `/`: Workspace dashboard with 4 metric cards, completion progress bar, overdue/due-soon lists, and 3D hero strip.
  - `/projects`: Responsive 1/2/3 grid, debounced URL search, project creation modal.
  - `/projects/:id`: Task table with inline status menu, URL query filter controls, task modal, delete confirmation modal.
  - `/404`: Friendly not-found screen with 3D decorative knot and return link.
- **Testing Infrastructure**: `testUtils.tsx` provider wrapper and 18 unit/integration tests with Vitest + React Testing Library.

---

## 🔍 What Was Verified and Refactored by Human Engineer
1. **React 18 Peer Dependencies**: Explicitly ensured React 18.3.1 was installed and configured (rather than React 19) to maintain compatibility with `@react-three/fiber` v8 and Headless UI.
2. **ESLint Accessibility Compliance**: Enforced `eslint-plugin-jsx-a11y` rules to ensure proper form labels, aria-describedby for errors, role="alert", and aria-current on navigation links.
3. **JSDOM Headless UI Support**: Detected missing `ResizeObserver` in JSDOM during modal testing and implemented a polyfill mock in `src/test/setup.ts` to ensure reliable test execution.
4. **URL Query Synchronization**: Audited `filterAndSortTasks` to confirm search, status, priority, assignee, and sort states persist cleanly across back/forward browser navigation.
5. **Reduced Motion Fallback**: Tested media query override for `prefers-reduced-motion: reduce` to ensure 3D canvas is replaced with an accessible, static gradient illustration.

---

## ⚠️ One AI Mistake I Caught
<!-- PLACEHOLDER FOR CANDIDATE REVIEW: Feel free to edit or replace with your own experience -->

*During the initial test generation for the Sign-In flow, the automated test used `screen.getByLabelText(/password/i)` without scoping the selector. Because the login screen featured both a password `<input>` element and a password visibility toggle with aria-label text containing "password", Testing Library threw an ambiguous element match error. I refactored the test query to use `{ selector: 'input' }`, ensuring strict, deterministic targeting of the form field.*
