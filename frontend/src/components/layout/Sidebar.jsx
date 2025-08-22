import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, X } from 'lucide-react';
import { getHistory, getBlogById } from '../../utils/api'; // ✅ Use our new API functions

const Sidebar = ({ isOpen, onToggle, onBlogSelect }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getHistory()
        .then(data => {
          console.log("🧠 History response:", data);
          setHistory(data.history || []);
        })
        .catch(err => {
          console.error("Error loading history:", err);
          setHistory([]);
        });
    }
  }, [isOpen]);

  const handleBlogClick = async (item) => {
    try {
      const fullBlog = await getBlogById(item.id);
      onBlogSelect(fullBlog); // Send full blog data to AppPage
    } catch (err) {
      console.error("Failed to load blog", err);
      // Optionally, show an error to the user
    }
  };
  
  const handleNewBlog = () => {
    onBlogSelect(null); // Setting blog to null signifies a new session
    onToggle(); // Close sidebar
  }

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 overflow-hidden h-screen fixed top-0 left-0 z-50`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-end mb-2">
          <button onClick={onToggle} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">BlogAI</span>
        </div>
        <button onClick={handleNewBlog} className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center space-x-2 mb-6 transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Blog Post</span>
        </button>
        <div className="space-y-2 overflow-y-auto flex-1">
          <div className="text-gray-400 text-sm font-medium mb-2">Recent Generations</div>
          {Array.isArray(history) && history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleBlogClick(item)}
              className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="text-white text-sm truncate">{item.title}</div>
              <div className="text-gray-400 text-xs">{formatTime(item.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;