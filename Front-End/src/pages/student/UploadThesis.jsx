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



import { useState } from "react";
import axios from "../../api/axios";
import { toast, Toaster } from "sonner";
import Navbar from "../../components/Navbar";

export default function UploadThesis() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!title || !file) {
      toast.error("Please provide both title and file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", file);

      await axios.post("/student/upload", formData);
      toast.success("Thesis uploaded successfully");
      setTitle("");
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { name: "Dashboard", route: "/student" },
    { name: "Upload Thesis", route: "/upload" },
    { name: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar items={navItems} portal="Student Portal" />
      <Toaster position="top-right" />

      {/* Main Content */}
      <div className="flex justify-center mt-24 p-6">
        <div className="bg-white shadow-3xl rounded-3xl w-full max-w-md p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-blue-800">
            Upload Thesis
          </h1>

          {/* Title Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter thesis title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
            />
          </div>

          {/* File Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-medium">PDF File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-xl p-2 cursor-pointer hover:border-teal-400 transition"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={upload}
            disabled={!title || !file || loading}
            className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
              !title || !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Uploading..." : "Upload Thesis"}
          </button>
        </div>
      </div>
    </div>
  );
}