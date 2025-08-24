// import React, { useState, useRef, useEffect } from "react";
// import Sidebar from "../layout/Sidebar";
// import AppHeader from "../app/AppHeader";
// import MessagesArea from "../app/MessagesArea";
// import InputArea from "../app/InputArea";
// import BlogDisplay from "../app/BlogDisplay";
// // ✅ Import the new functions
// import { startBlogGeneration, getGenerationStatus } from "../../utils/api";

// const AppPage = ({ onBackToHome }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [generatedBlog, setGeneratedBlog] = useState(null);
//   const [viewMode, setViewMode] = useState("chat");
//   const [error, setError] = useState("");

//   // Ref to hold the interval ID for polling
//   const pollingIntervalRef = useRef(null);

//   // Function to stop polling
//   const stopPolling = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   };
  
//   // Cleanup polling on component unmount
//   useEffect(() => {
//     return () => stopPolling();
//   }, []);

//   const handleSendMessage = async () => {
//     const trimmedInput = inputValue.trim();
//     if (!trimmedInput || isGenerating) return;

//     const userMessage = { id: Date.now(), type: "user", content: trimmedInput };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsGenerating(true);
//     setError("");
//     setGeneratedBlog(null); // Clear previous blog

//     try {
//       const jobId = await startBlogGeneration(trimmedInput);

//       // --- Start Polling for the result ---
//       pollingIntervalRef.current = setInterval(async () => {
//         try {
//           const statusData = await getGenerationStatus(jobId);

//           if (statusData.status === "complete") {
//             stopPolling();
//             const blogResult = statusData.result;
            
//             // Create the AI message for chat view
//             const aiMessage = {
//               id: Date.now() + 1,
//               type: "assistant",
//               content: `# ${blogResult.title}\n\n${blogResult.content}`,
//             };
//             setMessages((prev) => [...prev, aiMessage]);

//             // Set the blog data for the blog view
//             setGeneratedBlog(blogResult);
//             setIsGenerating(false);
//             setViewMode("blog"); // Switch to blog view on success
//           } else if (statusData.status === "failed") {
//             stopPolling();
//             const errorMessage = `Generation failed: ${statusData.error || "Unknown error"}`;
//             setError(errorMessage);
//             const errorBubble = { id: Date.now() + 1, type: "assistant", content: `❌ **Error**: ${errorMessage}` };
//             setMessages(prev => [...prev, errorBubble]);
//             setIsGenerating(false);
//           }
//           // If status is "pending", do nothing, just wait for the next poll.
//         } catch (pollError) {
//           stopPolling();
//           setError("Error checking status. Please try again.");
//           setIsGenerating(false);
//         }
//       }, 3000); // Check every 3 seconds

//     } catch (startError) {
//       setError(startError.message);
//       const errorBubble = { id: Date.now() + 1, type: "assistant", content: `❌ **Error**: ${startError.message}` };
//       setMessages(prev => [...prev, errorBubble]);
//       setIsGenerating(false);
//     }
//   };

//   const handleSampleClick = (text) => {
//     setInputValue(text);
//     setError("");
//   };
  
//   const handleBlogSelect = (blog) => {
//     if (blog) {
//         setGeneratedBlog(blog);
//         setViewMode("blog");
//         setMessages([]); // Clear chat history
//     } else {
//         // This means "New Blog" was clicked
//         setGeneratedBlog(null);
//         setMessages([]);
//         setViewMode("chat");
//     }
//     setSidebarOpen(false);
//     setError("");
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar
//         isOpen={sidebarOpen}
//         onToggle={() => setSidebarOpen(false)}
//         onBlogSelect={handleBlogSelect}
//       />
//       <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
//         <AppHeader
//           sidebarOpen={sidebarOpen}
//           onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//           onBackToHome={onBackToHome}
//           viewMode={viewMode}
//           setViewMode={setViewMode}
//         />
        
//         <div className="flex-1 flex flex-col overflow-hidden">
//             {/* Conditional View Rendering */}
//             <div className="flex-1 overflow-y-auto">
//                 {(viewMode === 'chat' || viewMode === 'both' || (viewMode === 'blog' && !generatedBlog)) && (
//                     <MessagesArea
//                         messages={messages}
//                         isGenerating={isGenerating}
//                         onSampleClick={handleSampleClick}
//                     />
//                 )}
//                 {viewMode === 'blog' && generatedBlog && <BlogDisplay blog={generatedBlog} />}
//                 {viewMode === 'both' && generatedBlog && (
//                     <div className="border-t-2 mt-4 pt-4"><BlogDisplay blog={generatedBlog} /></div>
//                 )}
//             </div>

//             {/* Input Area is always present */}
//             <InputArea
//               inputValue={inputValue}
//               onInputChange={setInputValue}
//               onSendMessage={handleSendMessage}
//               isGenerating={isGenerating}
//             />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppPage;
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import AppHeader from "../app/AppHeader";
import MessagesArea from "../app/MessagesArea";
import InputArea from "../app/InputArea";
import BlogDisplay from "../app/BlogDisplay";
// ✅ Import the ApiService instead of individual functions
import ApiService from "../../utils/apiService";

