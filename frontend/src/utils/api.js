// utils/api.js
// export const generateBlog = async (topic) => {
//   const BACKEND_URL = import.meta.env.BACKEND_API_URL;
//   const response = await fetch(`${BACKEND_URL}/generate_blog`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ topic }),
//   });

//   if (!response.ok) throw new Error("Failed to generate blog");
//   return await response.json();
// };


// utils/api.js
export const generateBlog = async (topic) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await fetch(`${BACKEND_URL}/generate_blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  const text = await response.text(); // always capture raw response

  if (!response.ok) {
    console.error("Backend error:", response.status, text);
    throw new Error(`Failed (${response.status}): ${text}`);
  }

  try {
    return JSON.parse(text); // ✅ safe parse
  } catch (err) {
    console.error("Invalid JSON from backend:", text);
    throw new Error("Backend did not return valid JSON");
  }
};
