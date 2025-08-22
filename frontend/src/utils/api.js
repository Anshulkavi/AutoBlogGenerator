// // // // utils/api.js
// // // // export const generateBlog = async (topic) => {
// // // //   const BACKEND_URL = import.meta.env.BACKEND_API_URL;
// // // //   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// // // //     method: "POST",
// // // //     headers: {
// // // //       "Content-Type": "application/json",
// // // //     },
// // // //     body: JSON.stringify({ topic }),
// // // //   });

// // // //   if (!response.ok) throw new Error("Failed to generate blog");
// // // //   return await response.json();
// // // // };


// // // // utils/api.js
// // // export const generateBlog = async (topic) => {
// // //   const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
// // //   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ topic }),
// // //   });

// // //   const text = await response.text(); // always capture raw response
// // //     console.log("🔎 Raw backend response:", text);

// // //   const data = JSON.parse(text);  // 👈 then try parsing

// // //   if (!response.ok) {
// // //     console.error("Backend error:", response.status, text);
// // //     throw new Error(`Failed (${response.status}): ${text}`);
// // //   }

// // //   try {
// // //     return JSON.parse(text); // ✅ safe parse
// // //   } catch (err) {
// // //     console.error("Invalid JSON from backend:", text);
// // //     throw new Error("Backend did not return valid JSON");
// // //   }
// // // };


// // // utils/api.js

// // const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// // // Helper function to handle API responses
// // const handleResponse = async (response) => {
// //   const text = await response.text();
// //   console.log("🔎 Raw backend response:", text);

// //   let data;
// //   try {
// //     data = JSON.parse(text);
// //   } catch (err) {
// //     console.error("❌ Invalid JSON from backend:", text);
// //     throw new Error("Backend returned invalid JSON response");
// //   }

// //   if (!response.ok) {
// //     const errorMessage = data.error || `HTTP ${response.status}`;
// //     const errorDetails = data.details || text;
// //     console.error("❌ Backend error:", response.status, errorMessage, errorDetails);
// //     throw new Error(`${errorMessage}: ${errorDetails}`);
// //   }

// //   return data;
// // };

// // // Generate and save blog
// // export const generateBlog = async (topic) => {
// //   if (!topic || !topic.trim()) {
// //     throw new Error("Topic is required");
// //   }

// //   try {
// //     const response = await fetch(`${BACKEND_URL}/generate_blog`, {
// //       method: "POST",
// //       headers: { 
// //         "Content-Type": "application/json",
// //         "Accept": "application/json"
// //       },
// //       body: JSON.stringify({ topic: topic.trim() }),
// //     });

// //     return await handleResponse(response);
// //   } catch (error) {
// //     console.error("❌ Error generating blog:", error);
// //     throw error;
// //   }
// // };

// // // Generate blog without saving
// // export const generateBlogOnly = async (topic) => {
// //   if (!topic || !topic.trim()) {
// //     throw new Error("Topic is required");
// //   }

// //   try {
// //     const response = await fetch(`${BACKEND_URL}/generate`, {
// //       method: "POST",
// //       headers: { 
// //         "Content-Type": "application/json",
// //         "Accept": "application/json"
// //       },
// //       body: JSON.stringify({ topic: topic.trim() }),
// //     });

// //     return await handleResponse(response);
// //   } catch (error) {
// //     console.error("❌ Error generating blog:", error);
// //     throw error;
// //   }
// // };

// // // Get blog by ID
// // export const getBlogById = async (id) => {
// //   if (!id) {
// //     throw new Error("Blog ID is required");
// //   }

// //   try {
// //     const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
// //       method: "GET",
// //       headers: { 
// //         "Accept": "application/json"
// //       },
// //     });

// //     return await handleResponse(response);
// //   } catch (error) {
// //     console.error("❌ Error fetching blog:", error);
// //     throw error;
// //   }
// // };

// // // Get all blogs
// // export const getAllBlogs = async () => {
// //   try {
// //     const response = await fetch(`${BACKEND_URL}/blogs`, {
// //       method: "GET",
// //       headers: { 
// //         "Accept": "application/json"
// //       },
// //     });

