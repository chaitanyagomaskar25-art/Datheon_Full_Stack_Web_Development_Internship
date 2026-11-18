# ⚡ Tasker — SaaS Productivity & Task Management Dashboard

A full-stack, production-grade productivity dashboard and task management application built with **React 18**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**. 

Featuring interactive Kanban boards, calendar scheduling, real-time reminder scheduling, dark/light theme switching, and secure JWT-based authentication.

---

## 📁 Project Architecture & Folder Structure

The project is structured into a clean decoupled monorepo with **`client`** (frontend) and **`server`** (backend):

```
Task_Manager/
├── client/                      # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/                  # Public static assets
│   ├── src/                     # React source code
│   │   ├── components/          # Reusable UI components (Kanban, Calendar, Modals, etc.)
│   │   ├── hooks/               # Custom React hooks (useAuth, useTasks, useNotifications, etc.)
│   │   ├── lib/                 # Utilities (datetime, stats, storage fallback, calendar)
│   │   ├── pages/               # Page components (WelcomePage, LoginPage, RegisterPage)
│   │   ├── services/            # Axios API client & endpoints
│   │   ├── App.jsx              # Main dashboard application shell
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Tailwind directives & custom design styles
│   │   └── types.js             # Data models & constants
│   ├── .env.example             # Example environment configuration for client
│   ├── eslint.config.js         # ESLint configuration
│   ├── index.html               # Vite HTML template
│   ├── jsconfig.json            # Path alias mapping (@/* -> src/*)
│   ├── package.json             # Frontend dependencies & scripts
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Tailwind CSS theme configuration
│   └── vite.config.js           # Vite configuration with API proxy
│
├── server/                      # Backend API (Node.js + Express + MongoDB)
│   ├── config/                  # Database connection setup (Mongoose)
│   ├── controllers/             # Request handlers (auth, tasks, notifications, users)
│   ├── middleware/              # Auth guard (JWT), input validation, error handlers
│   ├── models/                  # Mongoose Schemas (User, Task, Notification)
│   ├── routes/                  # Express API route declarations
│   ├── services/                # Background services (automated reminder scheduler)
│   ├── utils/                   # Helper functions (JWT generator)
│   ├── .env.example             # Example environment configuration for backend
│   ├── package.json             # Backend dependencies & scripts
│   └── server.js                # Express application entry point & server bootstrap
│
├── .gitignore                   # Global Git ignore rules
├── package.json                 # Root script runner for convenience
└── README.md                    # Project documentation
```

---

## ✨ Features

### 🖥️ Frontend (`client`)
- **Multiple Views**:
  - **List View**: Categorized, priority-badged task items with inline completion toggle and delete actions.
  - **Kanban Board**: Drag-and-drop or categorized column layout grouped by Status (*To Do, In Progress, Completed*) or Priority (*High, Medium, Low*).
  - **Calendar View**: Visual month calendar displaying scheduled deadlines with date selection.
- **Interactive Dashboard Metrics**:
  - Completion progress bar and task statistics.
  - Quick insights (upcoming deadlines, overdue alerts, tasks due today).
- **Advanced Filtering & Search**:
  - Filter by category (*Work, Personal, Study, Health, Finance*).
  - Filter by priority (*High, Medium, Low*).
  - Instant live text search.
- **Notifications & Reminders**:
  - Slide-out notification center with read/unread tracking and clear all.
  - Visual notification badge for upcoming/due reminders.
- **Theme & Ergonomics**:
  - Dark & Light mode toggle with automatic persistence.
  - Responsive layout for desktop and mobile screens.
  - Toast notifications and modal confirmations.
- **Hybrid Storage & Offline Resilience**:
  - Works seamlessly with backend API or falls back to local storage if running in guest/offline mode.

### ⚙️ Backend (`server`)
- **RESTful API**: Standardized JSON responses for all CRUD task operations, auth, and notifications.
- **Secure Authentication**:
  - Password hashing with `bcryptjs`.
  - JSON Web Tokens (JWT) stored in secure HTTP-only cookies and Authorization Bearer headers.
- **Automated Task Reminders**:
  - Background scheduler (`reminderScheduler.js`) scans for approaching deadlines and triggers in-app notifications.
- **Demo User Auto-Seeding**:
  - Automatically seeds a default demo user with pre-configured tasks upon initial database connection.
