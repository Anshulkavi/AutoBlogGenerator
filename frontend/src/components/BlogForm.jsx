// import React, { useState } from "react";
// import axios from "axios";

// const BlogForm = ({ onGenerate }) => {
//   const [topic, setTopic] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!topic.trim()) return;

//     setLoading(true);
//     setError("");

//     try {
//         const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

//       const res = await axios.post(`${BACKEND_URL}/generate_blog`, {
//         topic,
//       });

//       onGenerate(res.data);
//       setTopic("");
//     } catch (err) {
//       setError("Failed to generate blog. Try again.");
//       console.error("Blog generation error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto mt-8 px-4 flex flex-col gap-4"
//     >
//       <h2 className="text-2xl font-bold text-gray-800 mb-2">
//         🧠 Generate a New Blog
//       </h2>

//       <input
//         type="text"
//         placeholder="Enter a topic (e.g. AI in Education)"
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//         className="p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
//       >
//         {loading ? "Generating..." : "🚀 Generate Blog"}
//       </button>

//       {error && <p className="text-red-600 text-sm">{error}</p>}
//     </form>
//   );
// };

// export default BlogForm;

import React, { useState } from "react";
import { generateBlog } from "../utils/api";

const BlogForm = ({ onGenerate }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const blogData = await generateBlog(trimmedTopic);
      
      // Validate the response
      if (!blogData || !blogData.title || !blogData.content) {
        throw new Error("Invalid blog data received");
      }

      onGenerate(blogData);
      setTopic("");
    } catch (err) {
      console.error("❌ Blog generation error:", err);
      
      // Show user-friendly error message
      let errorMessage = "Failed to generate blog. Please try again.";
      
      if (err.message.includes("Topic is required")) {
        errorMessage = "Please enter a valid topic.";
      } else if (err.message.includes("Invalid JSON")) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes("HTTP 5")) {
        errorMessage = "Server is currently unavailable. Please try again later.";
      } else if (err.message.includes("HTTP 4")) {
        errorMessage = "Invalid request. Please check your input.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-8 px-4 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        🧠 Generate a New Blog
      </h2>

      <input
        type="text"
        placeholder="Enter a topic (e.g. AI in Education, Climate Change, Digital Marketing)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={loading}
        className="p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        maxLength={200}
      />

      <button
        type="submit"
        disabled={loading || !topic.trim()}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          "🚀 Generate Blog"
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>💡 <strong>Tips for better results:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Be specific (e.g., "Benefits of Remote Work for Developers")</li>
          <li>Use clear, descriptive topics</li>
          <li>Avoid overly broad subjects</li>
        </ul>
      </div>
    </form>
  );
};

export default BlogForm;