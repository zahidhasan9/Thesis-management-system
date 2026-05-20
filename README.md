# 📚 Thesis Management System

A full-stack MERN web application for managing university thesis submission, supervisor review, evaluator marking, third evaluation, and administrative monitoring through role-based dashboards.

---

## 1. Title

# Thesis Management System

**Thesis Management System** is a role-based academic thesis management platform built with the MERN stack. It helps students, supervisors, evaluators, third evaluators, and administrators manage the complete thesis workflow digitally.

---

## 2. Overview

The **Thesis Management System** is designed to simplify and organize the academic thesis submission and evaluation process in a university or department.

In many academic institutions, thesis submission, supervisor review, evaluator marking, and administrative monitoring are handled manually or through scattered communication. This creates problems such as delayed review, missing documents, lack of status tracking, and difficulty managing evaluator marks.

This project solves these problems by providing a centralized web-based platform where:

- Students can upload thesis documents and track their submission status.
- Supervisors can review thesis submissions and provide feedback.
- Evaluators can view accepted thesis and submit marks.
- Third evaluators can submit additional marks when needed.
- Admins can manage users, roles, thesis records, and dashboard statistics.

The system is developed using the **MERN Stack**:

- **MongoDB** for database management
- **Express.js** for backend REST API
- **React.js** for frontend interface
- **Node.js** for server-side runtime

---

## 3. Objectives

The main objectives of this project are:

- To develop a centralized platform for academic thesis management.
- To reduce manual thesis submission and review processes.
- To allow students to upload thesis PDF files digitally.
- To allow students to track thesis status from their dashboard.
- To help supervisors review, accept, or decline thesis submissions.
- To allow evaluators and third evaluators to submit thesis marks.
- To provide admins with user, role, thesis, and dashboard management features.
- To improve transparency, organization, and efficiency in the thesis workflow.
- To create a secure role-based system for academic users.

---

## 4. Technology Stack

### Frontend Technologies

| Technology | Purpose |
|---|---|
| React.js | Building the frontend user interface |
| Vite | Fast frontend development and build tool |
| Tailwind CSS | Responsive and modern UI styling |
| Material UI | Ready-made UI components |
| React Router DOM | Frontend routing and protected pages |
| Axios | API request handling |
| Recharts | Dashboard charts and data visualization |
| Sonner | Toast notifications |
| Lucide React | Icons |
| jsPDF | PDF/report generation support |

### Backend Technologies

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Backend REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB schema and model management |
| JWT | User authentication |
| bcryptjs | Password hashing |
| Multer | Thesis PDF upload |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin request handling |
| Helmet | Backend security headers |
| Morgan | API request logging |
| dotenv | Environment variable management |

---

## 5. Features

### Authentication and Authorization

- User registration
- User login
- User logout
- JWT-based authentication
- HTTP-only cookie-based session handling
- Password hashing using bcryptjs
- Role-based access control
- Protected frontend routes
- Protected backend API routes

### Student Features

- Upload thesis PDF
- View own thesis list
- Track thesis status
- View supervisor feedback
- View thesis details
- Browse recent thesis library
- Search and filter thesis library
- Download thesis PDF
- Update student profile
- Delete thesis when allowed

### Supervisor Features

- View thesis submissions
- Review pending thesis
- Accept thesis
- Decline thesis
- Add supervisor note or feedback
- View thesis details
- Update supervisor profile

### Evaluator Features

- View accepted thesis
- View thesis details
- Submit thesis marks
- Submit feedback where applicable
- Update evaluator profile

### Third Evaluator Features

- View thesis requiring third evaluation
- Submit third evaluator mark
- Support final thesis evaluation workflow

### Admin Features

- View admin dashboard
- View total users and thesis statistics
- View chart data
- Manage all users
- Update user roles
- Delete users
- View all thesis records
- View pending thesis submissions
- View thesis details
- Delete thesis records

---

## 6. User Roles

