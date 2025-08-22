const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// Helper function to handle errors more robustly
const handleError = async (response) => {
    let errorMessage;
    try {
        // First, try to parse the error as JSON (like FastAPI sends)
        const errorJson = await response.json();
        errorMessage = errorJson.detail || JSON.stringify(errorJson);
    } catch (e) {
        // If that fails, it's not JSON (e.g., an HTML error page from Render)
        // So, we read it as plain text.
        errorMessage = await response.text();
    }
    throw new Error(errorMessage || `Request failed with status: ${response.status}`);
};


/**
 * Starts the blog generation process.
 * @param {string} topic The topic for the blog.
 * @returns {Promise<string>} The job ID.
 */
export const startBlogGeneration = async (topic) => {
  console.log(`🚀 Starting blog generation for topic: "${topic}"`);
  const response = await fetch(`${BACKEND_URL}/generate_blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    await handleError(response);
  }

  const data = await response.json();
  console.log("✅ Generation started successfully, Job ID:", data.job_id);
  return data.job_id;
};

/**
 * Checks the status of a blog generation job.
 * @param {string} jobId The ID of the job to check.
 * @returns {Promise<object>} The job status object.
 */
export const getGenerationStatus = async (jobId) => {
  const response = await fetch(`${BACKEND_URL}/generate_blog/status/${jobId}`);

  if (!response.ok) {
    await handleError(response);
  }

  const data = await response.json();
  console.log(`🔄 Status for Job ID ${jobId}:`, data.status);
  return data;
};

/**
 * Fetches the list of recent blogs.
 * @returns {Promise<object>} The history data.
 */
export const getHistory = async () => {
    const response = await fetch(`${BACKEND_URL}/history`);
    if (!response.ok) {
        await handleError(response);
    }
    return response.json();
};

/**
 * Fetches a single blog by its ID.
 * @param {string} id The ID of the blog to fetch.
 * @returns {Promise<object>} The full blog data.
 */
export const getBlogById = async (id) => {
    const response = await fetch(`${BACKEND_URL}/blog/${id}`);
    if (!response.ok) {
        await handleError(response);
    }
    return response.json();
};