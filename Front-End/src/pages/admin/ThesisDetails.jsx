import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

export default function ThesisDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/admin/thesis/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Thesis Details
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* 🔵 Card 1: Thesis Info */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Thesis Info
          </h2>

          <p className="mb-2">
            <span className="font-medium text-gray-600">Title:</span><br />
            <span className="text-gray-800 font-semibold">{data.title}</span>
          </p>

          <p className="mb-2">
            <span className="font-medium text-gray-600">Student:</span><br />
            {data.student?.name}
          </p>

          <p className="mb-2">
            <span className="font-medium text-gray-600">Email:</span><br />
            {data.student?.email}
          </p>

          <p className="mt-4">
            <span className="font-medium text-gray-600">Status:</span><br />
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                data.status === "accepted"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {data.status}
            </span>
          </p>
        </div>

        {/* 🟣 Card 2: Evaluators */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            Evaluators
          </h2>

          {data.evaluatorMarks?.length > 0 ? (
            data.evaluatorMarks.map((e, i) => (
              <div
                key={i}
                className="mb-3 p-3 rounded-lg bg-gray-50 border"
              >
                <p className="font-medium text-gray-700">
                  👤 {e.evaluator?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Mark: <span className="font-semibold">{e.mark}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No evaluators yet</p>
          )}

          <hr className="my-4" />

          <h3 className="font-semibold text-gray-700 mb-2">
            Third Evaluator
          </h3>

          {data.thirdEvaluatorMark ? (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p>👤 {data.thirdEvaluatorMark?.evaluator?.name}</p>
              <p className="text-sm text-gray-500">
                Mark:{" "}
                <span className="font-semibold">
                  {data.thirdEvaluatorMark?.mark}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Not assigned</p>
          )}
        </div>

        {/* 🟢 Card 3: Result & File */}
        <div className="bg-white p-6 rounded-2xl shadow-md border flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Result
            </h2>

            <p className="text-gray-600 mb-2">Final Mark</p>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              {data.finalMark ?? "--"}
            </h1>
          </div>

          <div>
            <a
              href={`http://localhost:5000/${data.pdf.replace(/\\/g, "/")}`}
              target="_blank"
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              📄 View PDF
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}