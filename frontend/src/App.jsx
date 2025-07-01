// import { useState } from 'react';
// import axios from 'axios';
// import BlogDisplay from './components/BlogDisplay';

// function App() {
//   const [topic, setTopic] = useState('');
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const generateBlog = async () => {
//     if (!topic.trim()) return;
//     setLoading(true);
//     try {
//   const res = await axios.post(`${import.meta.env.VITE_API_URL}/generate_blog`, {
//     topic,
//   });
//   console.log("Blog:", res.data);
//   setBlog(res.data);
// } catch (err) {
//   console.error("Error:", err);
//   console.error("Response:", err.response);
//   alert("Error: " + (err.response?.data?.detail || err.message || "Unknown error"));
// }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-2xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4">🧠 Auto Blog Generator</h1>
//         <input
//           type="text"
//           className="w-full p-3 rounded-lg border mb-4"
//           placeholder="Enter a blog topic..."
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//         />
//         <button
//           onClick={generateBlog}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
//         >
//           {loading ? 'Generating...' : 'Generate Blog'}
//         </button>
//       </div>
//       <div className="mt-10">
//         <BlogDisplay blog={blog} />
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.jsx
// import React, { useState, useEffect } from "react";
// import BlogForm from "./components/BlogForm";
// import BlogDisplay from "./components/BlogDisplay";
// import HistorySidebar from "./components/HistorySidebar";
// import SidebarIcon from "./assets/sidebar.svg"; // adjust path if needed

// const App = () => {

//   const [sidebarOpen, setSidebarOpen] = useState(() => {
//   const saved = localStorage.getItem("sidebar_open");
//   return saved === null ? true : saved === "true";
// });

//   const [history, setHistory] = useState([]);
//   const [currentBlog, setCurrentBlog] = useState(null);

//   useEffect(() => {
//   localStorage.setItem("sidebar_open", sidebarOpen);
// }, [sidebarOpen]);

//   // Load history from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("blog_history");
//     if (saved) {
//       setHistory(JSON.parse(saved));
//       setCurrentBlog(JSON.parse(saved)[0]?.blog || null); // open last viewed
//     }
//   }, []);

//   // Save history to localStorage
//   useEffect(() => {
//     localStorage.setItem("blog_history", JSON.stringify(history));
//   }, [history]);

//   const handleNewBlog = (blog) => {
//     setCurrentBlog(blog);
//     const newEntry = {
//       title: blog.title,
//       date: new Date().toLocaleString(),
//       blog,
//     };

//     const updated = [newEntry, ...history];
//     setHistory(updated);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       {sidebarOpen && (
//         <HistorySidebar
//           history={history}
//           onSelect={setCurrentBlog}
//           onClose={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Area */}
//       <div className="flex-1 overflow-y-auto">
//         {/* Header with toggle button */}
//         <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
//           {!sidebarOpen && (
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="p-2 rounded hover:bg-gray-200"
//               title="Open Sidebar"
//             >
//               <img src={SidebarIcon} alt="Open Sidebar" className="w-6 h-6" />
//             </button>
//           )}

//           <h1 className="text-xl font-semibold text-gray-700">
//             🧠 Auto Blog Generator
//           </h1>
//         </div>

//         <BlogForm onGenerate={handleNewBlog} />
//         <BlogDisplay blog={currentBlog} />
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react";
import BlogForm from "./components/BlogForm";
import BlogDisplay from "./components/BlogDisplay";
import HistorySidebar from "./components/HistorySidebar";
import SidebarIcon from "./assets/sidebar.svg";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar_open");
    return saved === null ? true : saved === "true";
  });

  const [history, setHistory] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem("sidebar_open", sidebarOpen);
  }, [sidebarOpen]);

  // Load blog history on startup
  useEffect(() => {
    const saved = localStorage.getItem("blog_history");
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      setCurrentBlog(parsed[0]?.blog || null);
    }
  }, []);

  // Save blog history
  useEffect(() => {
    localStorage.setItem("blog_history", JSON.stringify(history));
  }, [history]);

  const handleNewBlog = (blog) => {
    setCurrentBlog(blog);
    const newEntry = {
      title: blog.title,
      date: new Date().toLocaleString(),
      blog,
    };
    setHistory([newEntry, ...history]);
  };

  return (
    <div className="flex h-screen">
      {/* ⏪ Sidebar with animation */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <HistorySidebar
          history={history}
          onSelect={setCurrentBlog}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* 🧠 Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
        <div className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                title="Open Sidebar"
                className="p-2 rounded hover:bg-gray-100 transition"
              >
                <img src={SidebarIcon} alt="Open Sidebar" className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-700">🧠 Auto Blog Generator</h1>
          </div>

          <button
            onClick={() => setCurrentBlog(null)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ➕ New Blog
          </button>
        </div>

        <BlogForm onGenerate={handleNewBlog} />
        <BlogDisplay blog={currentBlog} />
      </div>
    </div>
  );
};

export default App;
