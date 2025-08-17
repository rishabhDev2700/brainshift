import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';

export const useProfile = () => {
  return useQuery<any, Error>({
    queryKey: ['profile'],
    queryFn: dataService.getProfile,
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
