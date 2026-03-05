import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import StudentDashboard from "./pages/student/StudentDashboard"
import UploadThesis from "./pages/student/UploadThesis"

import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard"
import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login/>} />

        <Route path="/register" element={<Register/>} />

        <Route path="/student" element={<StudentDashboard/>} />

        <Route path="/upload" element={<UploadThesis/>} />

        <Route path="/supervisor" element={<SupervisorDashboard/>} />

        <Route path="/evaluator" element={<EvaluatorDashboard/>} />

        <Route path="/admin" element={<AdminDashboard/>} />

      </Routes>

    </BrowserRouter>

  )

}

export default App