import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsAPI } from '../services/api';

export const useEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: enrollmentsAPI.getAll,
  });
};

export const useEnrollment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: enrollmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