// //     const data = await handleResponse(response);
// //     return data.blogs || [];
// //   } catch (error) {
// //     console.error("❌ Error fetching all blogs:", error);
// //     throw error;
// //   }
// // };

// // // Delete blog
// // export const deleteBlog = async (id) => {
// //   if (!id) {
// //     throw new Error("Blog ID is required");
// //   }

// //   try {
// //     const response = await fetch(`${BACKEND_URL}/blog/${id}`, {
// //       method: "DELETE",
// //       headers: { 
// //         "Accept": "application/json"
// //       },
// //     });

// //     return await handleResponse(response);
// //   } catch (error) {
// //     console.error("❌ Error deleting blog:", error);
// //     throw error;
// //   }
// // };

// // // utils/api.js

// // const BACKEND_URL = import.meta.env.BACKEND_API_URL;

// // console.log("🔧 Backend URL:", BACKEND_URL);

// // // Helper function to handle API responses with detailed logging
// // const handleResponse = async (response, url, method) => {
// //   console.log(`📡 Response received from ${method} ${url}:`, {
// //     status: response.status,
// //     statusText: response.statusText,
// //     headers: Object.fromEntries(response.headers.entries())
// //   });

// //   const text = await response.text();
// //   console.log("🔎 Raw backend response:", {
// //     length: text.length,
// //     preview: text.substring(0, 500),
// //     isEmpty: text.length === 0
// //   });

// //   // Check if response is empty
// //   if (!text || text.trim().length === 0) {
// //     console.error("❌ Empty response from backend");
// //     throw new Error("Backend returned empty response");
// //   }

// //   let data;
// //   try {
// //     data = JSON.parse(text);
// //     console.log("✅ Parsed JSON successfully:", data);
// //   } catch (err) {
// //     console.error("❌ JSON Parse Error:", {
// //       error: err.message,
// //       responseText: text,
// //       responseLength: text.length
// //     });
// //     throw new Error(`Backend returned invalid JSON: ${err.message}`);
// //   }

// //   if (!response.ok) {
// //     const errorMessage = data?.error || `HTTP ${response.status}`;
// //     const errorDetails = data?.details || response.statusText;
// //     console.error("❌ Backend error response:", {
// //       status: response.status,
// //       error: errorMessage,
// //       details: errorDetails,
// //       fullResponse: data
// //     });
// //     throw new Error(`${errorMessage}: ${errorDetails}`);
// //   }

// //   return data;
// // };

// // // Helper function to make API requests with detailed logging
// // const apiRequest = async (url, options = {}) => {
// //   const fullUrl = `${BACKEND_URL}${url}`;
  
// //   console.log(`🚀 Making API request:`, {
// //     url: fullUrl,
// //     method: options.method || 'GET',
// //     headers: options.headers,
// //     hasBody: !!options.body
// //   });

// //   // Add default headers
// //   const defaultHeaders = {
// //     "Accept": "application/json",
// //     ...(options.headers || {})
// //   };

// //   if (options.body && typeof options.body === 'object') {
// //     defaultHeaders["Content-Type"] = "application/json";
// //     options.body = JSON.stringify(options.body);
// //     console.log("📤 Request body:", options.body);
// //   }

// //   try {
// //     const response = await fetch(fullUrl, {
// //       ...options,
// //       headers: defaultHeaders
// //     });

// //     return await handleResponse(response, fullUrl, options.method || 'GET');
// //   } catch (error) {
// //     console.error("❌ Network/Fetch error:", {
// //       message: error.message,
// //       stack: error.stack,
// //       url: fullUrl
// //     });
    
// //     // Provide more specific error messages
// //     if (error.name === 'TypeError' && error.message.includes('fetch')) {
// //       throw new Error("Network error: Unable to connect to server. Please check your connection and server status.");
// //     }
    
// //     throw error;
// //   }
// // };

// // // Test backend connectivity
// // export const testConnection = async () => {
// //   try {
// //     console.log("🔍 Testing backend connection...");
// //     const data = await apiRequest("/health");
// //     console.log("✅ Backend connection test successful:", data);
// //     return data;
// //   } catch (error) {
// //     console.error("❌ Backend connection test failed:", error);
// //     throw error;
// //   }
// // };

