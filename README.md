# Cal.com Clone — Full Stack Scheduling Application

A full-stack scheduling and booking web application built with React, Node.js, Express, and PostgreSQL, designed to closely replicate the user experience and functionality of Cal.com.

## Project Overview

This app offers a streamlined scheduling experience. A default admin user can define **Event Types** (e.g., "30 Minute Meeting") and set **Availability** (specific hours on specific days). Users can visit the shareable booking link to select a date, pick an available time slot, and confirm a booking.

### Key Features
- **Event Management**: Create, edit, and delete event types with custom durations, slugs, and color codes.
- **Availability Schedule**: Define configurable weekly availability, automatically mapped to the host's timezone.
- **Booking Flow**: A clean 4-step public-facing booking UI matching Cal.com's layout (Date → Slot → Form → Confirmation).
- **Timezone Awareness**: Availability is translated smoothly to bookers globally using standard IANA timezone adjustments.
- **Double Booking Prevention**: Robust backend checks to prevent overlapping confirmed bookings on the same event type.

---

## Tech Stack

**Frontend:**
- **Framework**: React.js via Vite (`react^18.2.x`, `vite^6.x`)
- **Routing**: React Router v6 (`react-router-dom^7.x`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + custom shadcn/ui inspired components
- **Date Handling**: `date-fns^4.1.0` + `date-fns-tz^3.2.0`
- **Calendar**: `react-day-picker^9.5.1`
- **Icons**: `lucide-react^0.475.0`
- **HTTP Client**: `axios^1.x`

**Backend:**
- **Runtime & Server**: Node.js + Express.js v5 (`express^5.2.1`)
- **Database**: PostgreSQL
- **ORM**: Prisma v7 (`@prisma/client^7.6.0`, `@prisma/adapter-pg^7.6.0`)
- **Postgres Driver**: `pg^8.13.3`
- **Environment**: `dotenv^16.4.7`

---

## Prerequisites

- **Node.js**: v18 or later
- **npm**: v8 or later
- **PostgreSQL**: Running locally or a connection string to a remote DB.

---

## Local Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running locally and create a new database.
```bash
createdb calcom_clone
```

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user@localhost:5432/calcom_clone"
   PORT=5001
   FRONTEND_URL="http://localhost:5173"
   ```
   *(Note: Adjust the username and password in `DATABASE_URL` as needed.)*
4. Sync Prisma schema to the database and generate client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Seed the database with default data (event types, availability, bookings):
   ```bash
   npm run seed
   ```
6. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_URL="http://localhost:5001"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. App will be available at `http://localhost:5173`

---

## Database Schema Overview

- **`EventType`**: (id, title, slug, duration, description, color, isActive, createdAt, updatedAt)
- **`AvailabilitySchedule`**: (id, name, timezone, isDefault, createdAt)
- **`AvailabilityRule`**: (id, scheduleId, dayOfWeek, startTime, endTime)
- **`Booking`**: (id, eventTypeId, bookerName, bookerEmail, startTime, endTime, status, notes, createdAt, updatedAt)

*(Note: Relations are constrained by `onDelete: Cascade` where applicable to keep data clean).*

---

## API Documentation

The backend exposes the following REST API endpoints:

### Event Types
- `GET /api/event-types` - List all event types ordered by newest
- `GET /api/event-types/:slug` - Get a specific event type by its slug
- `POST /api/event-types` - Create a new event type
- `PUT /api/event-types/:id` - Update an event type
- `DELETE /api/event-types/:id` - Delete an event type (cascades to bookings)

### Availability
- `GET /api/availability` - Retrieve the default schedule and its associated rules
- `PUT /api/availability` - Update the timezone and atomically replace all day rules for the default schedule

### Bookings
- `GET /api/bookings?status=upcoming|past` - Get all bookings filtered by status
- `POST /api/bookings` - Create a new booking (returns `409 Conflict` if the requested slot is already booked)
- `PATCH /api/bookings/:id/cancel` - Cancel an existing booking
- `GET /api/bookings/slots?slug={slug}&date={yyyy-MM-dd}` - Retrieve generated free slots for a specific date and event type

---

## Assumptions Made

- For simplicity, there is **one central admin user profile** (an implicit host) handling all available slots and event types. Full multi-tenant authentication has been omitted to focus on core scheduling functionality.
- The `AvailabilitySchedule` assumes standard recurring weekly schemas without date-specific overrides or calendar syncing integrations (e.g., Google Calendar polling).
- **Time ranges** are selected from 00:00 to 23:30 in 30-minute intervals. Time zones are translated strictly based on the Host's selected default IANA timezone to universal UTC mappings.

## Known Limitations

- Overlaps between distinct backend `EventType` bookings aren't currently checked against *other* event types, only against bookings for the *requested* event type. (To replicate full Cal.com behavior, the `getAvailableSlots` would need global cross-event overlap collision checks).
- Email notifications aren't integrated out-of-the-box (placeholder text implies success).
- No actual SSO/Login auth implemented for the admin dashboard.
