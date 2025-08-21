// // // utils/api.js
// // // export const generateBlog = async (topic) => {
// // //   const BACKEND_URL = import.meta.env.BACKEND_API_URL;
// // //   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// // //     method: "POST",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //     body: JSON.stringify({ topic }),
// // //   });

// // //   if (!response.ok) throw new Error("Failed to generate blog");
// // //   return await response.json();
// // // };


// // // utils/api.js
// // export const generateBlog = async (topic) => {
// //   const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
// //   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ topic }),
// //   });

// //   const text = await response.text(); // always capture raw response
// //     console.log("🔎 Raw backend response:", text);

// //   const data = JSON.parse(text);  // 👈 then try parsing

// //   if (!response.ok) {
// //     console.error("Backend error:", response.status, text);
// //     throw new Error(`Failed (${response.status}): ${text}`);
// //   }

// //   try {
// //     return JSON.parse(text); // ✅ safe parse
// //   } catch (err) {
// //     console.error("Invalid JSON from backend:", text);
// //     throw new Error("Backend did not return valid JSON");
// //   }
// // };


// // utils/api.js

// const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// // Helper function to handle API responses
// const handleResponse = async (response) => {
//   const text = await response.text();
//   console.log("🔎 Raw backend response:", text);

//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch (err) {
//     console.error("❌ Invalid JSON from backend:", text);
//     throw new Error("Backend returned invalid JSON response");
//   }

//   if (!response.ok) {
//     const errorMessage = data.error || `HTTP ${response.status}`;
//     const errorDetails = data.details || text;
//     console.error("❌ Backend error:", response.status, errorMessage, errorDetails);
//     throw new Error(`${errorMessage}: ${errorDetails}`);
//   }

//   return data;
// };

// // Generate and save blog
// export const generateBlog = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   try {
//     const response = await fetch(`${BACKEND_URL}/generate_blog`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify({ topic: topic.trim() }),
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error("❌ Error generating blog:", error);
//     throw error;
//   }
// };

// // Generate blog without saving
// export const generateBlogOnly = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   try {
//     const response = await fetch(`${BACKEND_URL}/generate`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify({ topic: topic.trim() }),
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error("❌ Error generating blog:", error);
//     throw error;
//   }
// };

// // Get blog by ID
// export const getBlogById = async (id) => {
//   if (!id) {
//     throw new Error("Blog ID is required");
//   }

//   try {
//     const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
//       method: "GET",
//       headers: { 
//         "Accept": "application/json"
//       },
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error("❌ Error fetching blog:", error);
//     throw error;
//   }
// };

// // Get all blogs
// export const getAllBlogs = async () => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/blogs`, {
//       method: "GET",
//       headers: { 
//         "Accept": "application/json"
//       },
//     });

//     const data = await handleResponse(response);
//     return data.blogs || [];
//   } catch (error) {
//     console.error("❌ Error fetching all blogs:", error);
//     throw error;
//   }
// };

// // Delete blog
// export const deleteBlog = async (id) => {
//   if (!id) {
//     throw new Error("Blog ID is required");
//   }

//   try {
//     const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
//       method: "DELETE",
//       headers: { 
//         "Accept": "application/json"
//       },
//     });

//     return await handleResponse(response);
//   } catch (error) {
//     console.error("❌ Error deleting blog:", error);
//     throw error;
//   }
// };

// utils/api.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

console.log("🔧 Backend URL:", BACKEND_URL);