// // // Generate and save blog
// // export const generateBlog = async (topic) => {
// //   if (!topic || !topic.trim()) {
// //     throw new Error("Topic is required");
// //   }

// //   console.log(`🤖 Generating blog for topic: "${topic}"`);

// //   try {
// //     const data = await apiRequest("/generate_blog", {
// //       method: "POST",
// //       body: { topic: topic.trim() }
// //     });

// //     console.log("✅ Blog generated successfully:", {
// //       title: data.title,
// //       contentLength: data.content?.length,
// //       hasId: !!data._id
// //     });

// //     return data;
// //   } catch (error) {
// //     console.error("❌ Error generating blog:", error);
// //     throw error;
// //   }
// // };

// // // Generate blog without saving
// // export const generateBlogOnly = async (topic) => {
// //   if (!topic || !topic.trim()) {
// //     throw new Error("Topic is required");
// //   }

// //   console.log(`🤖 Generating blog (no save) for topic: "${topic}"`);

// //   try {
// //     const data = await apiRequest("/generate", {
// //       method: "POST",
// //       body: { topic: topic.trim() }
// //     });

// //     console.log("✅ Blog generated successfully (no save):", {
// //       title: data.title,
// //       contentLength: data.content?.length
// //     });

// //     return data;
// //   } catch (error) {
// //     console.error("❌ Error generating blog (no save):", error);
// //     throw error;
// //   }
// // };

// // // Get blog by ID
// // export const getBlogById = async (id) => {
// //   if (!id) {
// //     throw new Error("Blog ID is required");
// //   }

// //   console.log(`📖 Fetching blog with ID: ${id}`);

// //   try {
// //     const data = await apiRequest(`/blog/${id}`);
    
// //     console.log("✅ Blog fetched successfully:", {
// //       title: data.title,
// //       contentLength: data.content?.length
// //     });

// //     return data;
// //   } catch (error) {
// //     console.error("❌ Error fetching blog:", error);
// //     throw error;
// //   }
// // };

// // // Get all blogs
// // export const getAllBlogs = async () => {
// //   console.log("📚 Fetching all blogs...");

// //   try {
// //     const data = await apiRequest("/blogs");
// //     const blogs = data.blogs || [];
    
// //     console.log("✅ All blogs fetched successfully:", {
// //       count: blogs.length,
// //       blogs: blogs.map(b => ({ id: b._id, title: b.title }))
// //     });

// //     return blogs;
// //   } catch (error) {
// //     console.error("❌ Error fetching all blogs:", error);
// //     throw error;
// //   }
// // };

// // // Delete blog
// // export const deleteBlog = async (id) => {
// //   if (!id) {
// //     throw new Error("Blog ID is required");
// //   }

// //   console.log(`🗑️ Deleting blog with ID: ${id}`);

// //   try {
// //     const data = await apiRequest(`/blog/${id}`, {
// //       method: "DELETE"
// //     });

// //     console.log("✅ Blog deleted successfully:", data);
// //     return data;
// //   } catch (error) {
// //     console.error("❌ Error deleting blog:", error);
// //     throw error;
// //   }
// // };

// // // Initialize API (call this when your app starts)
// // export const initializeAPI = async () => {
// //   console.log("🚀 Initializing API connection...");
  
// //   try {
// //     await testConnection();
// //     console.log("✅ API initialized successfully");
// //     return true;
// //   } catch (error) {
// //     console.error("❌ API initialization failed:", error);
// //     return false;
// //   }
// // };

// // Enhanced utils/api.js with debug functions

// const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// console.log("🔧 Backend URL:", BACKEND_URL);

// // Helper function to handle API responses with detailed logging
// const handleResponse = async (response, url, method) => {
//   console.log(`📡 Response received from ${method} ${url}:`, {
//     status: response.status,
//     statusText: response.statusText,
//     headers: Object.fromEntries(response.headers.entries()),
//     ok: response.ok,
//     redirected: response.redirected,
//     type: response.type,
//     url: response.url
//   });

