import React, { useState, useRef } from "react";
import { startBlogGeneration, getGenerationStatus } from "../utils/api";

const BlogForm = ({ onGenerate }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Use a ref to hold the interval ID to clear it later
  const pollingIntervalRef = useRef(null);

  // Function to stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    stopPolling(); // Clear any previous polling intervals

    try {
      const jobId = await startBlogGeneration(trimmedTopic);

      // --- Polling Logic ---
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusData = await getGenerationStatus(jobId);

          if (statusData.status === "complete") {
            stopPolling();
            setLoading(false);
            onGenerate(statusData.result);
            setTopic("");
          } else if (statusData.status === "failed") {
            stopPolling();
            setLoading(false);
            setError(`Generation failed: ${statusData.error || "Unknown error"}`);
          }
          // If status is "pending", we do nothing and let the interval run again
        } catch (pollError) {
          stopPolling();
          setLoading(false);
          setError("Error checking status. Please try again.");
        }
      }, 3000); // Check every 3 seconds

    } catch (startError) {
      setLoading(false);
      setError(startError.message);
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
        placeholder="Enter a topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={loading}
        className="p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading || !topic.trim()}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "🚀 Generate Blog"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
};

export default BlogForm;