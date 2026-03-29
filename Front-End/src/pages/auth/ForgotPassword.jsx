import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email", { placement: "top-right" });
      return;
    }

    setLoading(true);

    // Just for static UI demo
    setTimeout(() => {
      toast.success("Password reset link sent successfully", {
        placement: "top-right",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="md:w-1/2 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Forgot Your Password?</h1>
        <p className="mb-6 text-lg">
          No worries! Enter your email address and we will help you reset your
          password quickly and securely.
        </p>
        <ul className="list-disc ml-5 space-y-2">
          <li>Secure password reset process</li>
          <li>Quick email verification</li>
          <li>Easy access recovery</li>
          <li>Stay connected with your learning journey</li>
        </ul>
      </div>

      {/* Right panel */}
      <div className="md:w-1/2 flex justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Forgot Password
          </h2>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white font-medium ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center mt-4 text-sm">
            Remember your password?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}