// src/components/Profile/ProfileMenu.jsx
import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";

const ProfileMenu = ({ onLogout, onProfile }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar / Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
      >
        U
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <button
            onClick={() => {
              onProfile();
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" /> Profile
          </button>
          <button
            onClick={() => {
              alert("Settings coming soon");
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-2" /> Settings
          </button>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
