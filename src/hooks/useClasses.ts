import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ClassInfo } from '../types'

interface ApiClass extends ClassInfo {
  average: number | null
  atRisk: number
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<ApiClass[]>('/api/classes'),
    staleTime: 1000 * 60 * 5,
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => api.get<ApiClass>(`/api/classes/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
