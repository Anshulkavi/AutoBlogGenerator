// // src/components/pages/AppPage.jsx
// import React, { useState } from "react";
// import Sidebar from "../layout/Sidebar";
// import AppHeader from "../app/AppHeader";
// import MessagesArea from "../app/MessagesArea";
// import InputArea from "../app/InputArea";
// import BlogDisplay from "../app/BlogDisplay";
// import { generateBlog } from "../../utils/api";

// const AppPage = ({ onBackToHome }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [generatedBlog, setGeneratedBlog] = useState(null);
//   const [viewMode, setViewMode] = useState("chat"); // ✅ Must be declared

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isGenerating) return;

//     const userMessage = {
//       id: Date.now(),
//       type: "user",
//       content: inputValue,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsGenerating(true);

//     try {
//       const data = await generateBlog(inputValue);

//       const aiMessage = {
//         id: Date.now() + 1,
//         type: "assistant",
//         content: data.content, // ✅ Correct
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);

//       setGeneratedBlog({
//         title:
//           data.title ||
//           `${
//             inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
//           }: A Comprehensive Guide`,
//         content: data.content, // ✅ Correct
//         topic: data.topic,
//         image_url: "", // optional
//       });
//     } catch (err) {
//       console.error("❌ Blog generation error:", err);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSampleClick = (text) => {
//     setInputValue(text);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar
//         isOpen={sidebarOpen}
//         onToggle={() => setSidebarOpen(false)}
//         onBlogSelect={(blog) => {
//           setGeneratedBlog(blog);
//           setViewMode("blog");
//           setMessages([]);
//         }}
//       />

//       <div
//         className={`flex-1 flex flex-col transition-all duration-300 ${
//           sidebarOpen ? "ml-64" : "ml-0"
//         }`}
//       >
//         <AppHeader
//           sidebarOpen={sidebarOpen}
//           onToggleSidebar={() => setSidebarOpen(true)}
//           onBackToHome={onBackToHome}
//           viewMode={viewMode}
//           setViewMode={setViewMode}
//         />

//         {/* 🧠 Show blog if available */}
//         {/* 🔁 Conditional View Rendering */}
//         {generatedBlog && viewMode === "blog" && (
//           <div className="overflow-y-auto p-6">
//             <BlogDisplay blog={generatedBlog} />
//           </div>
//         )}

//         {(!generatedBlog || viewMode === "chat") && (
//           <MessagesArea
//             messages={messages}
//             isGenerating={isGenerating}
//             onSampleClick={handleSampleClick}
//           />
//         )}

//         {generatedBlog && viewMode === "both" && (
//           <div className="flex overflow-y-auto p-6 gap-4">
//             <div className="w-1/2 border-r pr-4">
//               <MessagesArea
//                 messages={messages}
//                 isGenerating={isGenerating}
//                 onSampleClick={handleSampleClick}
//               />
//             </div>
//             <div className="w-1/2 pl-4">
//               <BlogDisplay blog={generatedBlog} />
//             </div>
//           </div>
//         )}

//         {/* ✍️ Always show input area */}
//         <InputArea
//           inputValue={inputValue}
//           onInputChange={setInputValue}
//           onSendMessage={handleSendMessage}
//           isGenerating={isGenerating}
//         />
//       </div>
//     </div>
//   );
// };

// export default AppPage;

// src/components/pages/AppPage.jsx
import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AppHeader from "../app/AppHeader";
import MessagesArea from "../app/MessagesArea";
import InputArea from "../app/InputArea";
import BlogDisplay from "../app/BlogDisplay";
import { generateBlog } from "../../utils/api";

const AppPage = ({ onBackToHome }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [viewMode, setViewMode] = useState("chat");
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isGenerating) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsGenerating(true);
    setError("");

    try {
      const data = await generateBlog(trimmedInput);

      // Validate response data
      if (!data || !data.title || !data.content) {
        throw new Error("Invalid blog data received from server");
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: `# ${data.title}\n\n${data.content}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      setGeneratedBlog({
        id: data._id || Date.now().toString(),
        title: data.title,
        content: data.content,
        topic: data.topic || trimmedInput,
        created_at: data.created_at || new Date().toISOString(),
        image_url: data.image_url || "",
      });

      // Auto-switch to blog view after generation
      setViewMode("blog");

    } catch (err) {
      console.error("❌ Blog generation error:", err);
      
      let errorMessage = "Failed to generate blog. Please try again.";
      
      if (err.message.includes("Topic is required")) {
        errorMessage = "Please enter a valid topic.";
      } else if (err.message.includes("Invalid JSON")) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes("HTTP 5")) {
        errorMessage = "Server is currently unavailable. Please try again later.";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      }

      const errorMessage2 = {
        id: Date.now() + 1,
        type: "assistant",
        content: `❌ **Error**: ${errorMessage}`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage2]);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSampleClick = (text) => {
    setInputValue(text);
    setError("");
  };

  const handleBlogSelect = (blog) => {
    setGeneratedBlog({
      id: blog._id || blog.id,
      title: blog.title,
      content: blog.content,
      topic: blog.topic,
      created_at: blog.created_at,
      image_url: blog.image_url || "",
    });
    setViewMode("blog");
    setMessages([]);
    setSidebarOpen(false);
    setError("");
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onBlogSelect={handleBlogSelect}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <AppHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onBackToHome={onBackToHome}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Conditional View Rendering */}
        <div className="flex-1 overflow-hidden">
          {/* Blog View */}
          {generatedBlog && viewMode === "blog" && (
            <div className="h-full overflow-y-auto p-6">
              <BlogDisplay blog={generatedBlog} />
            </div>
          )}

          {/* Chat View */}
          {(!generatedBlog || viewMode === "chat") && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <MessagesArea
                  messages={messages}
                  isGenerating={isGenerating}
                  onSampleClick={handleSampleClick}
                />
              </div>
            </div>
          )}

          {/* Both View */}
          {generatedBlog && viewMode === "both" && (
            <div className="h-full flex gap-4 p-6">
              <div className="w-1/2 border-r pr-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Chat History</h3>
                <div className="flex-1 overflow-y-auto">
                  <MessagesArea
                    messages={messages}
                    isGenerating={isGenerating}
                    onSampleClick={handleSampleClick}
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Generated Blog</h3>
                <div className="flex-1 overflow-y-auto">
                  <BlogDisplay blog={generatedBlog} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Always show when not in blog-only view */}
        {(!generatedBlog || viewMode !== "blog") && (
          <InputArea
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default AppPage;