import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/api-service';

export const useAnalyticsDashboard = (startDate?: string, endDate?: string) => {
  return useQuery<any, Error>({
    queryKey: ['analyticsDashboard', startDate, endDate],
    queryFn: () => {
      const params = new URLSearchParams();
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      return dataService.getAnalyticsDashboard(params.toString());
    },
  });
};
