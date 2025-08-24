// components/Profile/ProfileStats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Eye, TrendingUp, Calendar, Clock } from 'lucide-react';
import ApiService from '../../utils/apiService';

const ProfileStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load analytics data
      const analyticsData = await ApiService.getAnalytics();
      
      // Load blogs data
      const blogsData = await ApiService.getMyBlogs();
      
      // Calculate stats
      const totalBlogs = blogsData.length;
      const publishedBlogs = blogsData.filter(blog => blog.status === 'completed').length;
      const draftBlogs = blogsData.filter(blog => blog.status === 'pending' || blog.status === 'in_progress').length;
      
      // Calculate this month's blogs
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthBlogs = blogsData.filter(blog => 
        new Date(blog.created_at) >= startOfMonth
      ).length;

      // Calculate average per month (simplified)
      const oldestBlog = blogsData.reduce((oldest, blog) => {
        const blogDate = new Date(blog.created_at);
        return !oldest || blogDate < oldest ? blogDate : oldest;
      }, null);

      let averagePerMonth = 0;
      if (oldestBlog) {
        const monthsDiff = Math.max(1, (now - oldestBlog) / (1000 * 60 * 60 * 24 * 30));
        averagePerMonth = Math.round(totalBlogs / monthsDiff * 10) / 10;
      }

      setStats({
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        thisMonthBlogs,
        averagePerMonth,
        totalViews: analyticsData?.total_views || 0,
        ...analyticsData
      });
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Stats load error:', err);
      // Set default stats in case of error
      setStats({
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        thisMonthBlogs: 0,
        averagePerMonth: 0,
        totalViews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">Statistics</h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadStats}
          className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Published',
      value: stats.publishedBlogs,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'In Progress',
      value: stats.draftBlogs,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'This Month',
      value: stats.thisMonthBlogs,
      icon: Calendar,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return colors[color] || colors.gray;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
        </div>
        
        <div className="space-y-4">
          {statItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${getColorClasses(item.color)}`}>
                    <IconComponent className={`h-4 w-4 ${getIconColorClasses(item.color)}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Eye className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Performance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Views</span>
            <span className="text-lg font-semibold text-gray-900">
              {stats.totalViews.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Avg. per Month</span>
            <span className="text-lg font-semibold text-gray-900">
              {stats.averagePerMonth}
            </span>
          </div>

          {stats.totalViews > 0 && stats.publishedBlogs > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Avg. Views per Blog</span>
              <span className="text-lg font-semibold text-gray-900">
                {Math.round(stats.totalViews / stats.publishedBlogs)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-700">View Dashboard</span>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/my-blogs')}
            className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-700">Manage Blogs</span>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/generate')}
            className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-700">Generate New Blog</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;