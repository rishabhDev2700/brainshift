# BrainShift

BrainShift is a productivity application designed to help users manage their tasks, goals, and events. It provides a comprehensive set of tools to track progress, manage time effectively, and maintain focus. The application also includes social features like a friends system and a streak system to keep users motivated.

## Features

-   User authentication (local and Google OAuth)
-   Task management with subtasks
-   Goal setting and tracking
-   Event scheduling
-   Session tracking with Pomodoro support
-   Streak system to motivate users
-   Friends system to connect with others

## API Documentation

A detailed API specification is available in [API_SPECS_STYLED.md](API_SPECS_STYLED.md).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in `packages/server` and add the necessary environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`).
4.  **Run the development server:**
    ```bash
    bun dev
    ```
    This will start both the frontend and backend servers concurrently.

## Technologies Used

-   **Frontend:**
    -   React
    -   Vite
    -   TypeScript
    -   Tailwind CSS
    -   Radix UI
    -   Recharts
    -   React Router
-   **Backend:**
    -   Hono
    -   Bun
    -   TypeScript
    -   Drizzle ORM
    -   PostgreSQL
    -   Zod
