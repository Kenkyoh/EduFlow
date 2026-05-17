import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Subject } from '../types'

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get<Subject[]>('/api/subjects'),
    staleTime: 1000 * 60 * 10,
  })
}
