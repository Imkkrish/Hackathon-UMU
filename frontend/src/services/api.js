
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
const DIGIPIN_API_URL = import.meta.env.VITE_DIGIPIN_API_URL || 'http://localhost:5002';

let userId = localStorage.getItem('userId');
if (!userId) {
  userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('userId', userId);
}

async function apiCall(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const addressAPI = {

  matchText: async (addressText, options = {}) => {
    return apiCall(`${API_BASE_URL}/api/address/match`, {
      method: 'POST',
      body: JSON.stringify({
        text: addressText,
        top_k: options.topK || 5,
        include_digipin: options.includeDigipin !== false,
      }),
    });
  },


  matchImage: async (imageFile, options = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (options.topK) {
      formData.append('top_k', options.topK);
    }

    return apiCall(`${API_BASE_URL}/api/address/ocr-match`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-User-Id': userId,
      }, 
    });
  },

  validate: async (address, expectedPincode, expectedOffice) => {
    return apiCall(`${API_BASE_URL}/api/address/validate`, {
      method: 'POST',
      body: JSON.stringify({
        address,
        expectedPincode,
        expectedOffice,
      }),
    });
  },
};


export const pincodeAPI = {

  getByPin: async (pincode) => {
    return apiCall(`${API_BASE_URL}/api/pincode/${pincode}`);
  },

  /**
   * Search post offices by query
   */
  search: async (query) => {
    const params = new URLSearchParams({ q: query });
    return apiCall(`${API_BASE_URL}/api/pincode/search?${params}`);
  },

  /**
   * Validate PIN-office pair
   */
  validate: async (pincode, officeName) => {
    return apiCall(`${API_BASE_URL}/api/pincode/validate`, {
      method: 'POST',
      body: JSON.stringify({ pincode, officeName }),
    });
  },
};

/**
 * Batch Processing API
 */
export const batchAPI = {
  /**
   * Upload CSV for batch processing
   */
  upload: async (csvFile) => {
    const formData = new FormData();
    formData.append('csv', csvFile);

    return apiCall(`${API_BASE_URL}/api/batch/upload`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type
    });
  },

  /**
   * Get batch job status
   */
  getStatus: async (jobId) => {
    return apiCall(`${API_BASE_URL}/api/batch/status/${jobId}`);
  },

  /**
   * Download batch results
   */
  downloadResults: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/api/batch/download/${jobId}`);
    if (!response.ok) {
      throw new Error('Failed to download results');
    }
    return response.blob();
  },

  /**
   * Poll batch status until completion
   */
  pollStatus: async (jobId, intervalMs = 2000, maxAttempts = 60) => {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await batchAPI.getStatus(jobId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Batch processing timeout');
  },
};

/**
 * Health Check API
 */
export const healthAPI = {
  /**
   * Check overall system health
   */
  check: async () => {
    return apiCall(`${API_BASE_URL}/api/health`);
  },

  /**
   * Check if system is ready
   */
  ready: async () => {
    return apiCall(`${API_BASE_URL}/api/health/ready`);
  },

  /**
   * Liveness check
   */
  live: async () => {
    return apiCall(`${API_BASE_URL}/api/health/live`);
  },
};

/**
 * ML Service Direct API (for advanced use)
 */
export const mlAPI = {
  /**
   * Extract text from image via OCR
   */
  ocr: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    return apiCall(`${ML_API_URL}/api/ml/ocr`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },

  /**
   * Normalize address text
   */
  normalize: async (text) => {
    return apiCall(`${ML_API_URL}/api/ml/normalize`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /**
   * Match address directly via ML service
   */
  match: async (text, topK = 5) => {
    return apiCall(`${ML_API_URL}/api/ml/match`, {
      method: 'POST',
      body: JSON.stringify({ text, top_k: topK, include_digipin: true }),
    });
  },
};

/**
 * DIGIPIN Service API
 */
export const digipinAPI = {
  /**
   * Encode coordinates to DIGIPIN
   */
  encode: async (latitude, longitude) => {
    return apiCall(`${DIGIPIN_API_URL}/api/digipin/encode`, {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  /**
   * Decode DIGIPIN to coordinates
   */
  decode: async (digipin) => {
    return apiCall(`${DIGIPIN_API_URL}/api/digipin/decode`, {
      method: 'POST',
      body: JSON.stringify({ digipin }),
    });
  },
};

export const activityAPI = {
  getUserActivity: async (limit = 100) => {
    return apiCall(`${API_BASE_URL}/api/activity/user/${userId}?limit=${limit}`);
  },

  getStats: async () => {
    return apiCall(`${API_BASE_URL}/api/activity/stats`);
  },
};

export const getUserId = () => userId;

export default {
  address: addressAPI,
  pincode: pincodeAPI,
  batch: batchAPI,
  health: healthAPI,
  ml: mlAPI,
  digipin: digipinAPI,
  activity: activityAPI,
  getUserId,
};