//   const text = await response.text();
//   console.log("🔎 Raw backend response:", {
//     length: text.length,
//     preview: text.substring(0, 500),
//     isEmpty: text.length === 0,
//     isWhitespace: text.trim().length === 0
//   });

//   // Check if response is empty
//   if (!text || text.trim().length === 0) {
//     console.error("❌ Empty response from backend");
//     console.error("🔍 Response details:", {
//       status: response.status,
//       statusText: response.statusText,
//       headers: Object.fromEntries(response.headers.entries())
//     });
//     throw new Error(`Backend returned empty response (Status: ${response.status})`);
//   }

//   let data;
//   try {
//     data = JSON.parse(text);
//     console.log("✅ Parsed JSON successfully:", {
//       type: typeof data,
//       keys: typeof data === 'object' ? Object.keys(data) : 'Not an object',
//       preview: data
//     });
//   } catch (err) {
//     console.error("❌ JSON Parse Error:", {
//       error: err.message,
//       responseText: text.substring(0, 1000),
//       responseLength: text.length
//     });
//     throw new Error(`Backend returned invalid JSON: ${err.message}. Response: ${text.substring(0, 200)}`);
//   }

//   if (!response.ok) {
//     const errorMessage = data?.error || `HTTP ${response.status}`;
//     const errorDetails = data?.details || response.statusText;
//     console.error("❌ Backend error response:", {
//       status: response.status,
//       error: errorMessage,
//       details: errorDetails,
//       fullResponse: data
//     });
//     throw new Error(`${errorMessage}: ${errorDetails}`);
//   }

//   return data;
// };

// // Helper function to make API requests with detailed logging
// const apiRequest = async (url, options = {}) => {
//   const fullUrl = `${BACKEND_URL}${url}`;
  
//   console.log(`🚀 Making API request:`, {
//     url: fullUrl,
//     method: options.method || 'GET',
//     headers: options.headers,
//     hasBody: !!options.body,
//     bodyType: typeof options.body,
//     timestamp: new Date().toISOString()
//   });

//   // Add default headers
//   const defaultHeaders = {
//     "Accept": "application/json",
//     "User-Agent": "BlogGenerator-Frontend/1.0",
//     ...(options.headers || {})
//   };

//   if (options.body && typeof options.body === 'object') {
//     defaultHeaders["Content-Type"] = "application/json";
//     options.body = JSON.stringify(options.body);
//     console.log("📤 Request body:", {
//       body: options.body,
//       length: options.body.length
//     });
//   }

//   try {
//     console.log("⏳ Sending fetch request...");
//     const response = await fetch(fullUrl, {
//       ...options,
//       headers: defaultHeaders,
//       timeout: 30000 // 30 second timeout
//     });

//     console.log("✅ Fetch completed, processing response...");
//     return await handleResponse(response, fullUrl, options.method || 'GET');
    
//   } catch (error) {
//     console.error("❌ Network/Fetch error:", {
//       message: error.message,
//       name: error.name,
//       stack: error.stack,
//       url: fullUrl,
//       timestamp: new Date().toISOString()
//     });
    
//     // Provide more specific error messages
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error("Network error: Unable to connect to server. Please check your connection and server status.");
//     } else if (error.name === 'AbortError') {
//       throw new Error("Request timed out. The server may be slow or unavailable.");
//     }
    
//     throw error;
//   }
// };

// // Test backend connectivity with detailed diagnostics
// export const testConnection = async () => {
//   try {
//     console.log("🔍 === TESTING BACKEND CONNECTION ===");
//     console.log("🔍 Testing /health endpoint...");
    
//     const data = await apiRequest("/health");
//     console.log("✅ Backend connection test successful:", data);
    
//     // Test additional endpoints
//     console.log("🔍 Testing /ping endpoint...");
//     try {
//       const pingData = await apiRequest("/ping");
//       console.log("✅ Ping test successful:", pingData);
//     } catch (pingError) {
//       console.warn("⚠️ Ping test failed, but health check passed:", pingError.message);
//     }
    
//     console.log("✅ === CONNECTION TEST COMPLETED ===");
//     return data;
    
