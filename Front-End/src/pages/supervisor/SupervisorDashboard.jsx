// import { useEffect,useState } from "react"
// import axios from "../../api/axios"

// export default function SupervisorDashboard(){

//  const [thesis,setThesis] = useState([])

//  useEffect(()=>{

//   axios.get("/supervisor/thesis")
//   .then(res=>setThesis(res.data))

//  },[])

//  return(

//   <div className="p-10">

//    <h1 className="text-2xl mb-5">

//     Thesis Review
//    </h1>

//    {thesis.map(t=>(

//     <div
//      key={t._id}
//      className="border p-4 mb-3"
//     >

//      <h2>{t.title}</h2>

//      <p>Student: {t.student.name}</p>

//      <button
//       className="bg-green-500 text-white p-2 mr-2"
//      >
//       Accept
//      </button>

//      <button
//       className="bg-red-500 text-white p-2"
//      >
//       Reject
//      </button>

//     </div>

//    ))}

//   </div>

//  )

// }



import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";

export default function SupervisorDashboard() {

  const [thesis, setThesis] = useState([]);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchThesis = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/supervisor/thesis");
      setThesis(res.data);
    } catch (err) {
      toast.error("Failed to load thesis"+err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  const reviewThesis = async (id, status) => {
    try {

      await axios.patch("/supervisor/review", {
        thesisId: id,
        status: status,
        note: "Reviewed by supervisor"
      });

      toast.success("Thesis updated");

      fetchThesis();

    } catch (err) {

      toast.error("Failed to update thesis");

    }
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Supervisor Thesis Review
      </h1>

      {loading && <p>Loading thesis...</p>}

      {!loading && thesis.length === 0 && (
        <p>No thesis submitted yet</p>
      )}

      {!loading && thesis.map((t) => (

        <div
          key={t._id}
          className="border rounded-lg p-5 mb-4 shadow"
        >

          <h2 className="text-lg font-semibold">
            {t.title}
          </h2>

          <p className="text-gray-600">
            Student: {t.student?.name}
          </p>

          <p className="text-sm mt-1">
            Status: <span className="font-medium">{t.status}</span>
          </p>

          <div className="flex gap-2 mt-4">

            <button
              onClick={() => setSelectedThesis(t)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              View
            </button>

            <button
              onClick={() => reviewThesis(t._id, "accepted")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => reviewThesis(t._id, "rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>

          </div>

        </div>

      ))}

      {/* Thesis Details Modal */}

      {selectedThesis && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-[500px]">

            <h2 className="text-xl font-bold mb-3">
              {selectedThesis.title}
            </h2>

            <p>
              <b>Student:</b> {selectedThesis.student?.name}
            </p>

            <p className="mt-3">
              {selectedThesis.description}
            </p>

            <div className="mt-5 flex justify-end">

              <button
                onClick={() => setSelectedThesis(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}