const AppPage = ({ onBackToHome }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState(null);
  const [viewMode, setViewMode] = useState("chat");
  const [error, setError] = useState("");

  // Ref to hold the interval ID for polling
  const pollingIntervalRef = useRef(null);

  // Function to stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
  
  // Cleanup polling on component unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isGenerating) return;

    // Check if user is authenticated
    const { accessToken } = ApiService.getTokens();
    if (!accessToken) {
      setError("Please log in to generate blogs");
      const errorMessage = { id: Date.now(), type: "assistant", content: `❌ **Error**: Please log in to generate blogs` };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = { id: Date.now(), type: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsGenerating(true);
    setError("");
    setGeneratedBlog(null); // Clear previous blog

    try {
      // ✅ Use ApiService instead of direct API call
      const jobId = await ApiService.startBlogGeneration(trimmedInput);

      // --- Start Polling for the result ---
      pollingIntervalRef.current = setInterval(async () => {
        try {
          // ✅ Use ApiService instead of direct API call
          const statusData = await ApiService.getGenerationStatus(jobId);

          if (statusData.status === "complete") {
            stopPolling();
            const blogResult = statusData.result;
            
            // Create the AI message for chat view
            const aiMessage = {
              id: Date.now() + 1,
              type: "assistant",
              content: `# ${blogResult.title}\n\n${blogResult.content}`,
            };
            setMessages((prev) => [...prev, aiMessage]);

            // Set the blog data for the blog view
            setGeneratedBlog(blogResult);
            setIsGenerating(false);
            setViewMode("blog"); // Switch to blog view on success
          } else if (statusData.status === "failed") {
            stopPolling();
            const errorMessage = `Generation failed: ${statusData.error || "Unknown error"}`;
            setError(errorMessage);
            const errorBubble = { id: Date.now() + 1, type: "assistant", content: `❌ **Error**: ${errorMessage}` };
            setMessages(prev => [...prev, errorBubble]);
            setIsGenerating(false);
          }
          // If status is "pending", do nothing, just wait for the next poll.
        } catch (pollError) {
          stopPolling();
          console.error("Polling error:", pollError);
          
          // Check if it's an authentication error
          if (pollError.message.includes('token') || pollError.message.includes('auth')) {
            setError("Session expired. Please log in again.");
            // Redirect to home page for re-authentication
            setTimeout(() => {
              onBackToHome();
            }, 2000);
          } else {
            setError("Error checking status. Please try again.");
          }
          setIsGenerating(false);
        }
      }, 3000); // Check every 3 seconds

    } catch (startError) {
      console.error("Start generation error:", startError);
      
      // Check if it's an authentication error
      if (startError.message.includes('token') || startError.message.includes('auth')) {
        setError("Session expired. Please log in again.");
        // Redirect to home page for re-authentication
        setTimeout(() => {
          onBackToHome();
        }, 2000);
      } else {
        setError(startError.message);
      }
      
      const errorBubble = { id: Date.now() + 1, type: "assistant", content: `❌ **Error**: ${startError.message}` };
      setMessages(prev => [...prev, errorBubble]);
      setIsGenerating(false);
    }
  };

  const handleSampleClick = (text) => {
    setInputValue(text);
    setError("");
  };
  
  const handleBlogSelect = (blog) => {
    if (blog) {
        setGeneratedBlog(blog);
        setViewMode("blog");
        setMessages([]); // Clear chat history
    } else {
        // This means "New Blog" was clicked
        setGeneratedBlog(null);
        setMessages([]);
        setViewMode("chat");
    }
    setSidebarOpen(false);
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onBlogSelect={handleBlogSelect}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* <AppHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onBackToHome={onBackToHome}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
         */}
         <AppHeader
  sidebarOpen={sidebarOpen}
  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
  viewMode={viewMode}
  setViewMode={setViewMode}
  onLogout={() => {
    localStorage.removeItem("access_token");
    onBackToHome(); // redirect back to landing
  }}
  onProfile={() => {
    console.log("Open profile page/modal");
    // tu yaha profile modal ya route use kar sakta hai
  }}
/>

        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Conditional View Rendering */}
            <div className="flex-1 overflow-y-auto">
                {(viewMode === 'chat' || (viewMode === 'blog' && !generatedBlog)) && (
                    <MessagesArea
                        messages={messages}
                        isGenerating={isGenerating}
                        onSampleClick={handleSampleClick}
                    />
                )}
                {viewMode === 'blog' && generatedBlog && <BlogDisplay blog={generatedBlog} />}
            </div>

            {/* Input Area is always present */}
            <InputArea
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
            />
        </div>
      </div>
    </div>
  );
};

export default AppPage;