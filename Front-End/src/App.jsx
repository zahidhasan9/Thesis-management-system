import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Home from "./pages/homepage/Home"

import StudentDashboard from "./pages/student/StudentDashboard"
import UploadThesis from "./pages/student/UploadThesis"
import Profile from "./pages/student/Profile"

import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard"
import ReviewPage from "./pages/supervisor/Review"
import SupervisorProfile from "./pages/supervisor/SupervisorProfile"
import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ThesisDetails from "./pages/admin/ThesisDetails"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />

        <Route path="/register" element={<Register/>} />

        {/* <Route path="/supervisor" element={<SupervisorDashboard/>} /> */}

        {/* <Route path="/evaluator" element={<EvaluatorDashboard/>} /> */}
        {/* <Route path="/admin" element={<AdminDashboard/>} /> */}



        <Route 
         path="/evaluator"element={
        <ProtectedRoute roles={["evaluator","third_evaluator"]}><EvaluatorDashboard/> 
        </ProtectedRoute>
         }/>
         
        <Route 
         path="/admin"element={
        <ProtectedRoute roles={["admin"]}><AdminDashboard />
        </ProtectedRoute>
         }/>
          <Route 
         path="/admin/thesis/:id"element={
        <ProtectedRoute roles={["admin"]}><ThesisDetails />
        </ProtectedRoute>
         }/>

         <Route 
         path="/student"element={
        <ProtectedRoute roles={["student"]}><StudentDashboard/>
        </ProtectedRoute>
         }/>

         <Route 
         path="/upload"element={
        <ProtectedRoute roles={["student"]}><UploadThesis />
        </ProtectedRoute>
         }/>
          <Route
         path="/profile"element={
        <ProtectedRoute roles={["student"]}><Profile />
        </ProtectedRoute>
         }/>

         <Route
         path="/supervisor"element={
        <ProtectedRoute roles={["supervisor"]}><SupervisorDashboard />
        </ProtectedRoute>
         }/>
          <Route
         path="/supervisor/profile"element={
        <ProtectedRoute roles={["supervisor"]}><SupervisorProfile />
        </ProtectedRoute>
         }/>

           <Route
         path="/review/:id"element={
        <ProtectedRoute roles={["supervisor"]}><ReviewPage />
        </ProtectedRoute>
         }/>

      </Routes>

    </BrowserRouter>

  )

}

export default App