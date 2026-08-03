# FixItNow

A home-services marketplace where customers can browse services, book technicians, pay securely via Stripe, and leave reviews — while technicians manage their profile, services, and incoming job requests, and admins oversee the platform.

Built with Next.js against a real backend API, with role-based dashboards for **Customer**, **Technician**, and **Admin** accounts.

## Screenshot


![FixItNow screenshot](./docs/fixitnow%20frontend.png)

---

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Forms & Validation:** React Hook Form + Zod
- **Server state / data fetching:** TanStack Query
- **Client state:** Zustand (with persisted auth store)
- **Payments:** Stripe Checkout
- **Notifications:** Sonner (toasts)

---

## Features

**Public**

- Browse services with category and price filtering
- View service details, including technician bio, skills, and experience

**Customer**

- Register / log in
- Book a service
- View booking history and booking detail, with live status
- Cancel a pending or accepted booking
- Pay for an accepted booking via Stripe Checkout
- View payment history
- Leave a review after a completed booking

**Technician**

- Create and update a technician profile (bio, skills, experience, availability toggle)
- Manage own services (create, edit, delete)
- View and respond to incoming booking requests (accept / decline / complete)

**Admin**

- Platform overview stats
- Manage users (search, ban / unban)
- View all bookings across the platform
- Manage service categories

**Cross-cutting**

- Role-based route protection (customer / technician / admin dashboards)
- Consistent toast + inline validation error handling throughout
- Loading and empty states on every data-driven page

---

## Dependencies

```json
{
	"next": "16.2.12",
	"react": "19.2.4",
	"react-dom": "19.2.4",
	"typescript": "^5",
	"tailwindcss": "^4",
	"react-hook-form": "^7",
	"zod": "^3",
	"@hookform/resolvers": "^3",
	"@tanstack/react-query": "^5",
	"zustand": "^4",
	"sonner": "^1",
	"js-cookie": "^3",
	"jwt-decode": "^4"
}
```

See `package.json` for the full, exact list with resolved versions.

---

## Running Locally

**Prerequisites:** Node.js 18.18+ and npm.

```bash
# 1. Clone the repo
git clone <this-repo-url>
cd fixitnow-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# then open .env.local and fill in NEXT_PUBLIC_API_URL

# 4. Run the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable              | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `https://fixitnow-backend-d2kr.onrender.com/api`) |

> **Note:** the backend is hosted on Render's free tier, so the first request after a period of inactivity can take 30–60+ seconds to wake up. This is expected, not a bug.

---

## Available Scripts

| Command         | Description                                             |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Start the development server at `http://localhost:3000` |
| `npm run build` | Create a production build                               |
| `npm run start` | Run the production build locally                        |
| `npm run lint`  | Run ESLint                                              |

---

## Project Structure

```
fixitnow-frontend/
├── src/
│   ├── app/            # Routes (App Router) — public, auth, dashboard, payment
│   ├── components/     # UI components, grouped by feature (bookings, payments, services, layout)
│   ├── types/           # Shared TypeScript types per resource
│   ├── lib/             # API client, Zod validation schemas
│   ├── store/           # Zustand auth store
│   └── middleware.ts     # Role-based route protection
├── docs/                 # Postman collection, screenshots
└── API_INTEGRATION.md    # Frontend route → backend endpoint map

```

## Live Links

| Link                                   | URL                                              |
| -------------------------------------- | ------------------------------------------------ |
| **Live app**                           | <!-- TODO: add deployed frontend URL -->         |
| **Backend API**                        | `https://fixitnow-backend-d2kr.onrender.com/api` |
| **API reference (Postman collection)** | `docs/FixItNow_API_postman_collection.json`      |

---

## Known Limitations

The backend's actual API surface is narrower than the original assignment brief described. Rather than fake data for missing endpoints, the UI was scoped to what's real:

- No time-slot/calendar booking — booking a service is service + optional note, with no date/time selection, since the API has no scheduling field.
- No standalone technician profile page — technician bio/skills appear nested on the service detail page instead.
- No public review listing — reviews can be submitted after a completed booking, but aren't displayed anywhere (no list endpoint exists).
- Category and price filters on the services page are applied client-side to the current page of results, not server-side across the full catalog.

---

## Project Documentation

For anyone continuing development on this project:

- [`API_INTEGRATION.md`](./API_INTEGRATION.md) — maps each frontend route/component to the backend endpoints it calls
