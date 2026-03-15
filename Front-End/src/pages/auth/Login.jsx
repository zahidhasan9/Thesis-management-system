
// import { useState } from "react";
// import axios from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       toast.error("Please enter email and password", { placement: "top-right" });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("/auth/login", { email, password });
//       toast.success("Login successful", { placement: "top-right" });
//       localStorage.setItem("user", JSON.stringify(res.data));
//       const role = res.data.role;
//       if (role === "student") navigate("/student");
//       else if (role === "supervisor") navigate("/supervisor");
//       else if (role === "evaluator") navigate("/evaluator");
//       else if (role === "admin") navigate("/admin");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed", { placement: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left panel: educational content */}
//       <div className="md:w-1/2 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white p-10 flex flex-col justify-center">
//         <h1 className="text-4xl font-bold mb-4">Welcome to EduPortal</h1>
//         <p className="mb-6 text-lg">
//           Learn, practice, and grow with our interactive educational content. Track your progress, take quizzes, and collaborate with peers.
//         </p>
//         <ul className="list-disc ml-5 space-y-2">
//           <li>Interactive tutorials and lessons</li>
//           <li>Real-time progress tracking</li>
//           <li>Expert guidance from educators</li>
//           <li>Join a community of learners</li>
//         </ul>
//       </div>

//       {/* Right panel: login form */}
//       <div className="md:w-1/2 flex justify-center items-center p-6 bg-gray-50">
//   <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
//     <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

//     <div className="flex flex-col mb-4">
//       <label htmlFor="email" className="mb-2 font-medium">Email</label>
//       <input
//         id="email"
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>

//     <div className="flex flex-col mb-4">
//       <label htmlFor="password" className="mb-2 font-medium">Password</label>
//       <input
//         id="password"
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>

//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           id="remember"
//           checked={rememberMe}
//           onChange={(e) => setRememberMe(e.target.checked)}
//           className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//         />
//         <label htmlFor="remember" className="text-sm">Remember me</label>
//       </div>
//     </div>

//     <button
//       onClick={login}
//       disabled={loading}
//       className={`w-full p-2 rounded-lg text-white font-medium ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
//     >
//       {loading ? "Logging in..." : "Login"}
//     </button>

//     {/* Register link */}
//     <p className="text-center mt-4 text-sm">
//       Don’t have an account?{" "}
//       <span
//         className="text-blue-600 hover:underline cursor-pointer"
//         onClick={() => navigate("/register")}
//       >
//         Register
//       </span>
//     </p>
//   </div>
// </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const role = JSON.parse(storedUser).role;
      if (role === "student") navigate("/student");
      else if (role === "supervisor") navigate("/supervisor");
      else if (role === "evaluator") navigate("/evaluator");
      else if (role === "third_evaluator") navigate("/evaluator");
      else if (role === "admin") navigate("/admin");
    }
  }, [navigate]);

  const login = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password", { placement: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      toast.success("Login successful", { placement: "top-right" });
      localStorage.setItem("user", JSON.stringify(res.data));

      const role = res.data.role;
      if (role === "student") navigate("/student");
      else if (role === "supervisor") navigate("/supervisor");
      else if (role === "evaluator") navigate("/evaluator");
      else if (role === "admin") navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { placement: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel: educational content */}
      <div className="md:w-1/2 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to EduPortal</h1>
        <p className="mb-6 text-lg">
          Learn, practice, and grow with our interactive educational content. Track your progress, take quizzes, and collaborate with peers.
        </p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Interactive tutorials and lessons</li>
          <li>Real-time progress tracking</li>
          <li>Expert guidance from educators</li>
          <li>Join a community of learners</li>
        </ul>
      </div>

      {/* Right panel: login form */}
      <div className="md:w-1/2 flex justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="mb-2 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white font-medium ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}