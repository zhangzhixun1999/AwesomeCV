import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import type { LoginRequest, RegisterRequest, User, AuthResponse } from '@/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await authService.login(data);

      // 保存 token 和用户信息到 localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await authService.register(data);

      // 保存 token 和用户信息到 localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } finally {
        // 无论 API 调用是否成功，都清除本地存储
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
  });
};

export const useCurrentUser = () => {
  // 从 localStorage 获取用户信息
  const getUserFromStorage = (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch {
        // 如果获取失败，返回本地存储的用户
        return getUserFromStorage();
      }
    },
    initialData: getUserFromStorage(),
    staleTime: 1000 * 60 * 5, // 5 分钟
  });
};
