// utils/navigationUtils.js
export const navigateToRoute = (navigate) => ({
  dashboard: () => navigate('/dashboard'),
  profile: () => navigate('/profile'),
  blogs: () => navigate('/my-blogs'),
  generate: () => navigate('/generate'),
  analytics: () => navigate('/analytics'),
  home: () => navigate('/'),
});

export const getRouteInfo = (pathname) => {
  const routes = {
    '/dashboard': { title: 'Dashboard', description: 'Overview and statistics' },
    '/profile': { title: 'Profile', description: 'Account settings and information' },
    '/my-blogs': { title: 'My Blogs', description: 'Manage your blog posts' },
    '/generate': { title: 'Generate Blog', description: 'Create new blog content' },
    '/analytics': { title: 'Analytics', description: 'Performance metrics' },
    '/app': { title: 'Blog Generator', description: 'Create amazing content' },
  };
  
  return routes[pathname] || { title: 'Dashboard', description: 'Welcome back' };
};