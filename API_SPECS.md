# API Specifications

This document outlines the API endpoints for the BrainShift application.

## Auth Routes

Base Path: `/api/auth`

### POST /register

Registers a new user.

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
- **200 OK:** `{ "token": "string" }`
- **400 Bad Request:** `{ "error": "All fields are required" }`
- **409 Conflict:** `{ "error": "User with this email already exists" }`

### POST /login

Logs in an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
- **200 OK:** `{ "token": "string" }`
- **400 Bad Request:** `{ "error": "Email and password are required" }`
- **401 Unauthorized:** `{ "error": "Invalid credentials" }`

### POST /google

Logs in or registers a user using a Google ID token.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:**
- **200 OK:** `{ "token": "string" }`
- **400 Bad Request:** `{ "error": "Google ID token is required" }`
- **401 Unauthorized:** `{ "error": "Google authentication failed" }`

## Events Routes

Base Path: `/api/events`

### GET /

Retrieves all events for the authenticated user.

**Response:**
- **200 OK:** `[Event]`

### GET /search

Searches for events on a specific date.

**Query Parameters:**
- `date`: string (format: `YYYY-MM-DD`)

**Response:**
- **200 OK:** `[Event]`

### GET /:id

Retrieves a specific event by its ID.

**Response:**
- **200 OK:** `Event`

### DELETE /:id

Deletes a specific event by its ID.

**Response:**
- **200 OK:** `{ "message": "Event deleted Successfully" }`
- **404 Not Found:** `{ "message": "Event not Found" }`

### POST /

Creates a new event.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "date": "string" (ISO 8601 format)
}
```

**Response:**
- **200 OK:** `{ "message": "Event added successfully" }`
- **500 Internal Server Error:** `{ "message": "Internal Server Error" }`

### PUT /:id

Updates an existing event.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "date": "string" (ISO 8601 format)
}
```

**Response:**
- **200 OK:** `{ "message": "Event Updated Successfully" }`
- **500 Internal Server Error:** `{ "message": "Internal Server Error" }`

## Friends Routes

Base Path: `/api/friends`

### GET /

Retrieves all accepted friends of the authenticated user.

**Response:**
- **200 OK:** `[Friendship]`

### GET /pending

Retrieves all pending friend requests for the authenticated user.

**Response:**
- **200 OK:** `[Friendship]`

### POST /request

Sends a friend request to another user.

**Request Body:**
```json
{
  "friendId": "number"
}
```

**Response:**
- **200 OK:** `Friendship`
- **400 Bad Request:** `{ "message": "You cannot be friends with yourself" }`

### PUT /accept/:friendshipId

Accepts a friend request.

**Response:**
- **200 OK:** `Friendship`
- **404 Not Found:** `{ "message": "Friend request not found" }`

### DELETE /reject/:friendshipId

Rejects or deletes a friend request.

**Response:**
- **200 OK:** `{ "message": "Friend request rejected" }`
- **404 Not Found:** `{ "message": "Friend request not found" }`

## Goals Routes

Base Path: `/api/goals`

### GET /

Retrieves all goals for the authenticated user.

**Response:**
- **200 OK:** `[Goal]`

### GET /:id

Retrieves a specific goal by its ID.

**Response:**
- **200 OK:** `Goal`

### DELETE /:id

Deletes a specific goal by its ID.

**Response:**
- **200 OK:** `{ "message": "Goal deleted Successfully" }`
- **404 Not Found:** `{ "message": "Goal not Found" }`

### POST /

Creates a new goal.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "parentId": "number" (optional),
  "type": "'SHORT' | 'LONG'",
  "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
  "priority": "number",
  "deadline": "string" (ISO 8601 format)
}
```

**Response:**
- **200 OK:** `{ "message": "Goal added successfully" }`

### PUT /:id

Updates an existing goal.

**Request Body:** (Same as POST /)

**Response:**
- **200 OK:** `{ "message": "Goal Updated Successfully" }`

## Sessions Routes

Base Path: `/api/sessions`

### GET /

Retrieves all sessions for the authenticated user.

**Response:**
- **200 OK:** `[Session]`

### GET /:id

Retrieves a specific session by its ID.

**Response:**
- **200 OK:** `Session`

### DELETE /:id

Deletes a specific session by its ID.

**Response:**
- **200 OK:** `{ "message": "Session deleted Successfully" }`
- **404 Not Found:** `{ "message": "Session not Found" }`

### POST /

Creates a new session.

**Request Body:**
```json
{
  "targetType": "'task' | 'subtask'",
  "targetId": "number" (optional),
  "startTime": "string" (ISO 8601 format),
  "endTime": "string" (ISO 8601 format, optional),
  "duration": "number" (in minutes, optional),
  "isPomodoro": "boolean" (optional),
  "completed": "boolean"
}
```

**Response:**
- **200 OK:** `Session`
- **409 Conflict:** `{ "message": "An active session is already in progress." }`

### PATCH /:id/cancel

Cancels a session.

**Response:**
- **200 OK:** `{ "session": Session }`
- **404 Not Found:** `{ "message": "Invalid Session ID" }`

### PATCH /:id/completed

Marks a session as completed and updates user streak if applicable.

**Request Body:**
```json
{
  "completed": "boolean"
}
```

**Response:**
- **200 OK:** `{ "session": Session }`
- **404 Not Found:** `{ "message": "Invalid Session ID" }`

## Tasks Routes

Base Path: `/api/tasks`

### GET /

Retrieves all tasks for the authenticated user.

**Response:**
- **200 OK:** `[Task]`

### GET /:id

Retrieves a specific task by its ID, including its subtasks.

**Response:**
- **200 OK:** `Task` (with subtasks)

### DELETE /:id

Deletes a specific task by its ID.

**Response:**
- **200 OK:** `{ "message": "Task deleted Successfully" }`
- **404 Not Found:** `{ "message": "Task not Found" }`

### POST /

Creates a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string" (optional),
  "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
  "priority": "number",
  "deadline": "string" (ISO 8601 format),
  "goalId": "number" (optional)
}
```

**Response:**
- **200 OK:** `{ "message": "Task added successfully" }`

### PUT /:id

Updates an existing task.

**Request Body:** (Same as POST /)

**Response:**
- **200 OK:** `{ "task": Task }`

### Subtasks

Base Path: `/api/tasks/:taskID/subtasks`

- **GET /:subtaskID:** Get a specific subtask.
- **POST /**: Add a subtask.
  **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'",
    "priority": "number",
    "deadline": "string" (ISO 8601 format)
  }
  ```
- **PUT /:id:** Update a subtask.
  **Request Body:** (Same as POST /)
- **DELETE /:id:** Delete a subtask.
- **PATCH /:id/status:** Update a subtask's status.
  **Request Body:**
  ```json
  {
    "status": "'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED'"
  }
  ```

## Users Routes

Base Path: `/api/users`

### GET /me

Retrieves the authenticated user's profile.

**Response:**
- **200 OK:** `User`

### PUT /me

Updates the authenticated user's profile.

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string"
}
```

**Response:**
- **200 OK:** `User`
