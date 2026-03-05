import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function StudentDashboard() {
  const [thesis, setThesis] = useState([]);
  console.log("thesis", thesis);

  useEffect(() => {
    axios.get("/student/my-thesis")
      .then(res => setThesis(res.data))
      .catch(err => console.error(err));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Thesis</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {thesis?.length > 0 ? (
          thesis.map(t => (
            <div
              key={t._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">{t.title || "Title not available"}</h2>

              <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(t.status)}`}>
                {t.status || "Status not available"}
              </p>

              <a
                href={`http://localhost:5000/${t.pdf}`}
                target="_blank"
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                View PDF
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No thesis uploaded yet.</p>
        )}
      </div>
    </div>
  );
}