# Contour LMS

A minimal Learning Management System where students sign in, view their consultations, and book new sessions with tutors.

**Live app:** [contour-lms.vercel.app/dashboard](https://contour-lms.vercel.app/dashboard)

**Test account:**

```
 email: admin@contoureducation.com
 password: test@TEST1
```

## Features

- Student dashboard with a list of existing consultations
- Filter existing consultations based on status (complete/incomplete)
- Book new consultations with tutors
- Form validation and minimal UI
- Protected Routes
- Basic Auth (login, logout, register)
- Basic RLS for security on supabase tables

## Technology

#### Stack:

| Layer      | Choice                   |
| ---------- | ------------------------ |
| Framework  | Next.js 15               |
| Language   | TypeScript               |
| Backend/DB | Supabase                 |
| Forms      | react-hook-form + Zod    |
| UI         | shadcn (Radix, Tailwind) |

#### App structure:

```
src/
├── app/                    # Next.js App Router — routes, layouts
│   ├── dashboard/          # Dashboard layout & page
│   └── (root layout, home)
├── components/
│   ├── ui/                 # shadcn components (button, dialog, table, etc.)
│   └── providers/          # React Query provider
├── features/               # Feature modules (UI + tests)
│   ├── auth/               # Login form, container
│   ├── consultation/       # Book consultation dialog
│   ├── dashboard/          # Consultation table, tabs
│   └── sidebar/            # App sidebar
├── hooks/                  # Shared hooks (e.g. use-mobile)
├── lib/                    # Utils, Supabase client/server, queryClient
├── services/               # Data layer — auth, consultation, tutors
│   ├── auth/
│   ├── consultation/       # queries, mutations, service
│   └── tutors/
├── types/                  # Generated Supabase types (database.types.ts)
├── schema.sql              # Dumped db schema
```

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<PUBLISHABLE_KEY>
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** This setup uses the hosted Supabase project as it is a simple demo project. For a full local Supabase stack (including Docker), use the official Supabase CLI instead. Happy to provide keys/access to the hosted project on request.

## Scripts

| Command                  | Description               |
| ------------------------ | ------------------------- |
| `npm run dev`            | Start the dev server      |
| `npm run build`          | Production build          |
| `npm run start`          | Start production server   |
| `npm run lint`           | Run ESLint                |
| `npm run test`           | Run Vitest                |
| `npm run types:generate` | Regenerate Supabase types |

## Design notes (assumptions/justifications)

### Assumptions:

- **Assumption 1:** The app is for **students** who want to book consultations with **tutors**

- **Assumption 2:** The list of tutors that students can choose to consult with is backend-driven. It supports loading tutor data from the backend for when the app grows.

- **Assumption 3:** Consultation reasons are hard-coded in the frontend as predefined options (no free-text) to avoid invalid or noisy input. If needed, this can be backend driven for when the app grows.

- **Assumption 4:** Students are given permissions to mark a consultation as "complete/incomplete" for simplicity. Ideally only tutors/admins should be able to do this. Roles will need to be implemented to achieve this behaviour.

- **Assumption 5:** Students are given the basic ability to choose a date and time for consultation for simplicity. Ideally, this functionality should check against the availability of the tutors.

### Tech decisions:

- **No global state management:** Since the web app is small and simple. I only opted in for react-query to handle async state which should be enough for an app of this size. A synchronous state manager can be introduced later on for complex UI interactions if needed.

- **No ORM:** The app uses Supabase’s TypeScript types (which can be found in `/src/types/database.types.ts`) and client queries directly. An ORM could be added as the data layer grows to make db calls more organised and standardised.

- **No auth context provider:** Auth state is passed from the root layout into client components for simplicity. Introducing a provider is a good next step as the component tree expands.

- **No `profiles` table:** We are not collecting any information for the student so I opted out on creating a separate table for this and relying on supabase' `getUser()` api for auth session related data

- **Basic RLS:** Only allow users to read/update their own data in the `consultations` table and only allow authenticated users to read data in the `tutors` table

- **Tests**: Unit tests are written with vitest to test the core components. Anything within `/src/components/ui` are all third-party libraries that shouldn't need any testing. Only implementations of these components should be tested. As the app scales, consider also E2E tests.
