import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/api-service';
import type { EventSchema } from '@/types';

export const useEvents = () => {
  return useQuery<EventSchema[], Error>({
    queryKey: ['events'],
    queryFn: dataService.getEvents,
  });
};

export const useEventsByDate = (date: string) => {
  return useQuery<EventSchema[], Error>({
    queryKey: ['events', date],
    queryFn: () => dataService.getEventsByDate(date),
  });
};

export const useEventById = (id: number) => {
  return useQuery<EventSchema, Error>({
    queryKey: ['events', id],
    queryFn: () => dataService.getEventById(id),
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, EventSchema>({
    mutationFn: dataService.addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number; data: EventSchema }>({
    mutationFn: ({ id, data }) => dataService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({
    mutationFn: (id) => dataService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
