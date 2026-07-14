// import { BrowserRouter, Routes, Route } from "react-router-dom"

// import Login from "./pages/auth/Login"
// import Register from "./pages/auth/Register"
// import ForgotPassword from "./pages/auth/ForgotPassword"
// import Home from "./pages/homepage/Home"

// import StudentDashboard from "./pages/student/StudentDashboard"
// import UploadThesis from "./pages/student/UploadThesis"
// import Profile from "./pages/student/Profile"
// import StudentThesisDetails from "./pages/student/StudentThesisDetails"

// import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard"
// import ReviewPage from "./pages/supervisor/Review"
// import SupervisorProfile from "./pages/supervisor/SupervisorProfile"

// import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard"
// import ThesisEvaluationDetails from "./pages/evaluator/ThesisEvaluationDetails"
// import EvaluatorProfile from "./pages/evaluator/Profile"

// import AdminDashboard from "./pages/admin/AdminDashboard"
// import AdminThesisDetails from "./pages/admin/AdminThesisDetails"
// import ProtectedRoute from "./components/ProtectedRoute"

// function App() {

//   return (

//     <BrowserRouter>

//       <Routes>

//         <Route path="/" element={<Home/>} />
//         <Route path="/login" element={<Login/>} />
//         <Route path="/forgot-password" element={<ForgotPassword/>} />
//         <Route path="/register" element={<Register/>} />

//         {/* <Route path="/supervisor" element={<SupervisorDashboard/>} /> */}

//         {/* <Route path="/evaluator" element={<EvaluatorDashboard/>} /> */}
//         {/* <Route path="/admin" element={<AdminDashboard/>} /> */}

//         <Route
//          path="/evaluator"element={
//         <ProtectedRoute roles={["evaluator","third_evaluator"]}><EvaluatorDashboard/>
//         </ProtectedRoute>
//          }/>
//           <Route
//          path="/evaluator/thesis/:id"element={
//         <ProtectedRoute roles={["evaluator","third_evaluator"]}><ThesisEvaluationDetails />
//         </ProtectedRoute>
//          }/>
//           <Route
//          path="/evaluator/profile"element={
//         <ProtectedRoute roles={["evaluator","third_evaluator"]}><EvaluatorProfile />
//         </ProtectedRoute>
//          }/>

//         <Route
//          path="/admin"element={
//         <ProtectedRoute roles={["admin"]}><AdminDashboard />
//         </ProtectedRoute>
//          }/>
//          <Route
//          path="/admin/thesis/:id"element={
//         <ProtectedRoute roles={["admin"]}><AdminThesisDetails/>
//         </ProtectedRoute>
//          }/>

//          <Route
//          path="/student"element={
//         <ProtectedRoute roles={["student"]}><StudentDashboard/>
//         </ProtectedRoute>
//          }/>

//          <Route
//          path="/upload"element={
//         <ProtectedRoute roles={["student"]}><UploadThesis />
//         </ProtectedRoute>
//          }/>
//           <Route
//          path="/profile"element={
//         <ProtectedRoute roles={["student"]}><Profile />
//         </ProtectedRoute>
//          }/>
//          <Route
//          path="/student/thesis/:id"element={
//         <ProtectedRoute roles={["student"]}><StudentThesisDetails />
//         </ProtectedRoute>
//          }/>

//          <Route
//          path="/supervisor"element={
//         <ProtectedRoute roles={["supervisor"]}><SupervisorDashboard />
//         </ProtectedRoute>
//          }/>
//           <Route
//          path="/supervisor/profile"element={
//         <ProtectedRoute roles={["supervisor"]}><SupervisorProfile />
//         </ProtectedRoute>
//          }/>

//            <Route
//          path="/review/:id"element={
//         <ProtectedRoute roles={["supervisor"]}><ReviewPage />
//         </ProtectedRoute>
//          }/>

//       </Routes>

//     </BrowserRouter>

//   )

// }

// export default App

import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/homepage/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />

        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<ForgotPassword />} path="/forgot-password" />
        <Route element={<ResetPassword />} path="/reset-password/:token" />
        <Route element={<VerifyEmail />} path="/verify-email/:token" />
        <Route element={<VerifyEmailSent />} path="/verify-email-sent" />

        <Route
          element={
            <ProtectedRoute roles={["evaluator", "third_evaluator"]}>
              <EvaluatorDashboard />
            </ProtectedRoute>
          }
          path="/evaluator"
        />

        <Route
          element={
            <ProtectedRoute roles={["evaluator", "third_evaluator"]}>
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
            <ProtectedRoute roles={["supervisor"]}>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
          path="/supervisor"
        />

        <Route
          element={
            <ProtectedRoute roles={["supervisor"]}>
              <SupervisorProfile />
            </ProtectedRoute>
          }
          path="/supervisor/profile"
        />

        <Route
          element={
            <ProtectedRoute roles={["supervisor"]}>
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
