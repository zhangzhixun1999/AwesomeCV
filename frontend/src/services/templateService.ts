import apiClient from '@/utils/api';
import { Template } from '@/types';

export const templateService = {
  async getAll(): Promise<Template[]> {
    const response = await apiClient.get('/templates');
    return response.data.data;
  },

  async getById(id: string): Promise<Template> {
    const response = await apiClient.get(`/templates/${id}`);
    return response.data.data;
  },
};