//   } catch (error) {
//     console.error("❌ === CONNECTION TEST FAILED ===");
//     console.error("❌ Backend connection test failed:", error);
//     throw error;
//   }
// };

// // Test simple API endpoint
// export const testSimpleEndpoint = async () => {
//   try {
//     console.log("🧪 Testing /api/test endpoint...");
//     const data = await apiRequest("/test");
//     console.log("✅ Simple test successful:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Simple test failed:", error);
//     throw error;
//   }
// };

// // Debug blog generation (without database save)
// export const debugGenerateBlog = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required for debug generation");
//   }

//   console.log(`🐛 === DEBUG BLOG GENERATION ===`);
//   console.log(`🐛 Debug generating blog for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/debug_generate", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Debug blog generated successfully:", {
//       title: data.title,
//       contentLength: data.content?.length,
//       hasId: !!data._id,
//       isDebug: data.debug
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error in debug blog generation:", error);
//     throw error;
//   }
// };

// // Generate and save blog (original function with enhanced logging)
// export const generateBlog = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   console.log(`🤖 === FULL BLOG GENERATION ===`);
//   console.log(`🤖 Generating blog for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/generate_blog", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Blog generated successfully:", {
//       title: data.title,
//       contentLength: data.content?.length,
//       hasId: !!data._id,
//       hasNote: !!data.note
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error generating blog:", error);
//     throw error;
//   }
// };

// // Generate blog without saving (if endpoint exists)
// export const generateBlogOnly = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   console.log(`🤖 Generating blog (no save) for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/generate", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Blog generated successfully (no save):", {
//       title: data.title,
//       contentLength: data.content?.length
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error generating blog (no save):", error);
//     throw error;
//   }
// };

// // Get blog by ID
// export const getBlogById = async (id) => {
//   if (!id) {
//     throw new Error("Blog ID is required");
//   }

//   console.log(`📖 Fetching blog with ID: ${id}`);

//   try {
//     const data = await apiRequest(`/blog/${id}`);
    
//     console.log("✅ Blog fetched successfully:", {
//       title: data.title,
//       contentLength: data.content?.length
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error fetching blog:", error);
//     throw error;
//   }
// };

// // Get all blogs
// export const getAllBlogs = async () => {
//   console.log("📚 Fetching all blogs...");

//   try {
//     const data = await apiRequest("/blogs");
//     const blogs = data.blogs || [];
    
//     console.log("✅ All blogs fetched successfully:", {
//       count: blogs.length,
//       blogs: blogs.map(b => ({ id: b._id, title: b.title }))
//     });

//     return blogs;
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

//   console.log(`🗑️ Deleting blog with ID: ${id}`);

//   try {
//     const data = await apiRequest(`/blog/${id}`, {
//       method: "DELETE"
//     });

//     console.log("✅ Blog deleted successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Error deleting blog:", error);
//     throw error;
//   }
// };

// // Comprehensive API diagnostics
// export const runDiagnostics = async () => {
//   console.log("🔧 === RUNNING COMPREHENSIVE API DIAGNOSTICS ===");
  
//   const results = {
//     timestamp: new Date().toISOString(),
//     backendUrl: BACKEND_URL,
//     tests: {}
//   };
  
//   // Test 1: Basic connectivity
//   try {
//     console.log("🧪 Test 1: Basic connectivity...");
//     const healthResult = await testConnection();
//     results.tests.connectivity = { status: "✅ PASS", data: healthResult };
//   } catch (error) {
//     results.tests.connectivity = { status: "❌ FAIL", error: error.message };
//   }
  
//   // Test 2: Simple endpoint
//   try {
//     console.log("🧪 Test 2: Simple endpoint...");
//     const testResult = await testSimpleEndpoint();
//     results.tests.simpleEndpoint = { status: "✅ PASS", data: testResult };
//   } catch (error) {
//     results.tests.simpleEndpoint = { status: "❌ FAIL", error: error.message };
//   }
  