| Role | Description |
|---|---|
| Student | Uploads thesis, tracks thesis status, views feedback, and manages profile |
| Supervisor | Reviews thesis submissions, accepts/declines thesis, and gives feedback |
| Evaluator | Reviews accepted thesis and submits evaluation marks |
| Third Evaluator | Provides third evaluation marks when required |
| Admin | Manages users, roles, thesis records, and dashboard statistics |

---

## 7. Thesis Workflow

```text
Student Registration/Login
        ↓
Student Uploads Thesis PDF
        ↓
Thesis Status: Pending
        ↓
Supervisor Reviews Thesis
        ↓
Accepted or Declined
        ↓
If Accepted, Evaluator Reviews Thesis
        ↓
Evaluator Submits Mark
        ↓
Third Evaluation, if required
        ↓
Final Mark / Completed Status
```

### Workflow Explanation

1. A student registers and logs into the system.
2. The student uploads a thesis PDF with necessary details.
3. The thesis status becomes `pending`.
4. A supervisor reviews the submitted thesis.
5. The supervisor can accept or decline the thesis.
6. If accepted, the thesis becomes available for evaluator review.
7. The evaluator submits marks.
8. If needed, a third evaluator submits an additional mark.
9. The thesis evaluation process is completed.

---

## 8. Folder Structure

```bash
Thesis-management-system/
│
├── Back-End/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── evaluatorController.js
│   │   ├── studentController.js
│   │   └── supervisorController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Evaluation.js
│   │   ├── Thesis.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── evaluatorRoutes.js
│   │   ├── studentRoutes.js
│   │   └── supervisorRoutes.js
│   │
│   ├── uploads/
│   │   └── Uploaded thesis PDF files
│   │
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── Front-End/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── evaluator/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── evaluator/
│   │   │   ├── homepage/
│   │   │   ├── student/
│   │   │   └── supervisor/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── screenshots/
│   ├── home.png
│   ├── login.png
│   ├── register.png
│   ├── student-dashboard.png
│   ├── supervisor-dashboard.png
│   ├── evaluator-dashboard.png
│   ├── admin-dashboard.png
│   └── thesis-details.png
│
├── .gitignore
└── README.md
```

---

## 9. Folder Description

| Folder/File | Description |
|---|---|
| `Back-End/` | Contains the backend REST API built with Express.js |
| `Front-End/` | Contains the frontend application built with React.js |
| `config/` | Contains database connection and configuration files |
| `controllers/` | Contains request handling and business logic |
| `middleware/` | Contains authentication, role authorization, and upload middleware |
| `models/` | Contains MongoDB/Mongoose schemas |
| `routes/` | Contains API route definitions |
| `uploads/` | Stores uploaded thesis PDF files |
| `utils/` | Contains helper or utility functions |
| `app.js` | Main Express app configuration file |
| `server.js` | Starts backend server and connects database |
| `src/api/` | Contains Axios API configuration |
| `src/assets/` | Contains frontend static assets |
| `src/components/` | Contains reusable React components |
| `src/pages/` | Contains role-based page components |
| `App.jsx` | Contains frontend route configuration |
| `main.jsx` | React application entry point |
| `screenshots/` | Stores project screenshots used in README |
| `.gitignore` | Prevents unnecessary/sensitive files from being committed |
| `README.md` | Main project documentation |

---

## 10. API Routes Overview

Base API URL:

```bash
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user and create authentication token |
| `POST` | `/api/auth/logout` | Logout user and clear authentication cookie |

### Student Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/student/upload` | Upload thesis PDF |
| `GET` | `/api/student/my-thesis` | Get logged-in student's thesis list |
| `GET` | `/api/student/recent-thesis` | Get recent accepted/completed thesis library |
| `GET` | `/api/student/thesis/:id` | Get single thesis details |
| `DELETE` | `/api/student/thesis/:id` | Delete thesis if allowed |
| `GET` | `/api/student/profile` | Get student profile |
| `PATCH` | `/api/student/profile` | Update student profile |

