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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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
      credentials: 'include',
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    return this.request<User>('/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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