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

// src/components/pages/AppPage.jsx - FIXED VERSION
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

  // Enhanced validation function that handles different response formats
  const validateBlogData = (data) => {
    console.log("🔍 Validating blog data:", data);
    
    // Handle null/undefined
    if (!data) {
      console.error("❌ Data is null/undefined");
      return { valid: false, error: "No data received from server" };
    }

    // Handle diagnostic responses
    if (data.diagnostic) {
      console.log("🧪 Diagnostic response detected:", data);
      
      if (data.message && data.topic) {
        // Create a mock blog from diagnostic data
        return {
          valid: true,
          blog: {
            title: `Diagnostic Response: ${data.topic}`,
            content: `# Diagnostic Mode\n\n**Message:** ${data.message}\n\n**Topic:** ${data.topic}\n\n**Timestamp:** ${data.timestamp}\n\nThis is a diagnostic response from the server. The blog generation service is in diagnostic mode.\n\n${JSON.stringify(data, null, 2)}`,
            topic: data.topic,
            diagnostic: true
          }
        };
      }
      
      return {
        valid: false,
        error: `Diagnostic response: ${data.message || 'Unknown diagnostic state'}`
      };
    }

    // Handle regular blog data
    if (data.title && data.content) {
      console.log("✅ Valid blog data found");
      return {
        valid: true,
        blog: {
          id: data._id || data.id || Date.now().toString(),
          title: data.title,
          content: data.content,
          topic: data.topic,
          created_at: data.created_at || new Date().toISOString(),
          image_url: data.image_url || ""
        }
      };
    }

    // Handle partial data
    if (data.title || data.content) {
      console.warn("⚠️ Partial blog data:", { hasTitle: !!data.title, hasContent: !!data.content });
      return {
        valid: true,
        blog: {
          id: data._id || data.id || Date.now().toString(),
          title: data.title || "Untitled Blog Post",
          content: data.content || "No content available.",
          topic: data.topic || inputValue,
          created_at: data.created_at || new Date().toISOString(),
          image_url: data.image_url || ""
        }
      };
    }

    // Handle error responses
    if (data.error) {
      console.error("❌ Error response:", data.error);
      return {
        valid: false,
        error: `Server error: ${data.error}${data.details ? ` - ${data.details}` : ''}`
      };
    }

    // Fallback for unknown formats
    console.error("❌ Unknown data format:", data);
    return {
      valid: false,
      error: `Unknown response format. Received: ${JSON.stringify(data).substring(0, 100)}...`
    };
  };

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
      console.log("🚀 Starting blog generation for:", trimmedInput);
      const data = await generateBlog(trimmedInput);
      
      console.log("📥 Received response:", data);
      
      // Enhanced validation
      const validation = validateBlogData(data);
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const blog = validation.blog;
      console.log("✅ Validated blog:", blog);

      // Create AI message with the blog content
      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: blog.diagnostic 
          ? `🧪 **Diagnostic Mode Activated**\n\n${blog.content}`
          : `# ${blog.title}\n\n${blog.content}`,
        timestamp: new Date(),
        isDiagnostic: blog.diagnostic
      };

      setMessages((prev) => [...prev, aiMessage]);
      setGeneratedBlog(blog);

      // Auto-switch to blog view after generation (unless diagnostic)
      if (!blog.diagnostic) {
        setViewMode("blog");
      }

    } catch (err) {
      console.error("❌ Blog generation error:", err);
      
      // Enhanced error handling
      let errorMessage = "Failed to generate blog. Please try again.";
      let technicalDetails = "";
      
      if (err.message.includes("Topic is required")) {
        errorMessage = "Please enter a valid topic.";
      } else if (err.message.includes("Invalid JSON")) {
        errorMessage = "Server returned invalid data. Please try again later.";
        technicalDetails = "The server response was not in valid JSON format.";
      } else if (err.message.includes("HTTP 5")) {
        errorMessage = "Server is currently unavailable. Please try again later.";
        technicalDetails = "Internal server error occurred.";
      } else if (err.message.includes("HTTP 4")) {
        errorMessage = "Invalid request. Please check your input.";
        technicalDetails = "Client error - check your input format.";
      } else if (err.message.includes("network") || err.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection.";
        technicalDetails = "Unable to connect to the server.";
      } else if (err.message.includes("diagnostic")) {
        errorMessage = `Diagnostic Mode: ${err.message}`;
        technicalDetails = "The server is running in diagnostic mode.";
      } else {
        technicalDetails = err.message;
      }

      const errorMessageObj = {
        id: Date.now() + 1,
        type: "assistant",
        content: `❌ **Error**: ${errorMessage}${technicalDetails ? `\n\n*Technical details: ${technicalDetails}*` : ''}`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessageObj]);
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
    const processedBlog = {
      id: blog._id || blog.id,
      title: blog.title,
      content: blog.content,
      topic: blog.topic,
      created_at: blog.created_at,
      image_url: blog.image_url || "",
    };
    
    console.log("📖 Selected blog:", processedBlog);
    
    setGeneratedBlog(processedBlog);
    setViewMode("blog");
    setMessages([]);
    setSidebarOpen(false);
    setError("");
  };

  const clearError = () => {
    setError("");
  };

  // Debug function for testing
  const handleDebugTest = async () => {
    console.log("🧪 Running debug test...");
    setError("");
    
    try {
      const testData = {
        diagnostic: true,
        message: "Test diagnostic response",
        topic: "test topic",
        timestamp: new Date().toISOString()
      };
      
      const validation = validateBlogData(testData);
      console.log("🧪 Debug validation result:", validation);
      
      if (validation.valid) {
        setGeneratedBlog(validation.blog);
        setViewMode("blog");
      } else {
        setError(`Debug test failed: ${validation.error}`);
      }
    } catch (err) {
      console.error("❌ Debug test error:", err);
      setError(`Debug test error: ${err.message}`);
    }
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

        {/* Enhanced Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-2">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={clearError}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={handleDebugTest}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Run Debug Test
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 ml-4"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Development Debug Panel (remove in production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mx-6 mt-2">
            <div className="text-sm text-yellow-700">
              <strong>🧪 Debug Panel:</strong> 
              <button
                onClick={handleDebugTest}
                className="ml-2 text-yellow-800 underline hover:no-underline"
              >
                Test Validation Logic
              </button>
              <span className="ml-2">•</span>
              <button
                onClick={() => console.log('Current state:', { messages, generatedBlog, viewMode })}
                className="ml-2 text-yellow-800 underline hover:no-underline"
              >
                Log Current State
              </button>
            </div>
          </div>
        )} */}

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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Generated Blog {generatedBlog.diagnostic && "(Diagnostic Mode)"}
                </h3>
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