### Supervisor Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/supervisor/thesis` | Get thesis submissions for supervisor |
| `PATCH` | `/api/supervisor/review` | Review thesis and update status |
| `GET` | `/api/supervisor/thesis/:id` | Get single thesis details |
| `GET` | `/api/supervisor/profile` | Get supervisor profile |
| `PATCH` | `/api/supervisor/profile` | Update supervisor profile |

### Evaluator Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/evaluator/submit-mark` | Submit evaluator mark |
| `POST` | `/api/evaluator/submit-third-mark` | Submit third evaluator mark |
| `GET` | `/api/evaluator/pending-third` | Get thesis list pending third evaluation |
| `GET` | `/api/evaluator/accepted` | Get accepted thesis list |
| `GET` | `/api/evaluator/thesis/:id` | Get single thesis details |
| `GET` | `/api/evaluator/profile` | Get evaluator profile |
| `PATCH` | `/api/evaluator/profile` | Update evaluator profile |

### Admin Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Get all users |
| `GET` | `/api/admin/stats` | Get admin dashboard statistics |
| `GET` | `/api/admin/chart` | Get chart data |
| `GET` | `/api/admin/pending-thesis` | Get pending thesis list |
| `PATCH` | `/api/admin/users/:id` | Update user role |
| `DELETE` | `/api/admin/users/:id` | Delete user |
| `GET` | `/api/admin/thesis` | Get all thesis records |
| `GET` | `/api/admin/thesis/:id` | Get single thesis details |
| `DELETE` | `/api/admin/thesis/:id` | Delete thesis record |

---

## 11. Database Models

### User Model

The `User` model stores user-related information and authentication details.

Main fields:

- Name
- Email
- Phone
- ID number
- Department
- Batch
- Section
- Position
- Password
- Bio
- Role
- Session

User roles include:

```js
student
supervisor
evaluator
third_evaluator
admin
```

### Thesis Model

The `Thesis` model stores thesis submission, review, and evaluation-related information.

Main fields:

- Thesis title
- Student reference
- Supervisor reference
- PDF file path
- Thesis status
- Supervisor note
- Evaluator marks
- Third evaluator mark
- Description
- Final mark
- Created time
- Updated time

Thesis status may include:

```js
pending
accepted
declined
completed
```

### Evaluation Model

The `Evaluation` model stores evaluator marking information.

Main fields:

- Thesis reference
- Evaluator reference
- Mark
- Feedback
- Created time
- Updated time

---

## 12. Installation and Setup

### Prerequisites

Before running this project, make sure these are installed:

- Node.js
- npm
- Git
- MongoDB Atlas or local MongoDB

Check installation:

```bash
node -v
npm -v
git --version
```

### Clone the Repository

```bash
git clone https://github.com/zahidhasan9/Thesis-management-system.git
cd Thesis-management-system
```

### Backend Setup

Go to backend folder:

```bash
cd Back-End
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `Back-End` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run backend server:

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

### Frontend Setup

Open another terminal and go to frontend folder:

```bash
cd Front-End
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the `Front-End` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## 13. Screenshots

Add project screenshots inside the `screenshots/` folder.

Recommended screenshot names:

```bash
screenshots/home.png
screenshots/login.png
screenshots/register.png
screenshots/student-dashboard.png
screenshots/upload-thesis.png
screenshots/supervisor-dashboard.png
screenshots/evaluator-dashboard.png
screenshots/admin-dashboard.png
screenshots/thesis-details.png
```

### Screenshot Preview

| Home Page | Student Dashboard |
|---|---|
| ![Home Page](screenshots/home.png) | ![Student Dashboard](screenshots/student-dashboard.png) |

| Supervisor Dashboard | Evaluator Dashboard |
|---|---|
| ![Supervisor Dashboard](screenshots/supervisor-dashboard.png) | ![Evaluator Dashboard](screenshots/evaluator-dashboard.png) |

