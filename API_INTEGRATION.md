# API Integration Map — FixItNow Frontend

Base URL: `NEXT_PUBLIC_API_URL` (`http://localhost:5000/api` locally, per the Postman collection; deployed backend URL in production).

**Auth:** Bearer token in the `Authorization` header. Login/register return `data.token`, stored client-side in a cookie and attached to every protected request by `lib/api.ts`.

**Response envelope:** every endpoint returns `{ success, message, data }`. List endpoints paginate as `data: { <resource>: [...], pagination: { total, page, limit, totalPages } }`.

---

## Public

| Route | Component | Endpoint(s) |
|---|---|---|
| `/` | Featured services grid | `GET /services?page=1&limit=6`, `GET /categories` |
| `/services` | Browse & filter | `GET /services?page=&limit=`, `GET /categories` |
| `/services/[id]` | Service detail, technician bio, Book Now | `GET /services/:id` |

## Auth

| Route | Component | Endpoint(s) |
|---|---|---|
| `/auth/register` | Registration form | `POST /auth/register` |
| `/auth/login` | Login form | `POST /auth/login` |
| (root layout) | Session hydration | `GET /auth/me` |

## Customer

| Route | Component | Endpoint(s) |
|---|---|---|
| `/dashboard/customer` | Booking history | `GET /bookings?page=&limit=` |
| `/dashboard/customer/bookings/[id]` | Booking detail, cancel, review | `GET /bookings/:id`, `PATCH /bookings/:id/cancel`, `POST /reviews` |
| `/dashboard/customer/bookings/[id]` (Pay button) | Payment initiation → Stripe redirect | `POST /payments/sessions` |
| `/dashboard/customer/payments` | Payment history | `GET /payments?page=&limit=` |
| `/payment/success` | Confirms payment status | `GET /payments?page=&limit=` |
| `/payment/cancel` | Cancelled-payment messaging | client-side only, no call |
| Booking creation (on `/services/[id]`) | Submit booking request | `POST /bookings` |

## Technician

| Route | Component | Endpoint(s) |
|---|---|---|
| `/dashboard/technician` | Overview | `GET /technicians/profile`, `GET /bookings?page=&limit=` |
| `/dashboard/technician/profile` | Create/update profile | `GET /technicians/profile`, `POST /technicians/profile`, `PATCH /technicians/profile` |
| `/dashboard/technician/services` | My services CRUD | `GET /services?limit=100`, `POST /services`, `PATCH /services/:id`, `DELETE /services/:id` |
| `/dashboard/technician/bookings` | Accept/decline/complete | `GET /bookings?page=&limit=`, `PATCH /bookings/:id/status` |

## Admin

| Route | Component | Endpoint(s) |
|---|---|---|
| `/dashboard/admin` | Platform stats | `GET /admin/bookings/stats` |
| `/dashboard/admin/users` | User management | `GET /admin/users?page=&limit=`, `GET /admin/users/:id`, `PATCH /admin/users/:id/ban`, `PATCH /admin/users/:id/unban` |
| `/dashboard/admin/bookings` | All bookings | `GET /admin/bookings?page=&limit=` |
| `/dashboard/admin/categories` | Category CRUD | `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` |
