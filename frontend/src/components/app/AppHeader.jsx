// import React from 'react';
// import sidebarIcon from '../../assets/sidebar.svg';
// import { Sparkles } from 'lucide-react';

// const AppHeader = ({ onToggleSidebar, onBackToHome }) => (
//   <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//     <div className="flex items-center space-x-4">
//       {/* Only Menu Icon in header */}
//       <button
//         onClick={onToggleSidebar}
//         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//       >
//         <img src={sidebarIcon} alt="Toggle Sidebar" className="w-5 h-5" />
//       </button>

//       <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//         <Sparkles className="w-3 h-3 text-white" />
//       </div>

//       <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
//     </div>

//     <button
//       onClick={onBackToHome}
//       className="text-gray-600 hover:text-gray-800 transition-colors"
//     >
//       Back to Home
//     </button>
//   </div>
// );

// export default AppHeader;

// src/components/app/AppHeader.jsx
// import React from 'react';
// import sidebarIcon from '../../assets/sidebar.svg';
// import { Sparkles } from 'lucide-react';

// const AppHeader = ({ onToggleSidebar, onBackToHome, sidebarOpen }) => (
//   <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between transition-all duration-300">
//     <div className="flex items-center space-x-4">
//       {!sidebarOpen && (
//         <button
//           onClick={onToggleSidebar}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <img src={sidebarIcon} alt="Toggle Sidebar" className="w-5 h-5" />
//         </button>
//       )}

//       <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//         <Sparkles className="w-3 h-3 text-white" />
//       </div>

//       <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
//     </div>

//     <button
//       onClick={onBackToHome}
//       className="text-gray-600 hover:text-gray-800 transition-colors"
//     >
//       Back to Home
//     </button>
//   </div>
// );

// export default AppHeader;

//src/components/app/AppHeader.jsx
import React from 'react';
import sidebarIcon from '../../assets/sidebar.svg';
import { Sparkles } from 'lucide-react';

const AppHeader = ({ onToggleSidebar, onBackToHome, sidebarOpen, viewMode, setViewMode }) => (
  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between transition-all duration-300">
    {/* Left: Sidebar + Logo */}
    <div className="flex items-center space-x-4">
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <img src={sidebarIcon} alt="Toggle Sidebar" className="w-5 h-5" />
        </button>
      )}

      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-white" />
      </div>

      <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
    </div>

    {/* Right: View Toggle + Back */}
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setViewMode("chat")}
        className={`px-3 py-1 rounded-md text-sm ${viewMode === "chat" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        💬 Chat
      </button>
      <button
        onClick={() => setViewMode("blog")}
        className={`px-3 py-1 rounded-md text-sm ${viewMode === "blog" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        📝 Blog
      </button>
      <button
        onClick={() => setViewMode("both")}
        className={`px-3 py-1 rounded-md text-sm ${viewMode === "both" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        🧩 Both
      </button>

      <button
        onClick={onBackToHome}
        className="ml-4 text-gray-600 hover:text-gray-800 transition-colors text-sm"
      >
        ⬅ Back
      </button>
    </div>
  </div>
);


export default AppHeader;
