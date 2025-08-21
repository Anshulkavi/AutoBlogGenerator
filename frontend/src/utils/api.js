// utils/api.js
export const generateBlog = async (topic) => {
  const BACKEND_URL = import.meta.env.BACKEND_API_URL;
  const response = await fetch(`${BACKEND_URL}/generate_blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) throw new Error("Failed to generate blog");
  return await response.json();
};
en