import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  image?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
}

export interface SendOtpForSignupDto {
  name: string;
  email: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL || 'http://192.168.21.101:3000') {
    this.baseUrl = baseUrl;
  }

  // Getter method to access baseUrl
  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle network errors
      if (!response) {
        return {
          error: 'Network error - please check your connection',
        };
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Handle cases where response is not JSON
        return {
          error: `Server error: ${response.status} ${response.statusText}`,
        };
      }
      
      if (!response.ok) {
        return {
          error: data.message || `Server error: ${response.status} ${response.statusText}`,
        };
      }
      
      return { data };
    } catch (error) {
      // More detailed error handling
      if (error instanceof TypeError) {
        // Network error (e.g., server unreachable)
        return {
          error: 'Network error - please check your connection and ensure the server is running',
        };
      }
      
      return {
        error: 'An unexpected error occurred',
      };
    }
  }

  async sendOtp(email: string): Promise<ApiResponse<SendOtpResponse>> {
    return this.request<SendOtpResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProfileImage(imageUri: string): Promise<ApiResponse<User>> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        return { error: 'Not authenticated' };
      }
      
      const formData = new FormData();
      // For React Native, we need to use the URI directly
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      
      const response = await fetch(`${this.baseUrl}/users/profile/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to upload image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async removeProfileImage(): Promise<ApiResponse<User>> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        return { error: 'Not authenticated' };
      }
      
      const response = await fetch(`${this.baseUrl}/users/profile/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to remove image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Remove image error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async searchMedicineByImage(imageUri: string): Promise<ApiResponse<any[]>> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        return { error: 'Not authenticated' };
      }
      
      const formData = new FormData();
      // For React Native, we need to use the URI directly
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'medicine.jpg',
      } as any);
      
      const response = await fetch(`${this.baseUrl}/medicines/search-by-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to search medicine by image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Medicine search by image error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async getMedicineById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch medicine details';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Get medicine by ID error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('access_token', token);
  }

  async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
  }

  async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

// Add the OTP signup methods as separate functions
export const sendOtpForSignup = async (baseUrl: string, data: SendOtpForSignupDto): Promise<ApiResponse<SendOtpResponse>> => {
  const url = `${baseUrl}/auth/send-otp-for-signup`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `Server error: ${response.status} ${response.statusText}`,
      };
    }
    
    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    return {
      error: 'Network error - please check your connection and ensure the server is running',
    };
  }
};

export const verifyOtpForSignup = async (baseUrl: string, email: string, otp: string): Promise<ApiResponse<LoginResponse>> => {
  const url = `${baseUrl}/auth/verify-otp-for-signup`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `Server error: ${response.status} ${response.statusText}`,
      };
    }
    
    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    return {
      error: 'Network error - please check your connection and ensure the server is running',
    };
  }
};