// src/components/HistorySidebar.jsx
import React from "react";

const HistorySidebar = ({ history, onSelect, onClose }) => {
  return (
    <div className="w-64 bg-gray-100 h-full border-r overflow-y-auto p-4 shadow-xl relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📚 History</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
          ✖
        </button>
      </div>

      {history.length === 0 && (
        <p className="text-gray-500 text-sm">No blogs yet.</p>
      )}

      {history.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(item.blog)}
          className="cursor-pointer mb-2 p-2 rounded hover:bg-gray-200"
        >
          <p className="text-sm font-medium truncate">{item.title}</p>
          <p className="text-xs text-gray-500">{item.date}</p>
        </div>
      ))}
    </div>
  );
};

export default HistorySidebar;
