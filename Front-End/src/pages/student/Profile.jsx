import React from "react";
import Navbar from "../../components/Navbar";
export default function Profile() {

//   const user = {
//     name: "Jahid Hasan Rimel",
//     id: "STU-2026-001",
//     phone: "01728827813",
//     email: "zmzahidhasan181@gmail.com"
//   };
  const user = JSON.parse(localStorage.getItem("user"));
  const navItems = [
    { name: "Dashboard", route: "/student" },
    { name: "Upload Thesis", route: "/upload" },
    // { name: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

  {/* Navbar */}
  <Navbar items={navItems} portal={'Student Portal'}
  />

  {/* Profile Section */}
  <div className="flex items-center justify-center p-6">

    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Profile Information
      </h1>

      <div className="space-y-4">

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Name</span>
          <span className="text-gray-800">{user.name}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Student ID</span>
          <span className="text-gray-800">{user.id}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Phone</span>
          <span className="text-gray-800">{user.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Email</span>
          <span className="text-gray-800">{user.email}</span>
        </div>

      </div>

    </div>

  </div>

</div>
  );
}