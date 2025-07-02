// utils/api.js
export const generateBlog = async (topic) => {
  const response = await fetch("http://localhost:8000/api/generate_blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) throw new Error("Failed to generate blog");
  return await response.json();
};
