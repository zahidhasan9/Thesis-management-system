import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axios"; 


export default function Navbar({ items, portal }) {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await axios.post("/auth/logout"); // call backend logout
    localStorage.removeItem("user");  // remove user info
    window.location.href = "/login";  // redirect to login
  } catch (err) {
    console.error("Logout failed", err);
  }
};
//   const handleLogout = () => {
//     // Remove token cookie
//     Cookies.remove("token");
//     // Remove user from localStorage
//     localStorage.removeItem("user");
//     // Redirect to login page
//     navigate("/login");
//   };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Portal / Brand */}
      <h1 className="text-2xl font-bold text-blue-600">{portal}</h1>

      {/* Nav Items */}
      <ul className="flex space-x-6 items-center">
        {items.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}

        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}