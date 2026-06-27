Pet Clinic — Patient Management

A single-page application for managing a veterinary clinic's patients: list, search,
sort, and filter records, and add / edit / delete patients. Built with Next.js and
MongoDB.

Live demo: https://pet-clinic-management-alpha.vercel.app/
Repository: https://github.com/DavidLamdon/pet-clinic-management

Tech stack

Next.js (App Router) — full-stack in one codebase; UI and API routes deploy together.
MongoDB + Mongoose — data store with schema and enum enforcement at the DB layer.
TanStack Table (headless) — table model only; all markup and styling stay in Tailwind.
TanStack Query (React Query) — server-state caching and cache invalidation after mutations.
Zod — a single validation schema shared by the client form and the API route.
Tailwind CSS — styling, with design tokens defined in tailwind.config.js.
TypeScript throughout.

Deployed on Vercel with MongoDB Atlas.

Getting started

Requirements

Node.js 20+ (developed on v24.11.0)
A MongoDB connection string — e.g. a free MongoDB Atlas cluster

Setup

bashgit clone https://github.com/DavidLamdon/pet-clinic-management.git
cd pet-clinic-management
npm install

Create a .env.local file in the project root:

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/petclinic?retryWrites=true&w=majority

Start the dev server:

bashnpm run dev

The app runs at http://localhost:3000.

Environment variables

VariableDescriptionMONGODB_URIMongoDB connection string. Include the database name (/petclinic) before the query params. From Atlas → Connect → Drivers.

Project structure

src/
├─ app/
│ ├─ api/
│ │ └─ patients/ REST endpoints: GET/POST, and PUT/DELETE by id
│ ├─ page.tsx main page — data fetching + modal state
│ ├─ providers.tsx React Query provider
│ ├─ layout.tsx
│ └─ globals.css
├─ components/ table, cards, modal, controls, filters, sort
│ └─ ui/ presentational primitives (Field)
├─ lib/
│ ├─ api/ HTTP transport functions (fetch)
│ ├─ hooks/ patient mutation hook
│ ├─ mongoose.ts cached connection for serverless
│ ├─ constants.ts pet types & modal modes (single source of truth)
│ ├─ validation.ts Zod schema
│ ├─ types.ts
│ └─ utils.ts age calculation
└─ models/
└─ Patient.ts Mongoose schema

Key design decisions

Pet age is derived, not stored. The database holds petBirthDate; age is
computed on the client at render time, so it can never go stale.
Tailwind only. The recommended MUI was dropped in favor of headless TanStack
Table to honor the "Tailwind exclusively" requirement without mixing two styling
systems.
One modal, two modes. A single PatientModal handles both Add and Edit;
delete lives inside the Edit view.
Responsive: table becomes cards. Below the md breakpoint the table collapses
to a card list. Both views render from the same TanStack model, so search, sort,
and filter behave identically on mobile — sorting is exposed through a "Sort by"
control where table headers aren't available.
Client-side filtering and sorting. The dataset is small, so filtering and
sorting run in memory over the React Query cache, with no server round-trips per
keystroke.

The full reasoning and trade-offs behind these are documented in
DECISIONS.md.

Notes

Atlas network access is open to 0.0.0.0/0 for this exercise, because Vercel's
free-tier serverless functions have no static egress IP. In production this would be
restricted to known ranges or a private endpoint.
The same Zod schema validates input on both the client (immediate feedback) and the
server (the authoritative guard).
