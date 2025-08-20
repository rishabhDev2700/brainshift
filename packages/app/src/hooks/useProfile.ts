import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';

export const useProfile = (id?: number) => {
  return useQuery<any, Error>({
    queryKey: ['profile', id],
    queryFn: () => dataService.getProfile(id),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { fullName: string; email: string }>({
    mutationFn: (data) => dataService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
