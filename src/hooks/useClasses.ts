import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
import type { ClassInfo } from '../types'

interface ApiClass extends ClassInfo {
  average: number | null
  atRisk: number
}

const CLASS_SELECT = 'id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk, teacher_id, subjects(id, name, color, color_light), profiles!teacher_id(name)'

function mapRow(row: Record<string, unknown>): ApiClass {
  const subj = row.subjects as Record<string, string> | null
  const prof = row.profiles as Record<string, string> | null
  return {
    id: row.id as string,
    name: row.name as string,
    subjectId: subj?.id ?? '',
    subjectName: subj?.name ?? '',
    color: subj?.color ?? '#1E3A8A',
    colorLight: subj?.color_light ?? '#EFF6FF',
    teacher: prof?.name ?? '',
    teacherId: (row.teacher_id as string) ?? '',
    studentsCount: (row.students_count as number) ?? 0,
    year: (row.year as string) ?? '',
    period: (row.period as string) ?? '',
    deliveryRate: (row.delivery_rate as number) ?? 0,
    gradingType: (row.grading_type as 'numeric' | 'mencao') ?? 'numeric',
    average: (row.average as number | null) ?? null,
    atRisk: (row.at_risk as number) ?? 0,
  }
}

async function fetchForTeacher(userId: string): Promise<ApiClass[]> {
  const { data, error } = await supabase
    .from('classes')
    .select(CLASS_SELECT)
    .eq('teacher_id', userId)
    .order('name')
  if (error) throw error
  return (data ?? []).map(r => mapRow(r as Record<string, unknown>))
}

async function fetchForStudent(userId: string): Promise<ApiClass[]> {
  const { data: enrollment, error: enrollErr } = await supabase
    .from('class_students')
    .select('class_id')
    .eq('student_id', userId)
  if (enrollErr) throw enrollErr

  const classIds = (enrollment ?? []).map(r => (r as Record<string, string>).class_id)
  if (!classIds.length) return []

  const { data, error } = await supabase
    .from('classes')
    .select(CLASS_SELECT)
    .in('id', classIds)
    .order('name')
  if (error) throw error
  return (data ?? []).map(r => mapRow(r as Record<string, unknown>))
}

async function fetchForSchool(schoolId: string): Promise<ApiClass[]> {
  const { data, error } = await supabase
    .from('classes')
    .select(CLASS_SELECT)
    .eq('school_id', schoolId)
    .order('name')
  if (error) throw error
  return (data ?? []).map(r => mapRow(r as Record<string, unknown>))
}

export function useClasses() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['classes', user?.id, user?.role],
    queryFn: async (): Promise<ApiClass[]> => {
      if (!user) return []
      if (user.role === 'teacher') return fetchForTeacher(user.id)
      if (user.role === 'student') return fetchForStudent(user.id)
      if (user.schoolId) return fetchForSchool(user.schoolId)
      return []
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  })
}

export function useClass(id: string) {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['classes', id],
    queryFn: async (): Promise<ApiClass> => {
      const { data, error } = await supabase
        .from('classes')
        .select(CLASS_SELECT)
        .eq('id', id)
        .single()
      if (error) throw error
      return mapRow(data as Record<string, unknown>)
    },
    enabled: !!id && !!user,
    staleTime: 1000 * 60 * 5,
  })
}
