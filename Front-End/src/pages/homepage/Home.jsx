import React from "react";
import { useNavigate } from "react-router-dom";
import { Book, CheckCircle, Users } from "lucide-react"; // Icons for features

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Book className="w-10 h-10 text-blue-600" />,
      title: "Organize Your Thesis",
      desc: "Upload, track, and manage your thesis documents in one place.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-teal-500" />,
      title: "Get Approvals",
      desc: "Supervisors can review and approve your thesis seamlessly.",
    },
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Collaborate Easily",
      desc: "Stay updated with notifications and communicate with faculty.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">Thesis Management Portal</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-200"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center px-6 py-24 md:py-32">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Simplify Your Thesis Management
        </h1>
        <p className="text-gray-600 max-w-2xl mb-12 text-lg md:text-xl">
          Upload, track, and manage your thesis easily. Get approvals from supervisors, 
          stay organized, and focus on what matters most – your research.
        </p>

        <div className="flex space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-semibold text-lg hover:bg-teal-600 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Register
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Use Our Portal
        </h2>

        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 px-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Thesis Management Portal. All rights reserved.
      </footer>
    </div>
  );
}