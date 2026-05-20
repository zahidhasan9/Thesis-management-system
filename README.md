# 📚 Thesis Management System

A full-stack MERN web application for managing university thesis submission, supervisor review, evaluator marking, third evaluation, and administrative monitoring through role-based dashboards.

---

## 🚀 Project Overview

The **Thesis Management System** is a complete academic thesis management platform designed to simplify and digitize the thesis workflow of a university, department, or academic institution.

This system allows students to upload thesis documents, supervisors to review submissions, evaluators to assign marks, and administrators to manage users, roles, thesis records, and dashboard statistics from one centralized platform.

The project is built using the **MERN Stack**: MongoDB, Express.js, React.js, and Node.js.

---

## 🎯 Project Objectives

- To reduce manual thesis submission and review work.
- To provide a centralized thesis management platform.
- To allow students to upload and track thesis status.
- To help supervisors review thesis submissions efficiently.
- To allow evaluators and third evaluators to submit marks.
- To give administrators full control over users, roles, thesis records, and dashboard data.
- To make the thesis management process more transparent, organized, and digital.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend UI development |
| Vite | Fast React development environment |
| Tailwind CSS | Responsive UI styling |
| Material UI | UI components |
| React Router DOM | Page routing |
| Axios | API request handling |
| Recharts | Dashboard charts |
| Sonner | Toast notifications |
| Lucide React | Icons |
| jsPDF | PDF/report support |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Backend REST API |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | PDF file upload |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin request handling |
| Helmet | Security middleware |
| Morgan | API request logging |

---

## ✨ Key Features

### 🔐 Authentication and Authorization

- User registration
- User login and logout
- JWT-based authentication
- HTTP-only cookie authentication
- Password hashing using bcrypt
- Role-based access control
- Protected frontend routes
- Protected backend API routes

---

### 👨‍🎓 Student Features

- Upload thesis PDF
- View submitted thesis list
- Track thesis status
- View supervisor feedback
- View thesis details
- Browse recent thesis library
- Download thesis PDF
- Update student profile
- Delete thesis when allowed

---

### 👨‍🏫 Supervisor Features

- View submitted thesis records
- Review pending thesis submissions
- Accept thesis
- Decline thesis
- Add supervisor note or feedback
- View thesis details
- Update supervisor profile

---

### 🧑‍⚖️ Evaluator Features

- View accepted thesis records
- View thesis details
- Submit evaluation marks
- Submit feedback where applicable
- Update evaluator profile

---

### 🧑‍⚖️ Third Evaluator Features

- View thesis requiring third evaluation
- Submit third evaluator marks
- Support final thesis evaluation process

---

### 🛡️ Admin Features

- View dashboard statistics
- View all users
- Update user roles
- Delete users
- View all thesis records
- View pending thesis submissions
- Delete thesis records
- View chart/statistical data
- Manage overall thesis workflow

---

## 👥 User Roles

| Role | Description |
|---|---|
| Student | Uploads thesis and tracks status |
| Supervisor | Reviews thesis submissions |
| Evaluator | Evaluates accepted thesis |
| Third Evaluator | Provides third evaluation when needed |
| Admin | Manages users, roles, thesis records, and statistics |

---

## 🔄 Thesis Workflow

```text
Student Uploads Thesis
        ↓
Thesis Status: Pending
        ↓
Supervisor Review
        ↓
Accepted / Declined
        ↓
Evaluator Mark Submission
        ↓
Third Evaluation, if required
        ↓
Final Evaluation / Completed
