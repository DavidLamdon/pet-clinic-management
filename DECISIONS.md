Engineering Decisions

This document records the non-obvious technical decisions made while building the
pet clinic management app — the reasoning and the trade-offs behind each. It is a
running log written as decisions are made, not reconstructed at the end, and it
feeds the relevant sections of the README.

Stack

Next.js (App Router). Full-stack in a single codebase — UI and API deploy
together. App Router rather than Pages Router for current idioms: route
handlers, async params, and an explicit server/client component boundary.
MongoDB + Mongoose. Mongoose gives schema and enum enforcement at the
database layer and ergonomic queries.
TanStack Table (headless) for the table — see "Dropping MUI" below.
TanStack Query (React Query) for server state: caching, request status, and
cache invalidation after mutations. Removes hand-rolled loading/error state and
manual list updates.
Zod for validation — one schema shared by the client form and the API route,
defined once and enforced on both sides.
lucide-react for icons, matching the pencil / trash / plus affordances in
the spec.

Dropping MUI despite the recommendation

The brief recommends MUI but also requires "Tailwind CSS exclusively." These
conflict: MUI ships its own styling system (Emotion). Rather than run two styling
models against each other, MUI was dropped in favor of headless TanStack Table,
which provides the table model (rows, sorting, filtering) and leaves all markup
and styling to Tailwind. This honors "Tailwind exclusively" and keeps full control
of the markup. "Recommended" was read as non-binding, and the brief explicitly
permits other packages.

Tailwind v3.4 instead of v4

The brief says to store CSS constants in tailwind.config.js. Tailwind v4 moved
theme configuration out of that file into a CSS @theme block, so in v4 the file
no longer holds those constants. To follow the instruction literally, Tailwind was
pinned to v3.4, where tailwind.config.js is the source of design tokens. The
alternative (v4 with a @config shim) was rejected as more friction against an
explicit instruction.

src/ directory

Application code lives under src/ (src/app, src/lib, src/models,
src/components), leaving only configuration in the repo root. This is not a
frontend/backend split — Next.js does not separate them — but it keeps config and
application code apart and organizes by role: app (routes), components (UI),
lib (utilities, API client, hooks), models (Mongoose schemas).

Data model

Age is derived, never stored

The table shows Pet Age; the form collects Pet Birth Date. The database stores only
petBirthDate; age is computed from it (lib/utils.ts -> calculateAge) at render
time on the client. Storing age would make it stale the moment it is written —
birth date is the single source of truth. The calculation accounts for whether the
birthday has occurred yet this year, not just the year difference.

Pet type as a single source of truth

PET_TYPES is defined once in lib/constants.ts with as const and consumed by
the Mongoose enum, the Zod enum, the form radios, and the table filter. as const
preserves the literal union type and satisfies Zod's z.enum. Adding a type later
is a one-line change in one place. The modal's two modes are handled the same way
via a MODAL_MODES constant rather than a TypeScript enum, which avoids emitting
a runtime object and keeps the values type-safe.

API

Backend via Next.js API routes (no direct DB access from the client)

The client never talks to MongoDB directly — that would leak credentials and break
the brief. Route handlers under app/api/patients are the server boundary; the
browser calls them over HTTP.

Mongoose connection caching for serverless

Route handlers run as serverless functions, so a fresh connection per invocation
would exhaust the Atlas pool. lib/mongoose.ts caches the connection on a global
singleton and reuses it across warm invocations. The model is registered with
models.Patient || model(...) to avoid OverwriteModelError on hot reload.

PUT replaces the whole document (no PATCH)

The Edit modal saves the entire form, so the API accepts and validates a full
patient object. Partial updates were deliberately not added — no UI sends a single
field, and a partial endpoint would weaken required-field validation for no
benefit.

Frontend

Layered data flow

lib/api/patients.ts — pure transport functions (fetch), unaware of React Query.
React Query — caching and request state layered on top of those functions.
Components — read data through hooks, never call transport functions directly.

Dependencies point one direction: component -> React Query -> API function -> route
handler -> Mongo. Mutations (usePatientMutations) invalidate the ["patients"]
query on success, so the server stays the source of truth and the table refreshes
itself rather than being patched by hand.

Client-side filtering and sorting

The dataset is small, so TanStack filters and sorts in memory over the
already-fetched array — no extra round-trips on keystroke. Sorting and per-column
search are wired only to Name and Pet Name; the multi-select filter only to Pet
Type — matching the spec. If the dataset grew large, this would move server-side
with pagination and query params.

One modal, two modes

