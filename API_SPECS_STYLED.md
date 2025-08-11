# API Specifications

This document outlines the API endpoints for the BrainShift application.

---

## Auth Routes

**Base Path:** `/api/auth`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `POST` | `/register` | Registers a new user. | `{
  "fullName": "string",
  "email": "string",
  "password": "string"
}` | - **200 OK:** `{ "token": "string" }`<br>- **400 Bad Request:** `{ "error": "All fields are required" }`<br>- **409 Conflict:** `{ "error": "User with this email already exists" }` |
| `POST` | `/login` | Logs in an existing user. | `{
  "email": "string",
  "password": "string"
}` | - **200 OK:** `{ "token": "string" }`<br>- **400 Bad Request:** `{ "error": "Email and password are required" }`<br>- **401 Unauthorized:** `{ "error": "Invalid credentials" }` |
| `POST` | `/google` | Logs in or registers a user using a Google ID token. | `{
  "token": "string"
}` | - **200 OK:** `{ "token": "string" }`<br>- **400 Bad Request:** `{ "error": "Google ID token is required" }`<br>- **401 Unauthorized:** `{ "error": "Google authentication failed" }` |

---

## Events Routes

**Base Path:** `/api/events`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/` | Retrieves all events for the authenticated user. | | - **200 OK:** `[Event]` |
| `GET` | `/search` | Searches for events on a specific date. | Query Parameters:<br>`date`: string (format: `YYYY-MM-DD`) | - **200 OK:** `[Event]` |
| `GET` | `/:id` | Retrieves a specific event by its ID. | | - **200 OK:** `Event` |
| `DELETE` | `/:id` | Deletes a specific event by its ID. | | - **200 OK:** `{ "message": "Event deleted Successfully" }`<br>- **404 Not Found:** `{ "message": "Event not Found" }` |
| `POST` | `/` | Creates a new event. | `{
  "title": "string",
  "description": "string",
  "date": "string" (ISO 8601 format)
}` | - **200 OK:** `{ "message": "Event added successfully" }`<br>- **500 Internal Server Error:** `{ "message": "Internal Server Error" }` |
| `PUT` | `/:id` | Updates an existing event. | `{
  "title": "string",
  "description": "string",
  "date": "string" (ISO 8601 format)
}` | - **200 OK:** `{ "message": "Event Updated Successfully" }`<br>- **500 Internal Server Error:** `{ "message": "Internal Server Error" }` |

---

## Friends Routes

**Base Path:** `/api/friends`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/` | Retrieves all accepted friends of the authenticated user. | | - **200 OK:** `[Friendship]` |
| `GET` | `/pending` | Retrieves all pending friend requests for the authenticated user. | | - **200 OK:** `[Friendship]` |
| `POST` | `/request` | Sends a friend request to another user. | `{
  "friendId": "number"
}` | - **200 OK:** `Friendship`<br>- **400 Bad Request:** `{ "message": "You cannot be friends with yourself" }` |
| `PUT` | `/accept/:friendshipId` | Accepts a friend request. | | - **200 OK:** `Friendship`<br>- **404 Not Found:** `{ "message": "Friend request not found" }` |
| `DELETE` | `/reject/:friendshipId` | Rejects or deletes a friend request. | | - **200 OK:** `{ "message": "Friend request rejected" }`<br>- **404 Not Found:** `{ "message": "Friend request not found" }` |

---

## Goals Routes

