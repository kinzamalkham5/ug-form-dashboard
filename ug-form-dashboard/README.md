# University of Faisalabad — U/G Form Submission Dashboard

A full-stack MERN application for students to submit semester-wise undergraduate
course/fee-voucher forms, and for admins to review, approve, or reject them.

> **Note on data:** the seeded programs/courses are **demo data for development
> only** — they do not represent the official University of Faisalabad curriculum.

## Features

**Student**
- Registration with Pakistani CNIC (`12345-1234567-1`) and phone (`03XXXXXXXXX`) format validation
- Secure login (JWT + bcrypt password hashing)
- Dashboard with submission stats (Total / Pending / Approved / Rejected) and recent activity
- Profile view/edit (CNIC and Student ID are locked)
- Step-based U/G Form: select semester → select courses → upload fee voucher → review & submit
- One active submission per semester (re-submission only after admin approval)
- Submitted Forms list with live status and rejection reason
- Change password

**Admin**
- Separate admin login
- Dashboard with system-wide stats
- Student directory with search + program/semester filters, drill-down profile view
- Full course CRUD (code, name, credit hours, semester, program)
- Submission review: view student info, selected courses, total credit hours, and voucher
  image; Approve, Reject (with required reason), or re-open a rejected submission for
  resubmission

**Security**
- JWT authentication with role embedded in the signed token (never trusted from the client)
- bcrypt password hashing, passwords never returned by the API
- helmet, CORS, rate limiting on auth routes
- Mongoose schema validation + centralized error handling with friendly messages
- Multer file-type/size validation for voucher uploads (JPG/PNG/JPEG/WEBP, max 5MB)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, React Hook Form + Zod, Axios, react-hot-toast |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Uploads | Multer (disk storage) |
| Security | helmet, cors, express-rate-limit |

## Folder Structure

```
ug-form-dashboard/
├── client/                    React + Vite frontend
│   ├── src/
│   │   ├── components/        layout, ui, ProtectedRoute
│   │   ├── context/           AuthContext
│   │   ├── pages/              one file per route
│   │   ├── services/           axios wrappers per API resource
│   │   └── utils/               zod validation schemas
├── server/                    Express + MongoDB backend
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/            auth, upload (multer), errorHandler
│   ├── models/                Student, Admin, Course, Submission
│   ├── routes/
│   ├── seed/seed.js
│   └── uploads/vouchers/      uploaded voucher images (created automatically)
├── .env.example
└── package.json               root scripts (installs/runs both apps)
```

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local `mongod`, or a MongoDB Atlas connection string)

## Installation

```bash
# from the project root
npm run install:all
```

This runs `npm install` inside both `server/` and `client/`.

## Environment Variables

Copy `.env.example` to `server/.env` (a working default is already in place for local
development) and adjust as needed:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ug_form_dashboard
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

- `MONGO_URI` — connection string for your MongoDB instance
- `JWT_SECRET` — long random string; **change this before any real deployment**
- `JWT_EXPIRES_IN` — token lifetime (e.g. `7d`, `12h`)
- `PORT` — backend port
- `CLIENT_URL` — used for the CORS allow-list

Never commit a real `.env` file with production secrets.

## MongoDB Setup

**Local:**
```bash
mongod --dbpath /path/to/your/data/dir
```

**Atlas (cloud):** create a free cluster, add your IP to the access list, and paste the
connection string into `MONGO_URI` (include the database name at the end of the path).

## Running the App

```bash
# from the project root — runs backend (nodemon) and frontend (vite) together
npm run dev
```

Or separately:
```bash
npm run dev --prefix server   # http://localhost:5000
npm run dev --prefix client   # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so the
frontend and backend talk to each other with no extra CORS configuration needed in dev.

## Seeding the Database

```bash
npm run seed
```

This creates:
- **1 admin account** — email: `admin@university.edu`, password: `Admin@123`
  *(change this password immediately in any non-local environment)*
- Demo courses for **BS Computer Science**, Semesters 1–4 (clearly flagged `isDemoData: true`)

## API Documentation

Base URL: `/api`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a student |
| POST | `/auth/login` | — | Student login → `{ token, student }` |
| POST | `/auth/admin/login` | — | Admin login → `{ token, admin }` |
| GET | `/auth/me` | Bearer | Current authenticated user |
| PUT | `/auth/change-password` | Bearer | Change password |

### Students
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/students/profile` | Student | Own profile |
| PUT | `/students/profile` | Student | Update name/phone (CNIC & Student ID locked) |
| GET | `/students/dashboard-stats` | Student | Stats + 5 most recent submissions |

### Courses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/courses?program=&semester=` | Any authenticated | List courses |
| GET | `/courses/:id` | Any authenticated | Single course |
| POST | `/courses` | Admin | Create course |
| PUT | `/courses/:id` | Admin | Update course |
| DELETE | `/courses/:id` | Admin | Delete course |

### Submissions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/submissions` | Student | Multipart: `semester`, `courseIds` (JSON array), `voucher` (file) |
| GET | `/submissions/my` | Student | Own submissions |
| GET | `/submissions/:id` | Student (own) / Admin | Single submission |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/dashboard-stats` | Admin | System-wide stats |
| GET | `/admin/students?search=&program=&semester=` | Admin | List/search students |
| GET | `/admin/students/:id` | Admin | Student + their submissions |
| GET | `/admin/submissions?status=&semester=&program=` | Admin | List/filter submissions |
| PUT | `/admin/submissions/:id/approve` | Admin | Approve |
| PUT | `/admin/submissions/:id/reject` | Admin | Reject — body: `{ reason }` |
| PUT | `/admin/submissions/:id/allow-resubmission` | Admin | Re-open a rejected submission for resubmission |

All protected routes require `Authorization: Bearer <token>`. Roles are read from the
signed JWT only — never from the request body/query — and enforced server-side via the
`protect` / `requireRole` middleware.

## Frontend Routes

```
/                          Landing page
/login                     Student login
/register                  Student registration
/admin/login                Admin login

/student/dashboard          (protected: student)
/student/profile
/student/form               U/G Form (semester → courses → voucher → review)
/student/submissions
/student/change-password

/admin/dashboard             (protected: admin)
/admin/students
/admin/courses
/admin/submissions
```

Accessing a student route while unauthenticated redirects to `/login` (and `/admin/*`
to `/admin/login`). Accessing a route for the wrong role shows an "Access denied"
screen rather than silently redirecting.

## Deployment Notes

- **Backend:** deploy `server/` to any Node host (Render, Railway, a VM, etc.). Set the
  environment variables above; use a real MongoDB Atlas URI and a strong `JWT_SECRET`.
  Uploaded vouchers are stored on local disk under `server/uploads/vouchers/` — if you
  deploy to an ephemeral filesystem (e.g. most serverless/PaaS free tiers), point this
  at persistent storage or swap the Multer disk storage for an object-storage adapter.
- **Frontend:** run `npm run build --prefix client` to produce a static `client/dist/`
  bundle, then serve it from any static host (Netlify, Vercel, Nginx). Update the API
  base URL (currently proxied via Vite in dev) to point at your deployed backend, and
  set `CLIENT_URL` on the backend to your deployed frontend origin for CORS.
- Always rotate `JWT_SECRET` and the seeded admin password before going live.
