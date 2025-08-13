// API Configuration and Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// API request wrapper with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Add authorization token when available
      ...(localStorage.getItem('authToken') && {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      })
    },
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Provider Availability API Services
export const providerAvailabilityAPI = {
  // Get all provider availabilities
  getAll: async () => {
    return await apiRequest('/provider-availability');
  },

  // Get provider availability by ID
  getById: async (id) => {
    return await apiRequest(`/provider-availability/${id}`);
  },

  // Get provider availability by provider ID
  getByProvider: async (providerId) => {
    return await apiRequest(`/provider-availability/provider/${providerId}`);
  },

  // Create new provider availability
  create: async (availabilityData) => {
    return await apiRequest('/provider-availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData)
    });
  },

  // Update existing provider availability
  update: async (id, availabilityData) => {
    return await apiRequest(`/provider-availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify(availabilityData)
    });
  },

  // Delete provider availability
  delete: async (id) => {
    return await apiRequest(`/provider-availability/${id}`, {
      method: 'DELETE'
    });
  },

  // Get available time slots for a provider on a specific date
  getAvailableSlots: async (providerId, date) => {
    return await apiRequest(`/provider-availability/slots?providerId=${providerId}&date=${date}`);
  },

  // Check if provider is available at a specific time
  checkAvailability: async (providerId, dateTime) => {
    return await apiRequest(`/provider-availability/check?providerId=${providerId}&dateTime=${dateTime}`);
  }
};

// Block Days API Services
export const blockDaysAPI = {
  // Get all block days for a provider
  getByProvider: async (providerId) => {
    return await apiRequest(`/block-days/provider/${providerId}`);
  },

  // Create new block day
  create: async (blockDayData) => {
    return await apiRequest('/block-days', {
      method: 'POST',
      body: JSON.stringify(blockDayData)
    });
  },

  // Update block day
  update: async (id, blockDayData) => {
    return await apiRequest(`/block-days/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blockDayData)
    });
  },

  // Delete block day
  delete: async (id) => {
    return await apiRequest(`/block-days/${id}`, {
      method: 'DELETE'
    });
  }
};

// Provider API Services
export const providerAPI = {
  // Get provider profile
  getProfile: async (providerId) => {
    return await apiRequest(`/providers/${providerId}`);
  },

  // Update provider profile
  updateProfile: async (providerId, profileData) => {
    return await apiRequest(`/providers/${providerId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Get provider statistics
  getStats: async (providerId) => {
    return await apiRequest(`/providers/${providerId}/stats`);
  }
};

// Authentication API Services
export const authAPI = {
  // Provider login
  login: async (credentials) => {
    return await apiRequest('/auth/provider/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Provider registration
  register: async (registrationData) => {
    return await apiRequest('/auth/provider/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });
  },

  // Logout
  logout: async () => {
    return await apiRequest('/auth/logout', {
      method: 'POST'
    });
  },

  // Refresh token
  refreshToken: async () => {
    return await apiRequest('/auth/refresh', {
      method: 'POST'
    });
  }
};

// Export a default API client
const apiClient = {
  providerAvailability: providerAvailabilityAPI,
  blockDays: blockDaysAPI,
  provider: providerAPI,
  auth: authAPI
};

export default apiClient;
