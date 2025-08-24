// import React, { useEffect, useState } from 'react';
// import { Sparkles, Plus, X } from 'lucide-react';
// import { getHistory, getBlogById } from '../../utils/api'; // ✅ Use our new API functions

// const Sidebar = ({ isOpen, onToggle, onBlogSelect }) => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (isOpen) {
//       getHistory()
//         .then(data => {
//           console.log("🧠 History response:", data);
//           setHistory(data.history || []);
//         })
//         .catch(err => {
//           console.error("Error loading history:", err);
//           setHistory([]);
//         });
//     }
//   }, [isOpen]);

//   const handleBlogClick = async (item) => {
//     try {
//       const fullBlog = await getBlogById(item.id);
//       onBlogSelect(fullBlog); // Send full blog data to AppPage
//     } catch (err) {
//       console.error("Failed to load blog", err);
//       // Optionally, show an error to the user
//     }
//   };

//   const handleNewBlog = () => {
//     onBlogSelect(null); // Setting blog to null signifies a new session
//     onToggle(); // Close sidebar
//   }

//   const formatTime = (isoString) => {
//     if (!isoString) return '';
//     const date = new Date(isoString);
//     return date.toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short"
//     });
//   };

//   return (
//     <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 overflow-hidden h-screen fixed top-0 left-0 z-50`}>
//       <div className="p-4 h-full flex flex-col">
//         <div className="flex justify-end mb-2">
//           <button onClick={onToggle} className="text-gray-400 hover:text-white transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="flex items-center space-x-2 mb-8">
//           <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
//             <Sparkles className="w-5 h-5 text-white" />
//           </div>
//           <span className="text-xl font-bold text-white">BlogAI</span>
//         </div>
//         <button onClick={handleNewBlog} className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center space-x-2 mb-6 transition-colors">
//           <Plus className="w-5 h-5" />
//           <span>New Blog Post</span>
//         </button>
//         <div className="space-y-2 overflow-y-auto flex-1">
//           <div className="text-gray-400 text-sm font-medium mb-2">Recent Generations</div>
//           {Array.isArray(history) && history.map((item) => (
//             <div
//               key={item.id}
//               onClick={() => handleBlogClick(item)}
//               className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
//             >
//               <div className="text-white text-sm truncate">{item.title}</div>
//               <div className="text-gray-400 text-xs">{formatTime(item.created_at)}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// components/layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ApiService from "../../utils/apiService";

const Sidebar = ({ isOpen, onToggle, onBlogSelect }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    if (isOpen) {
      fetchBlogs();
    }
  }, [isOpen, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Use ApiService instead of direct API call
      const data = await ApiService.getMyBlogs();

      // Handle pagination if your API supports it
      const startIndex = (currentPage - 1) * blogsPerPage;
      const endIndex = startIndex + blogsPerPage;
      const paginatedBlogs = data.slice(startIndex, endIndex);
      setBlogs(paginatedBlogs);
      setTotalPages(Math.ceil(data.length / blogsPerPage));
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");

      // Check if it's an authentication error
      if (err.message.includes("token") || err.message.includes("auth")) {
        setError("Session expired. Please refresh the page and log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId, event) => {
    event.stopPropagation(); // Prevent triggering onBlogSelect

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      // ✅ Use ApiService instead of direct API call
      await ApiService.deleteBlog(blogId);

      // Refresh the blogs list
      await fetchBlogs();

      // Show success message (optional)
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleNewBlog = () => {
    onBlogSelect(null); // null indicates new blog
  };

  const handleBlogClick = (blog) => {
    onBlogSelect(blog);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onToggle}
      ></div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">My Blogs</h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* New Blog Button */}
          <div className="p-4 border-b">
            <button
              onClick={handleNewBlog}
              className="w-full flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Blog</span>
            </button>
          </div>

          {/* Blogs List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading blogs...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchBlogs}
                  className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No blogs yet</p>
                <p className="text-xs">Create your first blog!</p>
              </div>
            ) : (
              <div className="p-2">
                {blogs.map((blog) => (
                  <div
                    key={blog.id || blog._id}
                    onClick={() => handleBlogClick(blog)}
                    className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer group mb-1"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate text-sm">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteBlog(blog.id || blog._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      title="Delete blog"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
