import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Activity } from '../types'
import type { ActivityFormData } from '../components/ActivityDrawer'

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => api.get<Activity[]>('/api/activities'),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ActivityFormData) =>
      api.post<Activity[]>('/api/activities', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
