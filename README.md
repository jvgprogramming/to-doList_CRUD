# Task Manager

A full-stack task management application with a **Laravel 13** API backend and a **Next.js 16** frontend.

## Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v3, Zustand, Axios |
| Backend  | Laravel 13, PHP 8.3+, Sanctum (token auth), MySQL |
| Tooling  | shadcn/ui components, React Hook Form, Zod |

## Project Structure

```
todo-app/
├── client/          # Next.js frontend (port 3000)
│   ├── app/         # App Router pages
│   ├── components/  # UI & feature components
│   ├── hooks/       # Custom React hooks
│   ├── services/    # API service layer
│   ├── store/       # Zustand state management
│   └── lib/         # Utilities & Axios config
├── server/          # Laravel API backend (port 8000)
│   ├── app/         # Controllers, Models, Policies
│   ├── routes/      # API route definitions
│   ├── database/    # Migrations & seeders
│   └── config/      # App configuration
└── README.md
```

## Prerequisites

- **Node.js** 20+
- **PHP** 8.3+
- **Composer** 2+
- **MySQL** (or SQLite for local development)
- **npm**, **pnpm**, or **yarn**

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Install Laravel dependencies
cd server
composer install

# Install Next.js dependencies
cd ../client
npm install
```

### 2. Configure the Backend

```bash
cd server

# Create .env file
cp .env.example .env

# Generate app key
php artisan key:generate
```

Edit `server/.env` and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo_app
DB_USERNAME=root
DB_PASSWORD=
```

Then run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed
```

### 3. Configure the Frontend

```bash
cd client

# Create .env.local (optional — defaults to http://localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 4. Run the Application

Open **two terminals**.

**Terminal 1 — Laravel API:**

```bash
cd server
php artisan serve
```

The API will be available at `http://localhost:8000`.

**Terminal 2 — Next.js frontend:**

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:3000`.

### 5. Usage

1. Open `http://localhost:3000` in your browser
2. Click **Sign up** to create an account
3. Start creating, editing, and managing tasks

## Authentication

This app uses **Laravel Sanctum** token-based authentication:

- Login/Register → returns a Bearer token
- Token is stored in `localStorage` and a cookie (for middleware protection)
- All subsequent API requests include the token via `Authorization: Bearer` header
- Route protection is handled server-side via Next.js middleware

## API Endpoints

| Method | Endpoint           | Auth Required | Description        |
| ------ | ------------------ | ------------- | ------------------ |
| POST   | `/api/register`    | No            | Register new user  |
| POST   | `/api/login`       | No            | Login              |
| POST   | `/api/logout`      | Yes           | Logout             |
| GET    | `/api/user`        | Yes           | Get current user   |
| GET    | `/api/tasks`       | Yes           | List tasks (paginated) |
| POST   | `/api/tasks`       | Yes           | Create a task       |
| GET    | `/api/tasks/{id}`  | Yes           | Get a task          |
| PUT    | `/api/tasks/{id}`  | Yes           | Update a task       |
| DELETE | `/api/tasks/{id}`  | Yes           | Delete a task       |
| GET    | `/api/statuses`    | Yes           | List task statuses  |

## Environment Variables

### Client (`client/.env.local`)

| Variable                | Default                    | Description              |
| ----------------------- | -------------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:8000`    | Laravel API base URL     |

### Server (`server/.env`)

| Variable              | Default                | Description              |
| --------------------- | ---------------------- | ------------------------ |
| `APP_URL`             | `http://localhost`     | App URL                  |
| `DB_CONNECTION`       | `mysql`                | Database driver          |
| `DB_DATABASE`         | `todo_app`             | Database name            |
| `SESSION_DRIVER`      | `database`             | Session storage driver   |
| `SANCTUM_STATEFUL_DOMAINS` | —                  | First-party domains      |
| `FRONTEND_URL`        | `http://localhost:3000` | CORS allowed origin      |