- **Security & Reliability**:
  - Input validation middleware and MongoDB ObjectId sanitization.
  - CORS configuration with origin whitelisting.
  - Centralized error handling and detailed health check endpoint (`/api/health`).

---

## 🚀 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Authentication** | JSON Web Tokens (JWT), Cookies, Bcrypt.js |
| **Tooling & Linter** | ESLint 9, PostCSS, Autoprefixer |

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a remote MongoDB Atlas URI.

---

### Step 1: Clone & Install Dependencies

From the project root:

```bash
# Install dependencies for both client and server in one command:
npm run install:all
```

Or install them individually:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

### Step 2: Configure Environment Variables

#### 1. Backend Configuration (`server/.env`)
Copy the example environment file inside `server`:

```bash
cd server
cp .env.example .env
```

Review or modify `server/.env`:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tasker_db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_tasker_saas_2026_secure
JWT_EXPIRES_IN=7d
```

#### 2. Frontend Configuration (`client/.env`)
Copy the example environment file inside `client`:

```bash
cd client
cp .env.example .env
```

Review `client/.env`:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Run the Application

You can start both frontend and backend using root commands or separate terminals:

#### Option A: Running from the Root Folder

```bash
# Terminal 1: Start Backend API server
npm run server

# Terminal 2: Start Frontend Vite development server
npm run client
```

#### Option B: Running Individually

```bash
# In server directory:
cd server
npm run dev

# In client directory:
cd client
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Demo User

If MongoDB is empty upon starting the server, the backend automatically seeds a demo user:

- **Email**: `demo@tasker.pro`
- **Password**: `password123`

You can log in directly with these credentials or register a new account on the register page.

---

## 📡 API Reference

All backend routes are prefixed with `/api`. Protected routes require a valid JWT token.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login with email and password | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |
| `POST` | `/api/auth/logout` | Invalidate cookie session & logout | No |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports query filters) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/:id` | Get details for a single task | Yes |
| `PUT` | `/api/tasks/:id` | Update task details | Yes |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task completion status | Yes |
| `DELETE`| `/api/tasks/:id` | Delete a single task | Yes |
| `POST` | `/api/tasks/reorder` | Update task ordering for drag-and-drop | Yes |
| `DELETE`| `/api/tasks` | Clear all tasks for current user | Yes |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notifications` | Get user notifications | Yes |
| `POST` | `/api/notifications/check` | Trigger manual check for due task reminders | Yes |
| `PATCH`| `/api/notifications/:id/read` | Mark single notification as read | Yes |
| `PATCH`| `/api/notifications/read-all` | Mark all notifications as read | Yes |
| `DELETE`| `/api/notifications/:id` | Delete a notification | Yes |
| `DELETE`| `/api/notifications` | Clear all notifications | Yes |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/me` | Get user profile and preferences | Yes |
| `PUT` | `/api/users/preferences`| Update user preferences (theme, categories) | Yes |

### System (`/api/health`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime, environment, and DB status | No |

---

## 📜 Available NPM Scripts

### Root (`Task_Manager/`)
- `npm run install:all` — Installs npm dependencies for both `client` and `server`.
- `npm run client` — Starts the frontend development server (`vite`).
- `npm run client:build` — Compiles and builds the frontend production bundle.
- `npm run client:lint` — Runs ESLint on frontend code.
- `npm run client:preview` — Previews the production build locally.
- `npm run server` — Runs the backend API with `nodemon` live-reload.
- `npm run server:start` — Runs the backend API with standard `node`.

### Client (`Task_Manager/client/`)
- `npm run dev` — Launch Vite dev server on port 5173.
- `npm run build` — Build production assets into `dist/`.
- `npm run lint` — Lint React/JS source files with ESLint.
- `npm run preview` — Locally preview the production build.

### Server (`Task_Manager/server/`)
- `npm run dev` — Launch Express API with nodemon on port 5000.
- `npm start` — Launch Express API with standard Node.js.

---

## 🔒 Security Best Practices Implemented
- **Password Security**: Passwords salted and hashed with `bcryptjs`.
- **JWT Protection**: Tokens issued with configurable expiry and sent via `httpOnly` secure cookies as well as Bearer headers.
- **CORS Guard**: Only configured client origins allowed to access sensitive endpoints.
- **Sanitized Outputs**: Sensitive user fields (like `password`) are automatically excluded in queries and responses.