//   // Test 3: Debug blog generation
//   try {
//     console.log("🧪 Test 3: Debug blog generation...");
//     const debugResult = await debugGenerateBlog("test topic");
//     results.tests.debugGeneration = { status: "✅ PASS", data: { title: debugResult.title, contentLength: debugResult.content?.length } };
//   } catch (error) {
//     results.tests.debugGeneration = { status: "❌ FAIL", error: error.message };
//   }
  
//   console.log("🔧 === DIAGNOSTICS COMPLETED ===");
//   console.log("📋 Results:", results);
  
//   return results;
// };

// // Initialize API (call this when your app starts)
// export const initializeAPI = async () => {
//   console.log("🚀 === INITIALIZING API CONNECTION ===");
  
//   try {
//     await testConnection();
//     console.log("✅ API initialized successfully");
//     return true;
//   } catch (error) {
//     console.error("❌ API initialization failed:", error);
//     return false;
//   }
// };

// Enhanced utils/api.js with debug functions

// const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

// console.log("🔧 Backend URL:", BACKEND_URL);

// // Helper function to handle API responses with detailed logging
// const handleResponse = async (response, url, method) => {
//   console.log(`📡 Response received from ${method} ${url}:`, {
//     status: response.status,
//     statusText: response.statusText,
//     headers: Object.fromEntries(response.headers.entries()),
//     ok: response.ok,
//     redirected: response.redirected,
//     type: response.type,
//     url: response.url
//   });

//   const text = await response.text();
//   console.log("🔎 Raw backend response:", {
//     length: text.length,
//     preview: text.substring(0, 500),
//     isEmpty: text.length === 0,
//     isWhitespace: text.trim().length === 0
//   });

//   // Check if response is empty
//   if (!text || text.trim().length === 0) {
//     console.error("❌ Empty response from backend");
//     console.error("🔍 Response details:", {
//       status: response.status,
//       statusText: response.statusText,
//       headers: Object.fromEntries(response.headers.entries())
//     });
//     throw new Error(`Backend returned empty response (Status: ${response.status})`);
//   }

//   let data;
//   try {
//     data = JSON.parse(text);
//     console.log("✅ Parsed JSON successfully:", {
//       type: typeof data,
//       keys: typeof data === 'object' ? Object.keys(data) : 'Not an object',
//       preview: data
//     });
//   } catch (err) {
//     console.error("❌ JSON Parse Error:", {
//       error: err.message,
//       responseText: text.substring(0, 1000),
//       responseLength: text.length
//     });
//     throw new Error(`Backend returned invalid JSON: ${err.message}. Response: ${text.substring(0, 200)}`);
//   }

//   if (!response.ok) {
//     const errorMessage = data?.error || `HTTP ${response.status}`;
//     const errorDetails = data?.details || response.statusText;
//     console.error("❌ Backend error response:", {
//       status: response.status,
//       error: errorMessage,
//       details: errorDetails,
//       fullResponse: data
//     });
//     throw new Error(`${errorMessage}: ${errorDetails}`);
//   }

//   return data;
// };

// // Helper function to make API requests with detailed logging
// const apiRequest = async (url, options = {}) => {
//   const fullUrl = `${BACKEND_URL}${url}`;
  
//   console.log(`🚀 Making API request:`, {
//     url: fullUrl,
//     method: options.method || 'GET',
//     headers: options.headers,
//     hasBody: !!options.body,
//     bodyType: typeof options.body,
//     timestamp: new Date().toISOString()
//   });

//   // Add default headers
//   const defaultHeaders = {
//     "Accept": "application/json",
//     "User-Agent": "BlogGenerator-Frontend/1.0",
//     ...(options.headers || {})
//   };

//   if (options.body && typeof options.body === 'object') {
//     defaultHeaders["Content-Type"] = "application/json";
//     options.body = JSON.stringify(options.body);
//     console.log("📤 Request body:", {
//       body: options.body,
//       length: options.body.length
//     });
//   }

//   try {
//     console.log("⏳ Sending fetch request...");
//     const response = await fetch(fullUrl, {
//       ...options,
//       headers: defaultHeaders,
//       timeout: 30000 // 30 second timeout
//     });

