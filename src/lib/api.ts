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

export interface SearchResultDto {
  id: string;
  name: string;
  nameBn?: string;
  brand?: string;
  brandBn?: string;
  similarity?: number;
  confidence?: string;
  images?: string[];
  matched_image?: string;
  [key: string]: any; // Allow additional properties
}

export interface UserHistory {
  id: string;
  actionType: 'scan' | 'upload' | 'view';
  imageData: string;
  resultData: SearchResultDto[] | null;
  isSuccessful: boolean;
  errorMessage: string;
  userId: string;
  medicineId: string;
  createdAt: string;
  updatedAt: string;
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

  constructor(baseUrl: string = API_BASE_URL) {
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
      console.log(`[API] Making request to: ${url}`, {
        method: options.method || 'GET',
        headers: config.headers,
        body: options.body
      });
      
      const response = await fetch(url, config);
      
      console.log(`[API] Response received from ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Handle network errors
      if (!response) {
        const error = 'Network error - please check your connection';
        console.error(`[API] Network error for ${url}:`, error);
        return {
          error,
        };
      }
      
      let data;
      try {
        data = await response.json();
        console.log(`[API] Parsed JSON response from ${url}:`, data);
      } catch (parseError) {
        // Handle cases where response is not JSON
        const error = `Server error: ${response.status} ${response.statusText}`;
        console.error(`[API] Failed to parse JSON response from ${url}:`, parseError);
        console.error(`[API] Raw response status: ${response.status} ${response.statusText}`);
        return {
          error,
        };
      }
      
      if (!response.ok) {
        const errorMessage = data.message || `Server error: ${response.status} ${response.statusText}`;
        console.error(`[API] Server error for ${url}:`, {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          data
        });
        return {
          error: errorMessage,
        };
      }
      
      console.log(`[API] Successful response from ${url}:`, data);
      return { data };
    } catch (error) {
      // More detailed error handling
      if (error instanceof TypeError) {
        // Network error (e.g., server unreachable)
        console.error(`[API] Network error (TypeError) for ${url}:`, error.message);
        return {
          error: 'Network error - please check your connection and ensure the server is running',
        };
      }
      
      console.error(`[API] Unexpected error for ${url}:`, error);
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
      console.log(`[API] Updating profile image with URI:`, imageUri);
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        const error = 'Not authenticated';
        console.error(`[API] Authentication error:`, error);
        return { error };
      }
      
      const formData = new FormData();
      // For React Native, we need to use the URI directly
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      
      const url = `${this.baseUrl}/users/profile/image`;
      console.log(`[API] Making image upload request to:`, url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });
      
      console.log(`[API] Image upload response:`, {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Image upload failed:`, errorText);
        let errorMessage = 'Failed to upload image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        console.error(`[API] Image upload error details:`, {
          status: response.status,
          errorMessage
        });
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      console.log(`[API] Image upload successful:`, data);
      return { data };
    } catch (error) {
      console.error('[API] Image upload error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async removeProfileImage(): Promise<ApiResponse<User>> {
    try {
      console.log(`[API] Removing profile image`);
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        const error = 'Not authenticated';
        console.error(`[API] Authentication error:`, error);
        return { error };
      }
      
      const url = `${this.baseUrl}/users/profile/image`;
      console.log(`[API] Making remove image request to:`, url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`[API] Remove image response:`, {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Remove image failed:`, errorText);
        let errorMessage = 'Failed to remove image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        console.error(`[API] Remove image error details:`, {
          status: response.status,
          errorMessage
        });
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      console.log(`[API] Remove image successful:`, data);
      return { data };
    } catch (error) {
      console.error('[API] Remove image error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async searchMedicines(searchTerm: string): Promise<ApiResponse<any[]>> {
    try {
      console.log(`[API] Searching medicines with term:`, searchTerm);
      const token = await AsyncStorage.getItem('access_token');
      
      console.log('Search token:', token); // Debug log
      
      const url = `${this.baseUrl}/medicines?search=${encodeURIComponent(searchTerm)}`;
      console.log(`[API] Making search request to:`, url);
      
      // Let's try without authentication for now to see if that's the issue
      const response = await fetch(url, {
        method: 'GET',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        } : {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Search response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Medicine search failed:`, errorText);
        let errorMessage = 'Failed to search medicines';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        console.error(`[API] Medicine search error details:`, {
          status: response.status,
          errorMessage
        });
        
        return {
          error: errorMessage,
        };
      }
      
      const result = await response.json();
      console.log('Search response data:', result); // Debug log
      // Extract the data array from the paginated response
      const data = result.data || result; // Handle both paginated and non-paginated responses
      console.log(`[API] Medicine search successful:`, data);
      return { data };
    } catch (error) {
      console.error('[API] Medicine search error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async searchMedicineByImage(imageUri: string): Promise<ApiResponse<any[]>> {
    try {
      console.log(`[API] Searching medicine by image with URI:`, imageUri);
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        const error = 'Not authenticated';
        console.error(`[API] Authentication error:`, error);
        return { error };
      }
      
      const formData = new FormData();
      // For React Native, we need to use the URI directly
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'medicine.jpg',
      } as any);
      
      const url = `${this.baseUrl}/medicines/search-by-image`;
      console.log(`[API] Making image search request to:`, url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });
      
      console.log(`[API] Image search response:`, {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Image search failed:`, errorText);
        let errorMessage = 'Failed to search medicine by image';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        console.error(`[API] Image search error details:`, {
          status: response.status,
          errorMessage
        });
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      console.log(`[API] Image search successful:`, data);
      return { data };
    } catch (error) {
      console.error('[API] Medicine search by image error:', error);
      return {
        error: 'Network error - please check your connection and ensure the server is running',
      };
    }
  }

  async getMedicineById(id: string): Promise<ApiResponse<any>> {
    try {
      console.log(`[API] Getting medicine by ID:`, id);
      const url = `${this.baseUrl}/medicines/${id}`;
      console.log(`[API] Making request to:`, url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`[API] Medicine by ID response:`, {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Get medicine by ID failed:`, errorText);
        let errorMessage = 'Failed to fetch medicine details';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text or default message
          errorMessage = errorText || errorMessage;
        }
        
        console.error(`[API] Get medicine by ID error details:`, {
          status: response.status,
          errorMessage
        });
        
        return {
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      console.log(`[API] Get medicine by ID successful:`, data);
      return { data };
    } catch (error) {
      console.error('[API] Get medicine by ID error:', error);
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

  async getUserHistory(limit?: number): Promise<ApiResponse<UserHistory[]>> {
    const endpoint = limit ? `/users/profile/history?limit=${limit}` : '/users/profile/history';
    return this.request<UserHistory[]>(endpoint);
  }
}

