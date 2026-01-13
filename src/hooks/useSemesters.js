import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semestersAPI } from '../services/api';

export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: semestersAPI.getAll,
  });
};

export const useCreateSemester = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: semestersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => semestersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: semestersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
