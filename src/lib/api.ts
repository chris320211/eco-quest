const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const api = {
  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  },

  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  },

  // Get current user
  getMe: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return response.json();
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Upload files
  uploadFiles: async (files: File[]) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  // Get upload history
  getUploads: async (limit = 10) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/uploads?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch uploads');
    }

    return response.json();
  },

  // Delete upload
  deleteUpload: async (uploadId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/uploads/${uploadId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete upload');
    }

    return response.json();
  },

  // Get dashboard data
  getDashboard: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/analysis/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  },

  // Get analysis
  getAnalysis: async (period?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const url = period
      ? `${API_URL}/analysis?period=${period}`
      : `${API_URL}/analysis`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, analysis: null };
      }
      throw new Error('Failed to fetch analysis');
    }

    return response.json();
  },

  // Create or update analysis
  createOrUpdateAnalysis: async (data: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create/update analysis');
    }

    return response.json();
  },

  // Get analysis periods
  getAnalysisPeriods: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/analysis/periods`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis periods');
    }

    return response.json();
  },
};
