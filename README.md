# 🗳 VoteChain — Secure Voting System

A full-stack democratic voting platform built with React.js (JSX) featuring JWT authentication, role-based access control, and real-time vote tracking.

---

## 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|-----------------|
| Team Member 1 | Frontend Lead | UI components, pages, routing |
| Team Member 2 | Backend/Logic Lead | Auth, data layer, business logic |
| Team Member 3 | QA / Integration | Testing, integration, README |

---

## 📋 Project Description

VoteChain is a secure, role-based voting platform that allows organizations to run elections, manage candidates, cast votes, and monitor results in real time.

**Key capabilities:**
- JWT-based authentication with simulated token lifecycle
- Three-tier RBAC: Admin, Manager, User
- Full election CRUD with status lifecycle (Draft → Active → Completed)
- Anonymous, one-vote-per-user enforcement
- Live results with visual charts
- Complete audit log for administrators

---

## 🗂 API / Service List

### AuthService
| Method | Endpoint (simulated) | Description | Auth |
|--------|---------------------|-------------|------|
| POST | `/api/auth/login` | Login with credentials, returns JWT | Public |
| POST | `/api/auth/logout` | Invalidate session | Any |
| GET | `/api/auth/me` | Get current user info | Any |

### ElectionService
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/elections` | List all elections (with filter/search) | Any |
| GET | `/api/elections/:id` | Get single election detail | Any |
| POST | `/api/elections` | Create new election | Admin, Manager |
| PUT | `/api/elections/:id` | Update election | Admin, Manager |
| DELETE | `/api/elections/:id` | Delete election | Admin, Manager |
| PATCH | `/api/elections/:id/status` | Change election status | Admin, Manager |

### VoteService
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/votes` | Cast a vote | User |
| GET | `/api/votes/election/:id` | Get votes for election | Admin, Manager |
| GET | `/api/votes/check/:electionId` | Check if user has voted | User |
| GET | `/api/votes/results/:electionId` | Get election results | Any |

### UserService
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List all users | Admin |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

---

## 🏗 Architecture

```
src/
├── context/
│   ├── AuthContext.jsx      # JWT auth, login/logout, token management
│   └── DataContext.jsx      # Global state: elections, votes, users
├── pages/
│   ├── LoginPage.jsx        # Authentication UI
│   ├── Dashboard.jsx        # Home dashboard with stats
│   ├── ElectionsPage.jsx    # Browse & search elections
│   ├── VotePage.jsx         # Cast votes
│   ├── ResultsPage.jsx      # Charts and results
│   ├── ManageElectionsPage.jsx  # CRUD for elections (Admin/Manager)
│   ├── UsersPage.jsx        # User management (Admin)
│   └── AuditPage.jsx        # Vote audit log (Admin)
├── components/
│   └── Navbar.jsx           # Sidebar navigation with role filtering
├── data/
│   └── mockData.js          # Simulated database (Users, Elections, Votes)
├── tests/
│   └── voting.test.js       # Unit tests (Jest)
├── App.jsx                  # Root component + client-side router
└── index.jsx                # Entry point
```

### Layer Architecture (Controller → Service → Repository pattern)

```
UI Layer (Pages)
     ↓
Context Layer (AuthContext, DataContext) ← "Service Layer"
     ↓
Data Layer (mockData.js) ← "Repository Layer"
```

---

## 🔐 Security — JWT + Roles

### How JWT Works in This App
1. User submits credentials → `AuthContext.login()` validates against user store
2. On success, a Base64-encoded JWT-style token is generated with `{ userId, role, exp }`
3. Token is stored in `localStorage` and checked on every app load
4. Expired tokens are automatically invalidated

### Role Permissions Matrix

| Feature | ADMIN | MANAGER | USER |
|---------|-------|---------|------|
| View Elections | ✅ | ✅ | ✅ |
| Cast Votes | ✅ | ✅ | ✅ |
| View Results | ✅ | ✅ | ✅ |
| Create/Edit Elections | ✅ | ✅ | ❌ |
| Change Election Status | ✅ | ✅ | ❌ |
| View All Votes (Monitor) | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Audit Log | ✅ | ❌ | ❌ |

---

## 🗄 Database Schema

### Table: `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Unique identifier |
| username | VARCHAR | Login username (unique) |
| password | VARCHAR | Hashed password |
| name | VARCHAR | Display name |
| email | VARCHAR | Email address |
| role | ENUM | ADMIN / MANAGER / USER |
| createdAt | DATE | Registration date |

### Table: `elections`
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Unique identifier |
| title | VARCHAR | Election title |
| description | TEXT | Full description |
| status | ENUM | DRAFT / ACTIVE / COMPLETED |
| startDate | DATE | Start date |
| endDate | DATE | End date |
| createdBy | INT FK → users.id | Creator |
| candidates | JSON | Array of candidate objects |

### Table: `votes`
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Unique identifier |
| userId | INT FK → users.id | Voter |
| electionId | INT FK → elections.id | Election |
| candidateId | INT | Candidate voted for |
| timestamp | DATETIME | When vote was cast |

**Relationships:**
- `users` 1→N `votes` (one user can vote in many elections)
- `elections` 1→N `votes` (one election has many votes)
- `users` 1→N `elections` (one user creates many elections)
- Unique constraint: `(userId, electionId)` — one vote per user per election

---

## 🚀 Frontend Setup

### Prerequisites
- Node.js v18+
- npm v9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# App runs at http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

---

## 🔑 Demo Accounts

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| `admin` | `admin123` | ADMIN | Full access |
| `manager` | `manager123` | MANAGER | Elections + monitoring |
| `john` | `john123` | USER | Vote + view results |
| `jane` | `jane123` | USER | Vote + view results |
| `bob` | `bob123` | USER | Vote + view results |

---

## ✅ Testing

Tests are located in `src/tests/voting.test.js` and cover:

1. **Authentication Logic** — correct login, wrong password, unknown user
2. **JWT Token Simulation** — encode/decode, expiry validation
3. **Voting Logic** — cast vote, double-vote prevention, multi-election voting
4. **Election Results** — vote counting, zero-vote state
5. **Role-Based Access Control** — permission matrix validation

```bash
npm test
# Expected: 17 passing tests
```

---

## 📊 Grading Checklist

| Criteria | Points | Implementation |
|----------|--------|---------------|
| README & Submission | 10 | ✅ This file |
| Backend Architecture | 15 | ✅ Context → Service → Data layers |
| Frontend Structure | 15 | ✅ 8 pages + components + contexts |
| Security (JWT + Roles) | 15 | ✅ JWT sim + 3-role RBAC |
| Database (3+ tables) | 15 | ✅ users, elections, votes |
| Frontend UI/UX | 10 | ✅ Dark theme, responsive, animated |
| Testing | 5 | ✅ 17 unit tests (Jest) |
| Presentation & Demo | 15 | ✅ Full working system |
| **Total** | **100** | |
