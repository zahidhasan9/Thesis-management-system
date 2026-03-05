// import { useState } from "react"
// import axios from "../../api/axios"

// export default function UploadThesis(){

//  const [title,setTitle] = useState("")
//  const [file,setFile] = useState(null)

//  const upload = async()=>{

//   const formData = new FormData()

//   formData.append("title",title)
//   formData.append("pdf",file)

//   await axios.post("/student/upload",formData)

//   alert("Uploaded")

//  }

//  return(

//   <div className="p-10">

//    <h1 className="text-xl mb-4">Upload Thesis</h1>

//    <input
//     className="border p-2"
//     placeholder="Title"
//     onChange={(e)=>setTitle(e.target.value)}
//    />

//    <input
//     type="file"
//     onChange={(e)=>setFile(e.target.files[0])}
//    />

//    <button
//     className="bg-black text-white p-2"
//     onClick={upload}
//    >
//     Upload
//    </button>

//   </div>

//  )

// }



import { useState } from "react"
import axios from "../../api/axios"
import { toast } from "sonner"

export default function UploadThesis(){

 const [title,setTitle] = useState("")
 const [file,setFile] = useState(null)

 const upload = async()=>{
  try{
   const formData = new FormData()
   formData.append("title",title)
   formData.append("pdf",file)

   await axios.post("/student/upload",formData)
   toast.success("Thesis uploaded successfully")
  }catch(err){
   toast.error(err.response?.data?.message || "Upload failed")
  }
 }

 return(
  <div className="p-10 space-y-4">
   <h1 className="text-xl mb-4">Upload Thesis</h1>
   <input className="border p-2" placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
   <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
   <button className="bg-black text-white p-2" onClick={upload}>Upload</button>
  </div>
 )
}