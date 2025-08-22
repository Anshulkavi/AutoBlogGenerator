// The backend URL from your .env.local file
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Starts the blog generation process.
 * @param {string} topic - The topic for the blog.
 * @returns {Promise<string>} A promise that resolves to the job ID.
 */
export const startBlogGeneration = async (topic) => {
  console.log(`🚀 Starting blog generation process for topic: "${topic}"`);
  const response = await fetch(`${BACKEND_URL}/generate_blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start generation. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Generation started successfully, Job ID:", data.job_id);
  return data.job_id;
};

/**
 * Checks the status of a blog generation job.
 * @param {string} jobId - The ID of the job to check.
 * @returns {Promise<object>} A promise that resolves to the job status object.
 */
export const getGenerationStatus = async (jobId) => {
  const response = await fetch(`${BACKEND_URL}/generate_blog/status/${jobId}`);

  if (!response.ok) {
    throw new Error(`Failed to get status. Status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`🔄 Status for Job ID ${jobId}:`, data.status);
  return data;
};