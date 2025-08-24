// utils/apiService.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

class ApiService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  getTokens() {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token')
    };
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async refreshAccessToken() {
    const { refreshToken } = this.getTokens();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  }

  async handleTokenRefresh(originalRequest) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken();
        this.processQueue(null, newToken);
        return this.makeRequest(originalRequest);
      } catch (error) {
        this.processQueue(error, null);
        this.clearTokens();
        window.location.href = '/login';
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }

    // Queue the request while refreshing
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject, request: originalRequest });
    });
  }

  processQueue(error, token) {
    this.failedQueue.forEach(({ resolve, reject, request }) => {
      if (error) {
        reject(error);
      } else {
        request.headers['Authorization'] = `Bearer ${token}`;
        resolve(this.makeRequest(request));
      }
    });
    this.failedQueue = [];
  }

  async makeRequest(config) {
    const { accessToken } = this.getTokens();
    
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    if (accessToken && !config.skipAuth) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(config.url, {
      ...config,
      headers
    });

    if (response.status === 401 && accessToken && !config.skipAuth) {
      return this.handleTokenRefresh(config);
    }

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  async handleError(response) {
    let errorMessage;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(errorMessage || `Request failed with status: ${response.status}`);
  }

  // API Methods
  async startBlogGeneration(topic) {
    const data = await this.makeRequest({
      url: `${BACKEND_URL}/api/generate_blog`,
      method: 'POST',
      body: JSON.stringify({ topic })
    });
    return data.job_id;
  }

  async getGenerationStatus(jobId) {
    return this.makeRequest({
      url: `${BACKEND_URL}/api/generate_blog/status/${jobId}`,
      method: 'GET'
    });
  }

async getMyBlogs() {
  const res = await this.makeRequest({
    url: `${BACKEND_URL}/api/my_blogs`,
    method: "GET",
  });

  // normalize -> always return array
  return res.blogs || res.data || [];
}

  async deleteBlog(blogId) {
    return this.makeRequest({
      url: `${BACKEND_URL}/api/blog/${blogId}`,
      method: 'DELETE'
    });
  }

  async getAnalytics() {
    return this.makeRequest({
      url: `${BACKEND_URL}/api/analytics`,
      method: 'GET'
    });
  }

  async updateProfile(profileData) {
    return this.makeRequest({
      url: `${BACKEND_URL}/api/auth/profile`,
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async logout() {
    const { accessToken } = this.getTokens();
    
    if (accessToken) {
      try {
        await this.makeRequest({
          url: `${BACKEND_URL}/api/auth/logout`,
          method: 'POST'
        });
      } catch (error) {
        console.warn('Logout request failed:', error);
      }
    }
    
    this.clearTokens();
  }
}

export default new ApiService();