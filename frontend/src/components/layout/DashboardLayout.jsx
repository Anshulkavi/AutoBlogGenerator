// components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Sparkles,
  Plus,
  PenTool
} from 'lucide-react';
import ApiService from '../../utils/apiService';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      ApiService.clearTokens();
      navigate('/');
    }
  };

  const navigationItems = [
    {
      name: 'Generate Blog',
      icon: PenTool,
      path: '/generate',
      description: 'Create new content'
    },
    {
      name: 'My Blogs',
      icon: FileText,
      path: '/my-blogs',
      description: 'Manage your posts'
    },
    
    {
      name: 'Profile',
      icon: User,
      path: '/profile',
      description: 'Account settings'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-white">BlogAI</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {sidebarOpen && (
            <button
              onClick={() => navigate('/generate')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-lg flex items-center space-x-3 mb-6 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Blog Post</span>
            </button>
          )}

          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {sidebarOpen && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${isActive ? 'text-purple-200' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Home' : ''}
            >
              <Home className="w-5 h-5" />
              {sidebarOpen && <span>Back to Home</span>}
            </button>
            
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigationItems.find(item => isActivePath(item.path))?.name || 'BlogAI'}
                </h1>
                <p className="text-sm text-gray-500">
                  {navigationItems.find(item => isActivePath(item.path))?.description || 'Welcome back'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className={`p-2 rounded-lg transition-colors ${
                  isActivePath('/profile') 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;