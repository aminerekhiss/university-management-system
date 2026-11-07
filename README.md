# University Management System

A university management system with an Angular frontend and a Laravel REST API. It provides role-based workflows for students, staff, and administrators.

## Features

- **Students:** manage a profile, view tuition invoices and payment history, make payments, and view an overview.
- **Staff:** manage tuition invoices, payroll, department budgets, and budget transactions; view payroll and budget reports.
- **Administrators:** manage users and departments, assign staff, update salaries, and manage budgets.
- **Authentication:** public registration and login, with authenticated API routes protected by Laravel Sanctum and role middleware.

## Project structure

```text
uas-backend/    Laravel API and application server
uas-frontend/   Angular single-page application
```

## Requirements

- PHP 8.2 or later
- Composer
- MySQL (or another database supported by Laravel)
- Node.js and npm compatible with Angular 21

## Getting started

### 1. Configure and run the backend

In a terminal, from the repository root:

```bash
cd uas-backend
composer install
```

Create the local environment file:

```bash
cp .env.example .env
```

On Windows Command Prompt, use `copy .env.example .env` instead. Set the database connection values in `uas-backend/.env` to match a database you have created. The example configuration uses MySQL and a database named `uas_db`.

Generate the application key, run the migrations, and start Laravel:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

The API is available at `http://localhost:8000/api`.

### 2. Run the frontend

In a second terminal, from the repository root:

```bash
cd uas-frontend
npm install
npm start
```

Open `http://localhost:4200`. The development frontend uses `http://localhost:8000/api` for API requests. The backend's CORS configuration allows the Angular development origin at `http://localhost:4200`.

## Production build

From `uas-frontend`, run:

```bash
npm run build
```

The Angular production build is written to `uas-backend/public`. The production frontend is configured to send API requests to `/api`, so serve the built frontend through the Laravel application and web server under the same origin.

## API overview

All endpoints are prefixed with `/api`.

| Area | Example endpoints | Access |
| --- | --- | --- |
| Authentication | `POST /login`, `POST /register`, `POST /logout`, `GET /me` | Login and registration are public; the others require authentication |
| Student | `/student/profile`, `/student/invoices`, `/student/payments`, `/student/overview`, `POST /student/pay` | Student role |
| Staff | `/staff/invoices`, `/staff/payroll`, `/staff/budgets` | Staff role |
| Administration | `/admin/users`, `/admin/departments`, `/admin/staff`, `/admin/budgets` | Admin role; department and staff directory GET endpoints are public |

Protected endpoints require a valid authenticated session/token. Refer to `uas-backend/routes/api.php` for the full endpoint list and HTTP methods.

## Tests

Run backend tests from `uas-backend`:

```bash
php artisan test
```

Run frontend tests from `uas-frontend`:

```bash
npm test
```
