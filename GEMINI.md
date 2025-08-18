# Project: BrainShift

## Overview

BrainShift is a full-stack productivity application designed to help users manage their tasks, goals, and events. It features a React-based frontend and a Hono-based backend, both written in TypeScript. The application uses a PostgreSQL database via the Drizzle ORM.

**Frontend:**

- **Framework:** React with Vite
- **UI:** Tailwind CSS, Radix UI, Recharts
- **Routing:** React Router
- **State Management:** React Hooks and Context API, **now enhanced with Tanstack Query for efficient data fetching and synchronization.**

**Backend:**

- **Framework:** Hono on Bun
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Local JWT-based authentication and Google OAuth
- **Email Reminders:** Integrated Mailtrap for sending email reminders based on scheduled tasks/events.

## New Features and Enhancements

- **Tanstack Query Integration:** The frontend has been refactored to leverage Tanstack Query for robust data fetching, caching, and synchronization, improving performance and developer experience.
- **Analytics Date Range Filtering:** The analytics dashboard now supports filtering data by a custom date range, allowing users to view their productivity metrics over specific periods.
- **Automated Email Reminders:** The backend includes functionality to send automated email reminders for tasks and events, enabling proactive notifications to users. This feature is designed to be triggered by an external scheduling mechanism (e.g., cron job).

## Building and Running

### Prerequisites

- Bun
- Node.js

### Installation

1.  Install dependencies from the root of the project:
    ```bash
    bun install
    ```

### Running the Application

1.  **Development:**
    Run the following command from the root of the project to start both the frontend and backend servers in development mode:

    ```bash
    bun dev
    ```

    Dont install packages from the project root. switch to packages/\* for installing dependencies in specific package

2.  **Production:**
    - **Build:**
      ```bash
      bun run build
      ```
    - **Start:**
      ```bash
      bun run start
      ```

### Database Migrations

The project uses Drizzle ORM for database migrations. The following commands are available in the `packages/server` directory:

- **Generate Migrations:**
  ```bash
  bun generate
  ```
- **Apply Migrations:**
  ```bash
  bun migrate
  ```
- **Push Schema Changes (for development):**
  ```bash
  bun push
  ```

## Development Conventions

- **Monorepo:** The project is structured as a monorepo with two packages: `app` (frontend) and `server` (backend).
- **TypeScript:** Both the frontend and backend are written in TypeScript.
- **API Specifications:** The API is documented in `API_SPECS_STYLED.md`.

- **Don't use linting**
