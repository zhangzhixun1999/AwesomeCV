import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resumeService';
import type { Resume, ResumeContent } from '@/types';

export const useResumes = () => {
  return useQuery<Resume[]>({
    queryKey: ['resumes'],
    queryFn: () => resumeService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 分钟
  });
};

export const useResume = (id: number) => {
  return useQuery<Resume>({
    queryKey: ['resume', id],
    queryFn: () => resumeService.getById(id),
    enabled: !!id && id !== 0,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; template_id: string; content: ResumeContent }) => {
      return resumeService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title, template_id, content }: {
      id: number;
      title?: string;
      template_id?: string;
      content?: ResumeContent;
    }) => {
      return resumeService.update(id, { title, template_id, content });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return resumeService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useDuplicateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: number; title?: string }) => {
      return await resumeService.duplicate(id, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};