//     console.log("✅ Fetch completed, processing response...");
//     return await handleResponse(response, fullUrl, options.method || 'GET');
    
//   } catch (error) {
//     console.error("❌ Network/Fetch error:", {
//       message: error.message,
//       name: error.name,
//       stack: error.stack,
//       url: fullUrl,
//       timestamp: new Date().toISOString()
//     });
    
//     // Provide more specific error messages
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error("Network error: Unable to connect to server. Please check your connection and server status.");
//     } else if (error.name === 'AbortError') {
//       throw new Error("Request timed out. The server may be slow or unavailable.");
//     }
    
//     throw error;
//   }
// };

// // Test backend connectivity with detailed diagnostics
// export const testConnection = async () => {
//   try {
//     console.log("🔍 === TESTING BACKEND CONNECTION ===");
//     console.log("🔍 Testing /health endpoint...");
    
//     const data = await apiRequest("/health");
//     console.log("✅ Backend connection test successful:", data);
    
//     // Test additional endpoints
//     console.log("🔍 Testing /ping endpoint...");
//     try {
//       const pingData = await apiRequest("/ping");
//       console.log("✅ Ping test successful:", pingData);
//     } catch (pingError) {
//       console.warn("⚠️ Ping test failed, but health check passed:", pingError.message);
//     }
    
//     console.log("✅ === CONNECTION TEST COMPLETED ===");
//     return data;
    
//   } catch (error) {
//     console.error("❌ === CONNECTION TEST FAILED ===");
//     console.error("❌ Backend connection test failed:", error);
//     throw error;
//   }
// };

// // Test simple API endpoint
// export const testSimpleEndpoint = async () => {
//   try {
//     console.log("🧪 Testing /api/test endpoint...");
//     const data = await apiRequest("/test");
//     console.log("✅ Simple test successful:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Simple test failed:", error);
//     throw error;
//   }
// };

// // Debug blog generation (without database save)
// export const debugGenerateBlog = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required for debug generation");
//   }

//   console.log(`🐛 === DEBUG BLOG GENERATION ===`);
//   console.log(`🐛 Debug generating blog for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/debug_generate", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Debug blog generated successfully:", {
//       title: data.title,
//       contentLength: data.content?.length,
//       hasId: !!data._id,
//       isDebug: data.debug
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error in debug blog generation:", error);
//     throw error;
//   }
// };

// // Generate and save blog (original function with enhanced logging)
// export const generateBlog = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   console.log(`🤖 === FULL BLOG GENERATION ===`);
//   console.log(`🤖 Generating blog for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/generate_blog", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Blog generated successfully:", {
//       title: data.title,
//       contentLength: data.content?.length,
//       hasId: !!data._id,
//       hasNote: !!data.note
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error generating blog:", error);
//     throw error;
//   }
// };

// // Generate blog without saving (if endpoint exists)
// export const generateBlogOnly = async (topic) => {
//   if (!topic || !topic.trim()) {
//     throw new Error("Topic is required");
//   }

//   console.log(`🤖 Generating blog (no save) for topic: "${topic}"`);

//   try {
//     const data = await apiRequest("/generate", {
//       method: "POST",
//       body: { topic: topic.trim() }
//     });

//     console.log("✅ Blog generated successfully (no save):", {
//       title: data.title,
//       contentLength: data.content?.length
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error generating blog (no save):", error);
//     throw error;
//   }
// };

// // Get blog by ID
// export const getBlogById = async (id) => {
//   if (!id) {
//     throw new Error("Blog ID is required");
//   }

//   console.log(`📖 Fetching blog with ID: ${id}`);

//   try {
//     const data = await apiRequest(`/blog/${id}`);
    
//     console.log("✅ Blog fetched successfully:", {
//       title: data.title,
//       contentLength: data.content?.length
//     });

//     return data;
//   } catch (error) {
//     console.error("❌ Error fetching blog:", error);
//     throw error;
//   }
// };

// // Get all blogs
// export const getAllBlogs = async () => {
//   console.log("📚 Fetching all blogs...");

//   try {
//     const data = await apiRequest("/blogs");
//     const blogs = data.blogs || [];
    
