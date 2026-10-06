# CodeReviewer AI - Intelligent Code Analysis & Review Platform

<div align="center">

![CodeReviewer AI Logo](https://img.shields.io/badge/CodeReviewer-AI-FF5722?style=for-the-badge&logo=codeforces&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Render](https://img.shields.io/badge/Render-Hosted-46E3B7?style=for-the-badge&logo=render&logoColor=white)

A full-stack, production-grade AI code analysis platform powered by **Google Gemini AI**. CodeReviewer AI provides real-time intelligent programming language auto-detection, Big-O algorithmic complexity analysis, automated bug debugging, code quality scoring, and secure **Authentication & Authorization** hosted on **Render**.

[Live Demo](https://code-reviewer-ai-1-vpic.onrender.com) • [Report Bug](https://github.com/Yash-2808/Code-Reviewer-AI/issues) • [Request Feature](https://github.com/Yash-2808/Code-Reviewer-AI/issues)

</div>

---

## ✨ Key Features

- ⚡ **Real-Time Language Auto-Detection**:
  - Automatically identifies programming languages as you type or paste code into the editor.
  - Supports **C / C++**, **Python**, **Java**, **C#**, **TypeScript**, **JavaScript**, **HTML**, **CSS**, **SQL**, **PHP**, **Ruby**, **JSON**, and **XML**.
  - Dynamically updates Ace Editor syntax highlighting and sets the conversion source.

- 📐 **Big-O Algorithmic Complexity & Architecture Audit**:
  - ⏱️ **Time Complexity**: Evaluates loop bounds, nested iterations, and recursion (e.g., `O(1)`, `O(n)`, `O(n log n)`, `O(n²)`).
  - 💾 **Space Complexity**: Evaluates auxiliary heap memory, stack frames, and buffer allocations (e.g., `O(1) Auxiliary`, `O(n) Memory`).
  - 📊 **Code Health Metrics**: Computes **Cyclomatic Complexity** and **Maintainability Index**.
  - 🎯 **5-Category Quality Rubric**: Scores **Readability**, **Efficiency**, **Security**, **Best Practices**, and **Scalability** (0–10 each).
  - 🚀 **Optimized Code Refactoring**: Generates production-ready refactored solutions with 1-click copy.

- 🐛 **AI Code Debugger**:
  - In-depth detection of logical bugs, syntax errors, and runtime edge cases.
  - Color-coded severity badges (*High / Medium / Low*) and line-number pinpointing.
  - Automated patch generation and markdown explanations.

- 🔄 **AI Code Converter**:
  - Cross-language code translation preserving logic, variable conventions, and idiomatic language patterns.

- 🔐 **Authentication & Security**:
  - **bcryptjs** password hashing (12 salt rounds).
  - Stateless **JWT (JSON Web Token)** Bearer token authorization.
  - Role-based access control (`user` and `admin` roles).
  - Strict user data isolation — reviews and history are isolated per user account.

- 📊 **Developer Dashboard & Private Review History**:
  - Personal analytics, review counters, quality score averages, and recent activity cards.
  - Searchable and filterable history archive with detail modal views.

- 🎨 **Modern 3D Cyber Theme**:
  - Dark obsidian interface (`#040612`), vibrant sunset-to-violet gradient glows, 3D volumetric code emblems, and responsive split-panel layouts.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Chakra UI + Emotion
- **Routing**: React Router v7
- **Code Editor**: React Ace (Ace Builds)
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios (with Bearer token & `x-api-key` interceptors)
- **Icons & Animations**: React Icons, Framer Motion

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas / MongoDB Compass via Mongoose ODM
- **Security**: bcryptjs, JSON Web Tokens (`jsonwebtoken`), CORS, dotenv
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Hosting**: Render (Single-Service Monorepo Deployment with static SPA fallback)

---

## 📁 Project Structure

```
Code-Reviewer-AI/
├── frontend/                        # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Central Axios client with dynamic baseURL & interceptors
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx      # Ace code editor wrapper with theme & language selectors
│   │   │   ├── Footer.jsx          # Futuristic footer
│   │   │   ├── Logo.jsx            # 3D volumetric < / > vector emblem
│   │   │   ├── Navbar.jsx          # Header with user menu & navigation
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated views
│   │   ├── constants/
│   │   │   └── index.js            # Language definitions & detectLanguage engine
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Personal statistics & recent review cards
│   │   │   ├── History.jsx         # Searchable & filterable review records
│   │   │   ├── Login.jsx           # Glowing cyber authentication view
│   │   │   ├── Profile.jsx         # User account settings & API key overrides
│   │   │   ├── Register.jsx        # Account registration view
│   │   │   └── Studio.jsx          # Main AI Code Studio (Convert, Debug, Quality)
│   │   ├── App.jsx                 # Application layout & routing definitions
│   │   ├── main.jsx                # React DOM entry point
│   │   └── theme.js                # Chakra UI custom dark cyber theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                         # Express REST API
│   ├── config/
│   │   └── db.js                   # Mongoose MongoDB connection & error handler
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Current User profile
│   │   └── reviewController.js     # AI endpoints, History, Stats, Deletion
│   ├── middleware/
│   │   ├── adminMiddleware.js      # Admin authorization guard
│   │   └── authMiddleware.js       # JWT validation & user attachment
│   ├── models/
│   │   ├── Review.js               # Review schema with userId reference
│   │   └── User.js                 # User schema with bcrypt pre-save hash
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin-only endpoints (/api/admin)
│   │   ├── authRoutes.js           # Auth routes (/api/auth)
│   │   └── reviewRoutes.js         # Review routes (/api/reviews, /convert, /debug, /codeQuality)
│   ├── services/
│   │   └── geminiService.js        # Gemini AI integration with model fallback
│   ├── index.js                    # Express server entry with static SPA file serving
│   ├── .env.example                # Example environment template
│   └── package.json
│
└── package.json                    # Root workspace script runner
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or **MongoDB Atlas** Cloud Cluster.
- **Google Gemini API Key**: Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Yash-2808/Code-Reviewer-AI.git
cd Code-Reviewer-AI
npm run install-all
```

### 3. Backend Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/code_reviewer_ai?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Running Locally
Start both backend and frontend development servers concurrently:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`

---

## 🌐 Deploying to Render

This repository is pre-configured for single-service monorepo deployment on **Render**:

1. Create a new **Web Service** on [Render](https://render.com) and connect your GitHub repository.
2. Configure the build settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. Add the following **Environment Variables** in Render's `Environment` tab:

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `JWT_SECRET` | A secure random string for JWT token signatures |
| `NODE_ENV` | `production` |

4. Click **Deploy**. Render will automatically build the Vite frontend bundle, start the Express backend, and serve the full application.

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
| `POST` | `/convert` | Convert source code between programming languages | Bearer Token |
| `POST` | `/debug` | Debug code and receive actionable bug breakdowns | Bearer Token |
| `POST` | `/codeQuality` | Generate quality scores, Big-O complexity, rubrics, and suggestions | Bearer Token |
| `GET` | `/api/reviews` | List current user's paginated review history | Bearer Token |
| `GET` | `/api/reviews/stats` | Retrieve aggregate statistics for user dashboard | Bearer Token |
| `GET` | `/api/reviews/:id` | Fetch specific review by ID (User ownership enforced) | Bearer Token |
| `DELETE` | `/api/reviews/:id` | Delete specific review (User ownership enforced) | Bearer Token |

### 🛡️ Admin Operations (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | System-wide statistics (total users, total reviews) | Admin Token |
| `GET` | `/api/admin/users` | List all registered users | Admin Token |

---

## 🛡️ Security & Privacy
- **Password Security**: Passwords are encrypted using `bcryptjs` with 12 salt rounds before persisting to MongoDB.
- **Data Isolation**: All review documents are strictly tied to the owner's `userId`. Unauthorized cross-account access attempts return `403 Forbidden`.
- **JWT Protection**: Protected routes validate Bearer tokens on every request. Expired or forged tokens return `401 Unauthorized`.
- **Safe Environment Handling**: Sensitive API keys and connection strings are managed strictly via environment variables and gitignored.

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