A single PatientModal takes a mode ("add" | "edit") prop — the brief's "modal
with two variants." Delete lives inside the Edit modal (trash icon), matching the
spec. The form validates with the shared patientSchema before sending, giving
immediate feedback while the server re-validates as the real guard.

Responsive: table becomes cards

Below the md breakpoint the table collapses to a card list. Both views render
from the same TanStack model, so search, sort, and filter behave identically on
mobile. Sorting is exposed through a "Sort by" dropdown on mobile instead of
clickable table headers: the spec's sort capability is retained, but the
implementation is adapted to the absence of a table header on a narrow screen.

Stable references for the table

TanStack compares columns by reference; recreating the array each render causes
needless table rebuilds. columns is memoized with useMemo([onEdit]), and
onEdit is stabilized with useCallback in the page (otherwise the memo would see
a new function every render). Only onEdit is wrapped — it feeds the memo
dependency. handleAdd / handleClose are intentionally left unwrapped: they go
to plain click handlers where a stable reference buys nothing, and wrapping them
would be cargo-cult memoization.

Extracting components only on real duplication

Field was extracted to components/ui because five form fields shared identical
markup. EditButton was extracted to components (not ui, since it is
domain-aware — it takes a Patient) because the same pencil action was duplicated
in the table and the cards. A Button component was considered and declined — the
buttons in the app differ, and there is no real duplication yet. Components are
extracted when duplication of the same intent exists, not preemptively.

Color tokens

Only the semantic colors actually used in the UI were tokenized in
tailwind.config.js: brand (primary actions, links), danger (delete and
validation errors), and muted (a recurring grey used in 6+ files). The rest of
the neutral palette is left at Tailwind's defaults to avoid defining tokens that
centralize nothing. The intent is for the config to hold genuine design constants,
not to mirror the default greyscale.

Tooling & deployment

React Compiler

Next.js 16 ships React Compiler but leaves it off by default; the project keeps
that default. A "Compilation Skipped" warning appears on the table component — it
comes from the bundled react-compiler lint rule and is a known, expected
interaction with TanStack Table's useReactTable, which returns a mutable instance
the compiler will not memoize. Because the compiler is not actually transforming
code here, there is no runtime impact, and the warning is left as-is rather than
silenced with a "use no memo" directive the project does not otherwise need.

Deployment

Hosted on Vercel (native Next.js) with MongoDB Atlas. MONGODB_URI is set as a
Vercel environment variable and is never committed. Atlas Network Access is open to
0.0.0.0/0 because Vercel functions have no static egress IP on the free tier —
acceptable for this exercise, but in production this would be restricted to known
ranges or a private endpoint. Deployment was validated early — on day one, with a
temporary DB health-check route (since removed) — to confirm the full
client -> API -> Atlas chain worked before building features, rather than
discovering deploy issues at the end.

Challenges

Broken @/ imports after moving to src/ — the tsconfig path alias still
pointed at the root, and one import had picked up a stray src segment
(@/src/lib/...). Fixed by pointing @/_ at ./src/_ and using @/lib/...
consistently.
Tailwind v4 vs the config instruction — resolved by pinning v3.4 (above).
TanStack + react-compiler lint warning — diagnosed as a known, harmless lint
interaction (above).

Open questions & assumptions

Questions raised with the team:

Age is computed from birth date, and the database stores the birth date (not the
age) — confirm?
Given "Tailwind exclusively," MUI is dropped in favor of headless TanStack Table

React Query — acceptable?

Assumptions made from the spec where it was unambiguous (no question raised):

Pet Type is single-select in the form (radio) and multi-select in the table
filter (checkboxes).
Sort and per-column search apply only to Name and Pet Name; the multi-select
filter applies only to Pet Type.
The Edit modal saves the full record, which drives the full-document PUT.
Phone and birth date validation. Birth date is constrained to today or earlier (a pet can't be born in the future), enforced both on the <input max> and in the Zod schema. Phone is validated as 9–10 digits with optional dashes — broad enough to accept the mobile and landline formats shown in the spec (052-1123451, 03-4204204) without enforcing a single rigid pattern that would reject valid numbers. Full locale-aware validation (e.g. libphonenumber) was considered out of scope.

After conversation with CEO considered improving UI of table and changed brand colors and added aditional styling

Added sorting by Pet Age (beyond the spec). The spec shows sort only on Name and Pet Name, but sorting by age is a natural expectation in a patient list. Since age is derived, the column sorts via a custom sortingFn that compares computed age rather than the raw birth date, so the arrow direction matches what the user sees.

Added phone search (beyond the spec). Search is normalized — both the query and stored value are reduced to digits before matching — so a query like 052-123 finds 0521234567 regardless of formatting.