| Admin Dashboard | Thesis Details |
|---|---|
| ![Admin Dashboard](screenshots/admin-dashboard.png) | ![Thesis Details](screenshots/thesis-details.png) |

---

## 14. Security Notes

Before publishing or deploying this project, follow these security practices:

- Do not commit `.env` files.
- Do not commit `node_modules`.
- Do not commit real database credentials.
- Do not commit JWT secret keys.
- Do not commit uploaded thesis PDF files.
- Use strong JWT secret.
- Use environment variables for sensitive data.
- Use HTTPS in production.
- Use secure cookies in production.
- Configure CORS properly for production frontend URL.
- Rotate MongoDB URI and JWT secret if they were exposed publicly.
- Validate user input before saving data.
- Restrict uploaded files to PDF only.
- Add rate limiting for authentication routes in production.

Recommended `.gitignore`:

```gitignore
node_modules/
.env
.env.*
dist/
build/

Back-End/node_modules/
Front-End/node_modules/

Back-End/.env
Front-End/.env

Back-End/uploads/*
!Back-End/uploads/.gitkeep

.DS_Store
Thumbs.db
.vscode/
```

If `.env` or `node_modules` were already pushed to GitHub, remove them from Git tracking:

```bash
git rm --cached Back-End/.env
git rm -r --cached Back-End/node_modules
git add .
git commit -m "chore: remove sensitive and dependency files"
git push
```

---

## 15. Testing Checklist

Use the following checklist to test the system manually:

### Authentication Testing

- [ ] Register a new user
- [ ] Login with valid credentials
- [ ] Reject login with wrong password
- [ ] Logout user
- [ ] Prevent unauthorized dashboard access

### Student Testing

- [ ] Login as student
- [ ] Upload thesis PDF
- [ ] View uploaded thesis list
- [ ] View thesis details
- [ ] Check thesis status
- [ ] View supervisor note
- [ ] Browse thesis library
- [ ] Download thesis PDF
- [ ] Update student profile
- [ ] Delete thesis when allowed

### Supervisor Testing

- [ ] Login as supervisor
- [ ] View thesis submissions
- [ ] View thesis details
- [ ] Accept thesis
- [ ] Decline thesis
- [ ] Add supervisor feedback
- [ ] Update supervisor profile

### Evaluator Testing

- [ ] Login as evaluator
- [ ] View accepted thesis
- [ ] View thesis details
- [ ] Submit evaluator mark
- [ ] Update evaluator profile

### Third Evaluator Testing

- [ ] Login as third evaluator
- [ ] View pending third evaluation thesis
- [ ] Submit third evaluator mark

### Admin Testing

- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] View all users
- [ ] Update user roles
- [ ] Delete test user
- [ ] View all thesis records
- [ ] View pending thesis
- [ ] View thesis details
- [ ] Delete test thesis record

---

## 16. Future Improvements

Planned and recommended future improvements:

- Admin approval system for newly registered users
- Auto-delete inactive accounts after 15 days
- Email notification system
- Evaluator assignment system
- Secure PDF preview and download system
- Advanced thesis search and filtering
- Export thesis evaluation report as PDF
- Admin audit log
- Notification center
- Cloud storage for uploaded thesis PDFs
- Deployment on Vercel and Render
- API documentation with Swagger or Postman
- Unit testing
- Integration testing
- Better form validation
- Password reset feature
- Email verification
- Role-based analytics dashboard

---

## 17. Developer Info

**Developer:** Zahid Hasan  
**GitHub:** [@zahidhasan9](https://github.com/zahidhasan9)

### Project Repository

```bash
https://github.com/zahidhasan9/Thesis-management-system
```

### Project Status

This project is currently under active development. Core role-based thesis submission, supervisor review, evaluator marking, third evaluation, and admin management features are implemented.

---

## License

This project is open-source and available under the MIT License.
