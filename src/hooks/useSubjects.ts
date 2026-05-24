import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
import type { Subject } from '../types'

export function useSubjects() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['subjects', user?.schoolId],
    queryFn: async (): Promise<Subject[]> => {
      if (!user?.schoolId) return []
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, color, color_light')
        .eq('school_id', user.schoolId)
        .order('name')
      if (error) throw error
      return (data ?? []).map(row => ({
        id:         row.id,
        name:       row.name,
        color:      row.color,
        colorLight: row.color_light,
      }))
    },
    enabled: !!user?.schoolId,
    staleTime: 1000 * 60 * 10,
  })
}