**Base Path:** `/api/goals`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/` | Retrieves all goals for the authenticated user. | | - **200 OK:** `[Goal]` |
| `GET` | `/:id` | Retrieves a specific goal by its ID. | | - **200 OK:** `Goal` |
| `DELETE` | `/:id` | Deletes a specific goal by its ID. | | - **200 OK:** `{ "message": "Goal deleted Successfully" }`<br>- **404 Not Found:** `{ "message": "Goal not Found" }` |
| `POST` | `/` | Creates a new goal. | `{
  "title": "string",
  "description": "string",
  "parentId": "number" (optional),
  "type": "'SHORT' | 'LONG'",
  "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
  "priority": "number",
  "deadline": "string" (ISO 8601 format)
}` | - **200 OK:** `{ "message": "Goal added successfully" }` |
| `PUT` | `/:id` | Updates an existing goal. | (Same as POST /) | - **200 OK:** `{ "message": "Goal Updated Successfully" }` |

---

## Sessions Routes

**Base Path:** `/api/sessions`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/` | Retrieves all sessions for the authenticated user. | | - **200 OK:** `[Session]` |
| `GET` | `/:id` | Retrieves a specific session by its ID. | | - **200 OK:** `Session` |
| `DELETE` | `/:id` | Deletes a specific session by its ID. | | - **200 OK:** `{ "message": "Session deleted Successfully" }`<br>- **404 Not Found:** `{ "message": "Session not Found" }` |
| `POST` | `/` | Creates a new session. | `{
  "targetType": "'task' | 'subtask'",
  "targetId": "number" (optional),
  "startTime": "string" (ISO 8601 format),
  "endTime": "string" (ISO 8601 format, optional),
  "duration": "number" (in minutes, optional),
  "isPomodoro": "boolean" (optional),
  "completed": "boolean"
}` | - **200 OK:** `Session`<br>- **409 Conflict:** `{ "message": "An active session is already in progress." }` |
| `PATCH` | `/:id/cancel` | Cancels a session. | | - **200 OK:** `{ "session": Session }`<br>- **404 Not Found:** `{ "message": "Invalid Session ID" }` |
| `PATCH` | `/:id/completed` | Marks a session as completed and updates user streak if applicable. | `{
  "completed": "boolean"
}` | - **200 OK:** `{ "session": Session }`<br>- **404 Not Found:** `{ "message": "Invalid Session ID" }` |

---

## Tasks Routes

**Base Path:** `/api/tasks`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/` | Retrieves all tasks for the authenticated user. | | - **200 OK:** `[Task]` |
| `GET` | `/:id` | Retrieves a specific task by its ID, including its subtasks. | | - **200 OK:** `Task` (with subtasks) |
| `DELETE` | `/:id` | Deletes a specific task by its ID. | | - **200 OK:** `{ "message": "Task deleted Successfully" }`<br>- **404 Not Found:** `{ "message": "Task not Found" }` |
| `POST` | `/` | Creates a new task. | `{
  "title": "string",
  "description": "string" (optional),
  "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
  "priority": "number",
  "deadline": "string" (ISO 8601 format),
  "goalId": "number" (optional)
}` | - **200 OK:** `{ "message": "Task added successfully" }` |
| `PUT` | `/:id` | Updates an existing task. | (Same as POST /) | - **200 OK:** `{ "task": Task }` |

### Subtasks

**Base Path:** `/api/tasks/:taskID/subtasks`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/:subtaskID` | Get a specific subtask. | | - **200 OK:** `Subtask` |
| `POST` | `/` | Add a subtask. | `{
    "title": "string",
    "description": "string",
    "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
    "priority": "number",
    "deadline": "string" (ISO 8601 format)
  }` | - **200 OK:** `Subtask` |
| `PUT` | `/:id` | Update a subtask. | (Same as POST /) | - **200 OK:** `Subtask` |
| `DELETE` | `/:id` | Delete a subtask. | | - **200 OK:** `{ "message": "Subtask deleted successfully" }` |
| `PATCH` | `/:id/status` | Update a subtask's status. | `{
    "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'"
  }` | - **200 OK:** `{ "message": "Subtask status updated Successfully" }` |

---

## Users Routes

**Base Path:** `/api/users`

| Method | Path | Description | Request Body | Responses |
|---|---|---|---|---|
| `GET` | `/me` | Retrieves the authenticated user's profile. | | - **200 OK:** `User` |
| `PUT` | `/me` | Updates the authenticated user's profile. | `{
  "fullName": "string",
  "email": "string"
}` | - **200 OK:** `User` |
