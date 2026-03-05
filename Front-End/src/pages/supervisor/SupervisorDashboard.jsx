import { useEffect,useState } from "react"
import axios from "../../api/axios"

export default function SupervisorDashboard(){

 const [thesis,setThesis] = useState([])

 useEffect(()=>{

  axios.get("/supervisor/thesis")
  .then(res=>setThesis(res.data))

 },[])

 return(

  <div className="p-10">

   <h1 className="text-2xl mb-5">

    Thesis Review
   </h1>

   {thesis.map(t=>(

    <div
     key={t._id}
     className="border p-4 mb-3"
    >

     <h2>{t.title}</h2>

     <p>Student: {t.student.name}</p>

     <button
      className="bg-green-500 text-white p-2 mr-2"
     >
      Accept
     </button>

     <button
      className="bg-red-500 text-white p-2"
     >
      Reject
     </button>

    </div>

   ))}

  </div>

 )

}