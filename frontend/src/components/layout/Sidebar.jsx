// // src/components/HistorySidebar.jsx
// import React from "react";

// const HistorySidebar = ({ history, onSelect, onClose }) => {
//   return (
//     <div className="w-64 bg-gray-100 h-full border-r overflow-y-auto p-4 shadow-xl relative">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">📚 History</h2>
//         <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
//           ✖
//         </button>
//       </div>

//       {history.length === 0 && (
//         <p className="text-gray-500 text-sm">No blogs yet.</p>
//       )}

//       {history.map((item, idx) => (
//         <div
//           key={idx}
//           onClick={() => onSelect(item.blog)}
//           className="cursor-pointer mb-2 p-2 rounded hover:bg-gray-200"
//         >
//           <p className="text-sm font-medium truncate">{item.title}</p>
//           <p className="text-xs text-gray-500">{item.date}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default HistorySidebar;

// Sidebar Component
import React from 'react';
import { Sparkles, Plus, X } from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => (
  <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 overflow-hidden h-screen fixed top-0 left-0 z-50`}>
    <div className="p-4 h-full flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">BlogAI</span>
      </div>

      {/* New Blog Button */}
      <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center space-x-2 mb-6 transition-colors">
        <Plus className="w-5 h-5" />
        <span>New Blog Post</span>
      </button>

      {/* Recent Generations */}
      <div className="space-y-2">
        <div className="text-gray-400 text-sm font-medium mb-2">Recent Generations</div>

        <div className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <div className="text-white text-sm">AI and Machine Learning</div>
          <div className="text-gray-400 text-xs">2 hours ago</div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <div className="text-white text-sm">Digital Marketing Trends</div>
          <div className="text-gray-400 text-xs">1 day ago</div>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;
