// const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// /**
//  * Universal error handler
//  * Handles both JSON (FastAPI) & HTML (Render) error responses
//  */
// const handleError = async (response) => {
//   let errorMessage;
//   try {
//     const errorJson = await response.json();
//     errorMessage = errorJson.detail || JSON.stringify(errorJson);
//   } catch {
//     errorMessage = await response.text();
//   }
//   throw new Error(errorMessage || `Request failed with status: ${response.status}`);
// };

// /**
//  * Generic fetch wrapper
//  */
// const fetchAPI = async (url, options = {}) => {
//   const response = await fetch(url, options);

//   if (!response.ok) {
//     await handleError(response);
//   }

//   return response.json();
// };

// /**
//  * Starts the blog generation process
//  * @param {string} topic The topic for the blog
//  * @returns {Promise<string>} Job ID
//  */
// export const startBlogGeneration = async (topic) => {
//   console.log(`🚀 Starting blog generation for topic: "${topic}"`);

//   const data = await fetchAPI(`${BACKEND_URL}/api/generate_blog`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ topic }),
//   });

//   console.log("✅ Generation started successfully, Job ID:", data.job_id);
//   return data.job_id;
// };

// /**
//  * Checks status of a blog generation job
//  * @param {string} jobId The ID of the job
//  * @returns {Promise<object>} Job status
//  */
// export const getGenerationStatus = async (jobId) => {
//   const data = await fetchAPI(`${BACKEND_URL}/api/generate_blog/status/${jobId}`);
//   console.log(`🔄 Status for Job ID ${jobId}:`, data.status);
//   return data;
// };

// /**
//  * Fetches the list of recent blogs
//  * @returns {Promise<object>} History data
//  */
// export const getHistory = () => {
//   return fetchAPI(`${BACKEND_URL}/api/history`);
// };

// /**
//  * Fetches a single blog by its ID
//  * @param {string} id Blog ID
//  * @returns {Promise<object>} Blog data
//  */
// export const getBlogById = (id) => {
//   return fetchAPI(`${BACKEND_URL}/api/blog/${id}`);
// };

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

const handleError = async (response) => {
  let errorMessage;
  try {
    const errorJson = await response.json();
    errorMessage = errorJson.detail || JSON.stringify(errorJson);
  } catch {
    errorMessage = await response.text();
  }
  throw new Error(errorMessage || `Request failed with status: ${response.status}`);
};

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) await handleError(response);
  return response.json();
};

export const startBlogGeneration = async (topic) => {
  const data = await fetchAPI(`${BACKEND_URL}/api/generate_blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  return data.job_id;
};

export const getGenerationStatus = async (jobId) => {
  return fetchAPI(`${BACKEND_URL}/api/generate_blog/status/${jobId}`);
};

export const getHistory = () => {
  return fetchAPI(`${BACKEND_URL}/api/history`);
};

export const getBlogById = (id) => {
  return fetchAPI(`${BACKEND_URL}/api/blog/${id}`);
};
