# Todo App — Next.js 15

A feature-complete Todo List application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **localStorage** persistence.

Built as Workflow 3 (W3 — AI-Native / Agentic) benchmark project for IEEE research paper:
_"AI-Native Development Platforms vs. Traditional IDEs: The Impact on Developers in the Era of Agentic AI"_

---

## Features

- Add tasks with title and optional description
- Mark tasks complete / incomplete
- Delete tasks
- Filter by status: All / Active / Completed
- Persist state to `localStorage` (survives page refresh)
- Responsive layout (mobile + desktop)
- Next.js API routes for validation layer (CRUD endpoints)
- Directory-based routing (`/` and `/tasks`)

---

## Project Structure

```
todo-app/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET /api/tasks, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts      # PATCH /api/tasks/:id, DELETE /api/tasks/:id
│   ├── tasks/
│   │   └── page.tsx              # /tasks route (directory-based routing)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # / (main dashboard)
├── components/
│   ├── FilterBar.tsx
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── lib/
│   └── storage.ts                # localStorage read/write helpers
├── types/
│   └── index.ts                  # Shared TypeScript types
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tasks` | Returns empty array (client is source of truth) |
| `POST` | `/api/tasks` | Validates payload, returns new task object |
| `PATCH` | `/api/tasks/:id` | Validates update payload, returns patch |
| `DELETE` | `/api/tasks/:id` | Validates ID, returns deleted ID |

> The API routes act as a **validation and transformation layer**. Actual persistence is handled client-side via `localStorage`. The client applies validated responses from the API to its local state.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

---

## Metrics (W3 — Research Paper)

Track the following after review:

| Metric | Value |
|--------|-------|
| T_setup (min) | _record time to first runnable build_ |
| T_mvp (hrs) | _record time to feature-complete_ |
| LOC / hr | _total LOC ÷ T_mvp_ |
| Debugging cycles | _count distinct debug sessions_ |
| Bug density (/100 LOC) | _defects found in code review_ |
| Verification overhead (%) | _review time ÷ total time_ |
