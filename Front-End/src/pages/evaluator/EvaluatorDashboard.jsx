// import { useEffect,useState } from "react"
// import axios from "../../api/axios"

// export default function EvaluatorDashboard(){

//  const [thesis,setThesis] = useState([])

//  useEffect(()=>{

//   axios.get("/evaluator/accepted")
//   .then(res=>setThesis(res.data))

//  },[])

//  return(

//   <div className="p-10">

//    <h1 className="text-2xl mb-5">

//     Evaluate Thesis
//    </h1>

//    {thesis.map(t=>(

//     <div
//      key={t._id}
//      className="border p-4 mb-3"
//     >

//      <h2>{t.title}</h2>

//      <p>{t.student.name}</p>

//      <input
//       placeholder="Mark"
//       className="border p-1"
//      />

//      <button
//       className="bg-black text-white p-1 ml-2"
//      >
//       Submit
//      </button>

//     </div>

//    ))}

//   </div>

//  )
// }


import { useEffect, useState } from "react"
import axios from "../../api/axios"
import Navbar from "../../components/Navbar";
import { toast } from "sonner";

export default function EvaluatorDashboard() {
  const [theses, setTheses] = useState([])
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // fetch theses based on evaluator role
  const fetchTheses = async () => {
    try {
      setLoading(true)
      const endpoint =
        role === "third_evaluator" ? "/evaluator/pending-third" : "/evaluator/accepted"
      const res = await axios.get(endpoint)
      setTheses(res.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch theses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTheses()
  }, [role])

  // handle mark input
  const handleChange = (thesisId, value) => {
    setMarks({ ...marks, [thesisId]: value })
  }

  // handle mark submission
  const handleSubmit = async (thesisId) => {
    const mark = marks[thesisId]
    if (!mark || isNaN(mark)) {
      toast.error("Enter a valid mark")
      return
    }

    try {
      const endpoint =
        role === "third_evaluator" ? "/evaluator/submit-third-mark" : "/evaluator/submit-mark"
      const res = await axios.post(endpoint, { thesisId, mark: Number(mark) })
      toast.success(res.data.message)
      // refresh theses after submission
      fetchTheses()
      // clear input
      setMarks({ ...marks, [thesisId]: "" })
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to submit mark")
    }
  }

  // progress calculation
  const total = theses.length
  const completed = theses.filter(t => t.finalMark !== null).length
  const progress = total ? (completed / total) * 100 : 0
  const navItems = [
    // { name: "Dashboard", route: "/dashboard" },
    // { name: "Upload Thesis", route: "/upload" },
    { name: "Profile", route: "/profile" },
  ];

  return (
  <>
   <Navbar 
    items={navItems} 
    portal={role === "third" ? "Third Evaluator Portal" : "Evaluator Portal"}
    // className="fixed top-0 left-0 w-full z-50 shadow-md bg-white"
  />
  
    <div className="min-h-screen bg-gray-50 p-8 pt-10">

  {/* <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
    {role === "third" ? "Third Evaluator Dashboard" : "Evaluator Dashboard"}
  </h1> */}

  {/* Progress bar */}
  {total > 0 && (
    <div className="mb-6">
      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1 text-gray-600">
        {completed} of {total} thesis evaluated ({progress.toFixed(0)}%)
      </p>
    </div>
  )}

  {/* Thesis Cards */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {loading && (
      <p className="text-center col-span-full text-gray-500">Loading...</p>
    )}

    {!loading && theses.length === 0 && (
      <p className="text-gray-500 col-span-full text-center">
        No theses to evaluate
      </p>
    )}

    {!loading &&
      theses.map((t) => {
        const diff =
          t.evaluatorMarks?.length === 2
            ? Math.abs(t.evaluatorMarks[0].mark - t.evaluatorMarks[1].mark)
            : 0;
        const cardColor =
          t.finalMark !== null
            ? "border-green-400"
            : diff > 14 && role === "third"
            ? "border-yellow-400"
            : "border-gray-300";

        return (
          <div
            key={t._id}
            className={`bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between border-2 ${cardColor}`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {t.title}
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Student:</span> {t.student.name}
              </p>

              {role === "third" && t.evaluatorMarks?.length === 2 && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Marks from first 2 evaluators:</span>{" "}
                  {t.evaluatorMarks.map((m) => m.mark).join(", ")}
                </p>
              )}

              {t.finalMark !== null && (
                <p className="text-green-600 font-semibold">
                  Final Mark: {t.finalMark}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="number"
                min={0}
                max={100}
                value={marks[t._id] || ""}
                onChange={(e) => handleChange(t._id, e.target.value)}
                placeholder="Enter mark"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSubmit(t._id)}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
              >
                Submit
              </button>
            </div>
          </div>
        );
      })}
  </div>
</div>
</>
  )
}