//     console.log("✅ All blogs fetched successfully:", {
//       count: blogs.length,
//       blogs: blogs.map(b => ({ id: b._id, title: b.title }))
//     });

//     return blogs;
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

//   console.log(`🗑️ Deleting blog with ID: ${id}`);

//   try {
//     const data = await apiRequest(`/blog/${id}`, {
//       method: "DELETE"
//     });

//     console.log("✅ Blog deleted successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Error deleting blog:", error);
//     throw error;
//   }
// };

// // Comprehensive API diagnostics
// export const runDiagnostics = async () => {
//   console.log("🔧 === RUNNING COMPREHENSIVE API DIAGNOSTICS ===");
  
//   const results = {
//     timestamp: new Date().toISOString(),
//     backendUrl: BACKEND_URL,
//     tests: {}
//   };
  
//   // Test 1: Basic connectivity
//   try {
//     console.log("🧪 Test 1: Basic connectivity...");
//     const healthResult = await testConnection();
//     results.tests.connectivity = { status: "✅ PASS", data: healthResult };
//   } catch (error) {
//     results.tests.connectivity = { status: "❌ FAIL", error: error.message };
//   }
  
//   // Test 2: Simple endpoint
//   try {
//     console.log("🧪 Test 2: Simple endpoint...");
//     const testResult = await testSimpleEndpoint();
//     results.tests.simpleEndpoint = { status: "✅ PASS", data: testResult };
//   } catch (error) {
//     results.tests.simpleEndpoint = { status: "❌ FAIL", error: error.message };
//   }
  
//   // Test 3: Debug blog generation
//   try {
//     console.log("🧪 Test 3: Debug blog generation...");
//     const debugResult = await debugGenerateBlog("test topic");
//     results.tests.debugGeneration = { status: "✅ PASS", data: { title: debugResult.title, contentLength: debugResult.content?.length } };
//   } catch (error) {
//     results.tests.debugGeneration = { status: "❌ FAIL", error: error.message };
//   }
  
//   console.log("🔧 === DIAGNOSTICS COMPLETED ===");
//   console.log("📋 Results:", results);
  
//   return results;
// };

// // Initialize API (call this when your app starts)
// export const initializeAPI = async () => {
//   console.log("🚀 === INITIALIZING API CONNECTION ===");
  
//   try {
//     await testConnection();
//     console.log("✅ API initialized successfully");
//     return true;
//   } catch (error) {
//     console.error("❌ API initialization failed:", error);
//     return false;
//   }
// };

// src/api/api.js

// 🌍 Backend URL (prod ke liye Render, dev ke liye localhost)
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

// Debug mode (sirf development me console logs dikhayega)
const DEBUG = import.meta.env.MODE !== "production";
const log = (...args) => {
  if (DEBUG) console.log(...args);
};

// ✅ Safe JSON/Text parser
async function parseResponse(response) {
  const text = await response.text();

  if (!text) return null; // Empty response (204 etc.)

  try {
    return JSON.parse(text);
  } catch {
    log("⚠️ Response JSON nahi tha, text return kar raha hu");
    return text;
  }
}

// ✅ Centralized API Request Wrapper
async function apiRequest(endpoint, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${BASE_URL}${endpoint}`;

  try {
    log(`📡 Request: ${options.method || "GET"} ${url}`, options);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(
        `API Error ${response.status}: ${JSON.stringify(data)}`
      );
    }

    log("✅ Response:", { status: response.status, data });
    return data;
  } catch (error) {
    log("❌ API Request Failed:", error);
    throw error;
  }
}

//
// 🚀 API Functions
//
export const generateBlog = (blogRequest) =>
  apiRequest("/generate_blog", {
    method: "POST",
    body: JSON.stringify(blogRequest),
  });

export const getBlogById = (id) => apiRequest(`/blogs/${id}`);

export const deleteBlog = (id) =>
  apiRequest(`/blogs/${id}`, { method: "DELETE" });

export const getBlogHistory = () => apiRequest("/blogs");

// Health check endpoints
export const checkHealth = () => apiRequest("/health");
export const checkPing = () => apiRequest("/ping");
