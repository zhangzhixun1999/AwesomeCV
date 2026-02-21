import { useQuery } from '@tanstack/react-query';
import { templateService } from '@/services/templateService';
import type { Template } from '@/types';

export const useTemplates = () => {
  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => templateService.getAll(),
    staleTime: 1000 * 60 * 10, // 10 分钟
  });
};

export const useTemplate = (id: string) => {
  return useQuery<Template>({
    queryKey: ['template', id],
    queryFn: () => templateService.getById(id),
    enabled: !!id,
  });
};