export const api = new ApiClient();

// Add the OTP signup methods as separate functions
export const sendOtpForSignup = async (baseUrl: string, data: SendOtpForSignupDto): Promise<ApiResponse<SendOtpResponse>> => {
  const url = `${baseUrl}/auth/send-otp-for-signup`;
  console.log(`[API] Sending OTP for signup to:`, url, data);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log(`[API] Send OTP response:`, {
      status: response.status,
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Send OTP failed:`, errorText);
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Server error: ${response.status} ${response.statusText}`;
      
      console.error(`[API] Send OTP error details:`, {
        status: response.status,
        errorMessage,
        errorData
      });
      
      return {
        error: errorMessage,
      };
    }
    
    const responseData = await response.json();
    console.log(`[API] Send OTP successful:`, responseData);
    return { data: responseData };
  } catch (error) {
    console.error('[API] Send OTP error:', error);
    return {
      error: 'Network error - please check your connection and ensure the server is running',
    };
  }
};

export const verifyOtpForSignup = async (baseUrl: string, email: string, otp: string): Promise<ApiResponse<LoginResponse>> => {
  const url = `${baseUrl}/auth/verify-otp-for-signup`;
  console.log(`[API] Verifying OTP for signup to:`, url, { email, otp });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    console.log(`[API] Verify OTP response:`, {
      status: response.status,
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Verify OTP failed:`, errorText);
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Server error: ${response.status} ${response.statusText}`;
      
      console.error(`[API] Verify OTP error details:`, {
        status: response.status,
        errorMessage,
        errorData
      });
      
      return {
        error: errorMessage,
      };
    }
    
    const responseData = await response.json();
    console.log(`[API] Verify OTP successful:`, responseData);
    return { data: responseData };
  } catch (error) {
    console.error('[API] Verify OTP error:', error);
    return {
      error: 'Network error - please check your connection and ensure the server is running',
    };
  }
};