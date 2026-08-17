import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/homepage/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegistrationForm from "./pages/auth/RegistrationForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyEmailSent from "./pages/auth/VerifyEmailSent";

import StudentDashboard from "./pages/student/StudentDashboard";
import UploadThesis from "./pages/student/UploadThesis";
import Profile from "./pages/student/Profile";
import StudentThesisDetails from "./pages/student/StudentThesisDetails";

import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import ReviewPage from "./pages/supervisor/Review";
import SupervisorProfile from "./pages/supervisor/SupervisorProfile";

import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard";
import ThesisEvaluationDetails from "./pages/evaluator/ThesisEvaluationDetails";
import EvaluatorProfile from "./pages/evaluator/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminThesisDetails from "./pages/admin/AdminThesisDetails";
import PublicResults from "./pages/public/PublicResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<PublicResults />} path="/results" />

        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<RegistrationForm accountType="student" />} path="/register/student" />
        <Route element={<RegistrationForm accountType="teacher" />} path="/register/teacher" />
        <Route element={<ForgotPassword />} path="/forgot-password" />
        <Route element={<ResetPassword />} path="/reset-password/:token" />
        <Route element={<VerifyEmail />} path="/verify-email/:token" />
        <Route element={<VerifyEmailSent />} path="/verify-email-sent" />

        <Route
          element={
            <ProtectedRoute
              roles={["evaluator", "supervisor", "third_evaluator"]}
            >
              <EvaluatorDashboard />
            </ProtectedRoute>
          }
          path="/evaluator"
        />

        <Route
          element={
            <ProtectedRoute
              roles={["evaluator", "supervisor", "third_evaluator"]}
            >
              <ThesisEvaluationDetails />
            </ProtectedRoute>
          }
          path="/evaluator/thesis/:id"
        />

        <Route
          element={
            <ProtectedRoute roles={["evaluator", "third_evaluator"]}>
              <EvaluatorProfile />
            </ProtectedRoute>
          }
          path="/evaluator/profile"
        />

        <Route
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
          path="/admin"
        />

        <Route
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminThesisDetails />
            </ProtectedRoute>
          }
          path="/admin/thesis/:id"
        />

        <Route
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
          path="/student"
        />

        <Route
          element={
            <ProtectedRoute roles={["student"]}>
              <UploadThesis />
            </ProtectedRoute>
          }
          path="/upload"
        />

        <Route
          element={
            <ProtectedRoute roles={["student"]}>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />

        <Route
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentThesisDetails />
            </ProtectedRoute>
          }
          path="/student/thesis/:id"
        />

        <Route
          element={
            <ProtectedRoute
              roles={["supervisor", "evaluator", "third_evaluator"]}
            >
              <SupervisorDashboard />
            </ProtectedRoute>
          }
          path="/supervisor"
        />

        <Route
          element={
            <ProtectedRoute
              roles={["supervisor", "evaluator", "third_evaluator"]}
            >
              <SupervisorProfile />
            </ProtectedRoute>
          }
          path="/supervisor/profile"
        />

        <Route
          element={
            <ProtectedRoute
              roles={["supervisor", "evaluator", "third_evaluator"]}
            >
              <ReviewPage />
            </ProtectedRoute>
          }
          path="/review/:id"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
