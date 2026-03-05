import { useEffect,useState } from "react"
import axios from "../../api/axios"

export default function EvaluatorDashboard(){

 const [thesis,setThesis] = useState([])

 useEffect(()=>{

  axios.get("/evaluator/accepted")
  .then(res=>setThesis(res.data))

 },[])

 return(

  <div className="p-10">

   <h1 className="text-2xl mb-5">

    Evaluate Thesis
   </h1>

   {thesis.map(t=>(

    <div
     key={t._id}
     className="border p-4 mb-3"
    >

     <h2>{t.title}</h2>

     <p>{t.student.name}</p>

     <input
      placeholder="Mark"
      className="border p-1"
     />

     <button
      className="bg-black text-white p-1 ml-2"
     >
      Submit
     </button>

    </div>

   ))}

  </div>

 )
}