// Helper function to handle API responses with detailed logging
const handleResponse = async (response, url, method) => {
  console.log(`📡 Response received from ${method} ${url}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries())
  });

  const text = await response.text();
  console.log("🔎 Raw backend response:", {
    length: text.length,
    preview: text.substring(0, 500),
    isEmpty: text.length === 0
  });

  // Check if response is empty
  if (!text || text.trim().length === 0) {
    console.error("❌ Empty response from backend");
    throw new Error("Backend returned empty response");
  }

  let data;
  try {
    data = JSON.parse(text);
    console.log("✅ Parsed JSON successfully:", data);
  } catch (err) {
    console.error("❌ JSON Parse Error:", {
      error: err.message,
      responseText: text,
      responseLength: text.length
    });
    throw new Error(`Backend returned invalid JSON: ${err.message}`);
  }

  if (!response.ok) {
    const errorMessage = data?.error || `HTTP ${response.status}`;
    const errorDetails = data?.details || response.statusText;
    console.error("❌ Backend error response:", {
      status: response.status,
      error: errorMessage,
      details: errorDetails,
      fullResponse: data
    });
    throw new Error(`${errorMessage}: ${errorDetails}`);
  }

  return data;
};

// Helper function to make API requests with detailed logging
const apiRequest = async (url, options = {}) => {
  const fullUrl = `${BACKEND_URL}${url}`;
  
  console.log(`🚀 Making API request:`, {
    url: fullUrl,
    method: options.method || 'GET',
    headers: options.headers,
    hasBody: !!options.body
  });

  // Add default headers
  const defaultHeaders = {
    "Accept": "application/json",
    ...(options.headers || {})
  };

  if (options.body && typeof options.body === 'object') {
    defaultHeaders["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
    console.log("📤 Request body:", options.body);
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders
    });

    return await handleResponse(response, fullUrl, options.method || 'GET');
  } catch (error) {
    console.error("❌ Network/Fetch error:", {
      message: error.message,
      stack: error.stack,
      url: fullUrl
    });
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error: Unable to connect to server. Please check your connection and server status.");
    }
    
    throw error;
  }
};

// Test backend connectivity
export const testConnection = async () => {
  try {
    console.log("🔍 Testing backend connection...");
    const data = await apiRequest("/health");
    console.log("✅ Backend connection test successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Backend connection test failed:", error);
    throw error;
  }
};

// Generate and save blog
export const generateBlog = async (topic) => {
  if (!topic || !topic.trim()) {
    throw new Error("Topic is required");
  }

  console.log(`🤖 Generating blog for topic: "${topic}"`);

  try {
    const data = await apiRequest("/generate_blog", {
      method: "POST",
      body: { topic: topic.trim() }
    });

    console.log("✅ Blog generated successfully:", {
      title: data.title,
      contentLength: data.content?.length,
      hasId: !!data._id
    });

    return data;
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

  console.log(`🤖 Generating blog (no save) for topic: "${topic}"`);

  try {
    const data = await apiRequest("/generate", {
      method: "POST",
      body: { topic: topic.trim() }
    });

    console.log("✅ Blog generated successfully (no save):", {
      title: data.title,
      contentLength: data.content?.length
    });

    return data;
  } catch (error) {
    console.error("❌ Error generating blog (no save):", error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  console.log(`📖 Fetching blog with ID: ${id}`);

  try {
    const data = await apiRequest(`/blog/${id}`);
    
    console.log("✅ Blog fetched successfully:", {
      title: data.title,
      contentLength: data.content?.length
    });

    return data;
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    throw error;
  }
};

// Get all blogs
export const getAllBlogs = async () => {
  console.log("📚 Fetching all blogs...");

  try {
    const data = await apiRequest("/blogs");
    const blogs = data.blogs || [];
    
    console.log("✅ All blogs fetched successfully:", {
      count: blogs.length,
      blogs: blogs.map(b => ({ id: b._id, title: b.title }))
    });

    return blogs;
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

  console.log(`🗑️ Deleting blog with ID: ${id}`);

  try {
    const data = await apiRequest(`/blog/${id}`, {
      method: "DELETE"
    });

    console.log("✅ Blog deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    throw error;
  }
};

// Initialize API (call this when your app starts)
export const initializeAPI = async () => {
  console.log("🚀 Initializing API connection...");
  
  try {
    await testConnection();
    console.log("✅ API initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ API initialization failed:", error);
    return false;
  }
};