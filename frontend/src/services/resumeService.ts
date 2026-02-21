import apiClient from '@/utils/api';
import { Resume, ResumeContent } from '@/types';

export const resumeService = {
  async getAll(): Promise<Resume[]> {
    const response = await apiClient.get('/resumes');
    return response.data.data;
  },

  async getById(id: number): Promise<Resume> {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data.data;
  },

  async create(data: { title: string; template_id: string; content: ResumeContent }): Promise<Resume> {
    const response = await apiClient.post('/resumes', data);
    return response.data.data;
  },

  async update(id: number, data: { title?: string; template_id?: string; content?: ResumeContent }): Promise<Resume> {
    const response = await apiClient.put(`/resumes/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  },

  async duplicate(id: number, title?: string): Promise<Resume> {
    const response = await apiClient.post(`/resumes/${id}/duplicate`, {
      title: title
    });
    return response.data.data;
  },
};
