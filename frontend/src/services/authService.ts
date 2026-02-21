import apiClient from '@/utils/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    // 后端没有 logout 接口，前端直接清除本地存储即可
    // 这里保留方法是为了保持接口一致性
    return Promise.resolve();
  },
};
