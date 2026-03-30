# Cal.com Clone — Enterprise-Grade Scheduling Platform

This project is a high-performance, full-stack scheduling and booking application designed as a high-fidelity clone of Cal.com. It replicates the core user experience and administrative functionality of the original platform, offering a seamless interface for hosts to manage their availability and for clients to book precision time slots.

---

## 🏗️ Technical Architecture

This Cal.com Clone is built on a modern, scalable architecture that separates concerns between a reactive frontend and a robust, schema-driven backend.

### Frontend: Modular & Reactive UI
The frontend is developed using **React.js** (via Vite) and **Tailwind CSS**, prioritizing both performance and user experience. 
- **Atomic Components**: Leverages a custom design system inspired by `shadcn/ui` for consistent, accessible UI elements.
- **State Management**: Uses modern React hooks and context for efficient data flow across the dashboard and booking pages.
- **Temporal Integrity**: Integrated with `date-fns` and `date-fns-tz` to ensure multi-timezone support is handled with mathematical accuracy.

### Backend: Schema-First API
The backend is a **Node.js/Express** server powered by the **Prisma ORM** and a **PostgreSQL** database.
- **Relational Data Modeling**: A robust database schema manages event types, availability schedules, and bookings with strict referential integrity.
- **Stateless API Design**: Follows RESTful principles to provide a clean interface for the frontend.
- **Conflict Resolution Engine**: A specialized service layer calculates real-time availability by cross-referencing host schedules, date overrides, and existing confirmed bookings.

---

## 🚀 Core Features

### 📅 Advanced Availability Management
The platform goes beyond simple "working hours" to provide enterprise-level scheduling:
- **Global Availability Rules**: Define recurring weekly schedules that adapt to the host's primary timezone.
- **Granular Date Overrides**: The system supports specific date-level overrides, allowing hosts to mark themselves as unavailable or set custom hours for specific days without altering their master schedule.

### 🔗 Dynamic Booking Flow
The public-facing booking experience is optimized for conversion and follows Cal.com's signature layout:
1. **Discovery**: Clients visit a unique landing page showcasing available event types.
2. **Selection**: A high-fidelity calendar interface displays real-time slot availability.
3. **Registration**: Customizable booking forms collect necessary client information (backed by JSONB storage).
4. **Validation**: The backend performs a final check before confirmation to prevent double-booking.

### 🌍 Timezone Synchronization
Built for a global workforce, the application automatically detects and translates timezones. Whether a host is in New York and a client is in Tokyo, the system ensures both parties see the correct local times, handled via standardized IANA timezone identifiers.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons, Date-fns |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | PostgreSQL |
| **Validation** | Zod (backend schema validation) |
| **Language** | TypeScript (Strict Mode) |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** (v8+)
- **PostgreSQL** (running instance)

### 1. Database Initialization
Create your PostgreSQL database:
```bash
createdb calcom_clone_db
```

### 2. Backend Configuration
1. Navigate to `/backend` and install dependencies: `npm install`.
2. Create a `.env` file with your `DATABASE_URL` and `FRONTEND_URL`.
3. Synchronize your schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. (Optional) Populate the database with professional seed data: `npm run seed`.
5. Start the development server: `npm run dev`.

### 3. Frontend Configuration
1. Navigate to `/frontend` and install dependencies: `npm install`.
2. Set up environment variables including `VITE_API_URL`.
3. Launch the application: `npm run dev`.
4. Access the platform at `http://localhost:5173`.

---

## 📊 Database Schema Overview

- **`EventType`**: Defined configurations for various meeting types (Duration, Slug, Metadata).
- **`AvailabilitySchedule`**: The master schedule associated with event types.
- **`AvailabilityRule`**: Specific day-of-week time ranges.
- **`DateOverride`**: Precision overrides for specific calendar dates.
- **`Booking`**: Full record of confirmed appointments with client metadata.

---

## 🛣️ Roadmap & Limitations

While the current version of the **Cal.com Clone** provides a robust foundation for scheduling, several enterprise-level features are planned for future iterations:

### 🛠️ Current Technical Limitations
- **Intra-Event Conflict Handling**: Currently, the system prevents double-booking within the *same* event type. However, it does not yet perform cross-event collision detection (e.g., a booking in "30 Min Meeting" won't automatically block the same slot in "1 Hour Consultation").
- **Stateless Authentication**: The administrative dashboard currently operates on an implicit host model. Production-ready authentication (JWT/OAuth) is required for multi-user support.
- **Notification Placeholders**: Success messages and cancellation alerts are currently UI-only; the backend logic for SMTP or SMS integration is architected but not yet connected to a provider.

### 🌟 Future Roadmap
- **Global Availability Engine**: Implementing a unified scheduling service that checks for conflicts across all event types and external calendar feeds simultaneously.
- **Two-Way Calendar Sync**: Integration with **Google Calendar API** and **Microsoft Graph** to allow for real-time synchronization of "Busy" slots from personal calendars.
- **Advanced Participant Management**: Support for collective bookings (multiple hosts), round-robin scheduling, and automated "buffer times" before and after meetings.
- **Enterprise Security**: Role-Based Access Control (RBAC) and Single Sign-On (SSO) integration for organizational management.
- **Analytics & Conversion Tracking**: A dedicated dashboard for hosts to track booking volume, peak times, and conversion rates from public links.
