
import { useState } from "react";
import axios from "../../api/axios";
import { toast, Toaster } from "sonner";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  FileUp,
  Info,
  X,
} from "lucide-react";

export default function UploadThesis() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const upload = async () => {
    if (!title || !file) {
      toast.error("Please provide both title and file");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", file);
      formData.append("description", description);

      await axios.post("/student/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percent);
        },
      });

      toast.success("Thesis uploaded successfully");
      setTitle("");
      setDescription("");
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (size) => {
    if (!size) return "";
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const navItems = [
    { name: "Dashboard", route: "/student" },
    { name: "Upload Thesis", route: "/upload" },
    { name: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar items={navItems} portal="Student Portal" />
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Student Portal</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Upload Thesis
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Submit your thesis document in PDF format for review.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main upload form */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileUp className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Thesis Submission Form
                </h2>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thesis Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your thesis title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* Description optional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                    <span className="text-gray-400 ml-1 text-xs">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Write a short summary of your thesis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[120px] text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thesis PDF
                  </label>

                  <label className="block border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setUploadProgress(0);
                      }}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-gray-500" />
                      </div>

                      <p className="text-sm font-medium text-gray-700">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Only PDF files are allowed
                      </p>
                    </div>
                  </label>

                  {file && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 break-all">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-gray-500 hover:text-red-600 transition shrink-0"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload progress */}
                  {loading && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Uploading file...
                        </p>
                        <span className="text-sm text-gray-600">
                          {uploadProgress}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={upload}
                    disabled={!title || !file || loading}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium text-white transition ${
                      !title || !file || loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-black"
                    }`}
                  >
                    {loading ? `Uploading ${uploadProgress}%...` : "Upload Thesis"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                      setFile(null);
                      setUploadProgress(0);
                    }}
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Submission Guidelines
                </h3>
              </div>

              <div className="space-y-3 text-sm text-gray-600 leading-6">
                <p>• Upload your thesis in PDF format only.</p>
                <p>• Make sure the thesis title is accurate and complete.</p>
                <p>• Review your file before submitting.</p>
                <p>• After upload, your thesis will be available for supervisor review.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Important Note
              </h3>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-7">
                  Once uploaded, your thesis status may remain pending until reviewed
                  by your supervisor. If your thesis is declined, you may need to
                  update and re-upload it.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                File Requirements
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Allowed Format</p>
                  <p className="text-sm font-medium text-gray-800">PDF (.pdf)</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Recommended File Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    thesis-title.pdf
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}