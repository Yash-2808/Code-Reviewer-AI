# CodeReviewer AI - Intelligent Code Analysis & Review Platform

A full-stack, production-grade code analysis platform powered by **Google Gemini AI**. CodeReviewer AI provides real-time AI code conversion, debugging, and code quality scoring alongside a complete, secure, custom **Authentication & Authorization** system, private review histories, user dashboards, and role-based administration.

---

## ✨ Features

- 🔐 **Custom Authentication & Authorization**:
  - Secure registration & login with **bcryptjs** password hashing (12 salt rounds).
  - Stateless **JWT (JSON Web Token)** authentication (1-day expiration).
  - Role-based authorization (`user` and `admin` roles).
  - Complete user data isolation — users only see and manage their own history.
- ⚡ **AI-Powered Code Tools**:
  - **Code Conversion**: Seamlessly convert source code across languages.
  - **Code Debugger**: In-depth bug detection with line numbers, severity flags, detailed explanations, and automated fixes.
  - **Code Quality Assessment**: Detailed rubric scoring with actionable quality metrics.
  - Model resilience with multi-model fallback (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).
- 📊 **Personalized Dashboard & Statistics**:
  - Total reviews performed, conversion counts, debugging reports, and average code quality score.
  - Quick action shortcuts and recent activity feed.
- 📜 **Private Review History**:
  - Searchable, filterable review archive.
  - Detail modal inspection and single-click review deletion.
- 👤 **User Profile & Custom Gemini API Key**:
  - View account details, role badge, and registration timestamp.
  - Override server Gemini API keys on a per-user basis via `x-api-key`.
- 🎨 **Sleek Modern UI**:
  - Built with React 18, Chakra UI dark/cyber theme, Framer Motion animations, and Ace Code Editor with multiple syntax modes & themes.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Chakra UI + Emotion
- **Routing**: React Router v6
- **Code Editor**: React Ace
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios with JWT Bearer & `x-api-key` interceptors
- **Icons & Animations**: React Icons, Framer Motion

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs, JSON Web Tokens (`jsonwebtoken`), CORS, dotenv
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)

---

## 📁 Project Structure

```
Code-Reviewer-AI/
├── frontend/                        # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Central Axios client with token interceptors
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx      # React Ace editor wrapper
│   │   │   ├── Footer.jsx          # App footer
│   │   │   ├── Logo.jsx            # Cyber `< / >` vector logo
│   │   │   ├── Navbar.jsx          # Header with user menu & navigation
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated views
│   │   ├── constants/
│   │   │   └── index.js            # Editor themes & language modes
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state provider (login, register, logout)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Personal statistics & activity overview
│   │   │   ├── History.jsx         # Searchable & filterable review records
│   │   │   ├── Login.jsx           # Sign in view
│   │   │   ├── Profile.jsx         # Account settings & stats
│   │   │   ├── Register.jsx        # Sign up view
│   │   │   └── Studio.jsx          # Main AI Code Studio (Convert, Debug, Quality)
│   │   ├── App.jsx                 # Route definitions & app layout
│   │   ├── main.jsx                # DOM mounting
│   │   └── theme.js                # Chakra UI custom dark theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                         # Express REST API
│   ├── config/
│   │   └── db.js                   # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Get Current User
│   │   └── reviewController.js     # AI endpoints, History, Stats, Deletion
│   ├── middleware/
│   │   ├── adminMiddleware.js      # Admin role authorization guard
│   │   └── authMiddleware.js       # JWT validation & req.user attachment
│   ├── models/
│   │   ├── Review.js               # Review schema with userId reference
│   │   └── User.js                 # User schema with bcrypt pre-save hash
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin-only endpoints
│   │   ├── authRoutes.js           # /api/auth endpoints
│   │   └── reviewRoutes.js         # /convert, /debug, /codeQuality, /api/reviews
│   ├── services/
│   │   └── geminiService.js        # Gemini API integration with model fallback
│   ├── index.js                    # Express app configuration & server entry
│   ├── .env                        # Environment variables (private)
│   ├── .env.example                # Example environment template
│   └── package.json
│
└── package.json                    # Monorepo root script runner
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection URI.
- **Google Gemini API Key**: Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone <repository-url>
cd CODE-REVIEWER
npm run install-all
```

### 3. Backend Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/code_reviewer_ai
JWT_SECRET=super_secret_jwt_key_code_reviewer_ai_2026_change_in_production
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Running the Application
Start both backend and frontend concurrently:
```bash
npm start
```

Or run them individually:
```bash
# Terminal 1: Backend (runs on http://localhost:8000)
npm run start:backend

# Terminal 2: Frontend (runs on http://localhost:5173)
npm run start:frontend
```

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Login with credentials and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Bearer Token |

### 🤖 AI Code Operations & Reviews
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/convert` | Convert code between languages | Bearer Token |
| `POST` | `/debug` | Debug code and receive bug breakdowns | Bearer Token |
| `POST` | `/codeQuality` | Generate quality scores and review reports | Bearer Token |
| `GET` | `/api/reviews` | List current user's paginated review history | Bearer Token |
| `GET` | `/api/reviews/stats` | Retrieve aggregate statistics for user dashboard | Bearer Token |
| `GET` | `/api/reviews/:id` | Fetch specific review by ID (Ownership enforced) | Bearer Token |
| `DELETE` | `/api/reviews/:id` | Delete specific review (Ownership enforced) | Bearer Token |

### 🛡️ Admin Operations (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | System-wide statistics (total users, total reviews) | Admin Token |
| `GET` | `/api/admin/users` | List all registered users | Admin Token |

---

## 👑 Creating an Admin User
To promote a user to `admin`, you can update the user document directly in MongoDB:
```javascript
// In mongosh or MongoDB Compass
use code_reviewer_ai;
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

---

## 🛡️ Security & Data Isolation
- **Password Security**: Passwords are hashed using `bcryptjs` with salt work factor 12. Plain passwords are never stored or returned.
- **Data Isolation**: Every review record stores a strict reference to `userId`. Endpoints check `review.userId.toString() === req.user.userId` before returning or deleting any review. Unauthorized cross-user requests receive a `403 Forbidden` response.
- **Token Handling**: Tokens are verified using Express middleware. Invalid or expired tokens receive a `401 Unauthorized` response.

---

## 📜 License
MIT License. Built for developers with ❤️ by the CodeReviewer AI team.
