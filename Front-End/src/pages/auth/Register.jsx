
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/register", { name, email, password });
      toast.success("Registered successfully");
      navigate("/"); // register successful -> go to login page
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel: educational content */}
      <div className="md:w-1/2 bg-gradient-to-tr from-green-500 to-teal-600 text-white p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Join EduPortal</h1>
        <p className="mb-6 text-lg">
          Create your account and start learning today! Access interactive lessons, track your progress, and join a community of learners.
        </p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Interactive tutorials and lessons</li>
          <li>Real-time progress tracking</li>
          <li>Expert guidance from educators</li>
          <li>Connect with other learners</li>
        </ul>
      </div>

      {/* Right panel: register form */}
      <div className="md:w-1/2 flex justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-2 font-medium">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={register}
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white font-medium ${loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login link */}
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <span
              className="text-green-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}