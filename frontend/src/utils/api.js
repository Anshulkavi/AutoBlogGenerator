// // utils/api.js
// // export const generateBlog = async (topic) => {
// //   const BACKEND_URL = import.meta.env.BACKEND_API_URL;
// //   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ topic }),
// //   });

// //   if (!response.ok) throw new Error("Failed to generate blog");
// //   return await response.json();
// // };


// // utils/api.js
// export const generateBlog = async (topic) => {
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
//   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ topic }),
//   });

//   const text = await response.text(); // always capture raw response
//     console.log("🔎 Raw backend response:", text);

//   const data = JSON.parse(text);  // 👈 then try parsing

//   if (!response.ok) {
//     console.error("Backend error:", response.status, text);
//     throw new Error(`Failed (${response.status}): ${text}`);
//   }

//   try {
//     return JSON.parse(text); // ✅ safe parse
//   } catch (err) {
//     console.error("Invalid JSON from backend:", text);
//     throw new Error("Backend did not return valid JSON");
//   }
// };


// utils/api.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const text = await response.text();
  console.log("🔎 Raw backend response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("❌ Invalid JSON from backend:", text);
    throw new Error("Backend returned invalid JSON response");
  }

  if (!response.ok) {
    const errorMessage = data.error || `HTTP ${response.status}`;
    const errorDetails = data.details || text;
    console.error("❌ Backend error:", response.status, errorMessage, errorDetails);
    throw new Error(`${errorMessage}: ${errorDetails}`);
  }

  return data;
};

// Generate and save blog
export const generateBlog = async (topic) => {
  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/generate_blog`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ topic: topic.trim() }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error generating blog:", error);
    throw error;
  }
};

// Generate blog without saving
export const generateBlogOnly = async (topic) => {
  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ topic: topic.trim() }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error generating blog:", error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
      method: "GET",
      headers: { 
        "Accept": "application/json"
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    throw error;
  }
};

// Get all blogs
export const getAllBlogs = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/blogs`, {
      method: "GET",
      headers: { 
        "Accept": "application/json"
      },
    });

    const data = await handleResponse(response);
    return data.blogs || [];
  } catch (error) {
    console.error("❌ Error fetching all blogs:", error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
      method: "DELETE",
      headers: { 
        "Accept": "application/json"
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    throw error;
  }
};