import React, { useState } from "react";
import axios from "axios";

const BlogForm = ({ onGenerate }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");

    try {
        const BACKEND_URL = import.meta.env.BACKEND_API_URL;

      const res = await axios.post(`${BACKEND_URL}/generate_blog`, {
        topic,
      });

      onGenerate(res.data);
      setTopic("");
    } catch (err) {
      setError("Failed to generate blog. Try again.");
      console.error("Blog generation error:", err);
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
        placeholder="Enter a topic (e.g. AI in Education)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "🚀 Generate Blog"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default BlogForm;
