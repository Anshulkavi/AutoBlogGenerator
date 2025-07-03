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
  const [viewMode, setViewMode] = useState("chat"); // ✅ Must be declared

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsGenerating(true);

    try {
      const data = await generateBlog(inputValue);

      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: data.content, // ✅ Correct
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      setGeneratedBlog({
        title:
          data.title ||
          `${
            inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
          }: A Comprehensive Guide`,
        content: data.content, // ✅ Correct
        topic: data.topic,
        image_url: "", // optional
      });
    } catch (err) {
      console.error("❌ Blog generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSampleClick = (text) => {
    setInputValue(text);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onBlogSelect={(blog) => {
          setGeneratedBlog(blog);
          setViewMode("blog");
          setMessages([]);
        }}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <AppHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          onBackToHome={onBackToHome}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* 🧠 Show blog if available */}
        {/* 🔁 Conditional View Rendering */}
        {generatedBlog && viewMode === "blog" && (
          <div className="overflow-y-auto p-6">
            <BlogDisplay blog={generatedBlog} />
          </div>
        )}

        {(!generatedBlog || viewMode === "chat") && (
          <MessagesArea
            messages={messages}
            isGenerating={isGenerating}
            onSampleClick={handleSampleClick}
          />
        )}

        {generatedBlog && viewMode === "both" && (
          <div className="flex overflow-y-auto p-6 gap-4">
            <div className="w-1/2 border-r pr-4">
              <MessagesArea
                messages={messages}
                isGenerating={isGenerating}
                onSampleClick={handleSampleClick}
              />
            </div>
            <div className="w-1/2 pl-4">
              <BlogDisplay blog={generatedBlog} />
            </div>
          </div>
        )}

        {/* ✍️ Always show input area */}
        <InputArea
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default AppPage;
