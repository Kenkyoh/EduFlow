import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/auth'
import type { Activity } from '../types'
import type { ActivityFormData } from '../components/ActivityDrawer'

function computeStatus(dueDate: string, startDate: string | null): Activity['status'] {
  const now = new Date()
  if (startDate && new Date(startDate) > now) return 'upcoming'
  if (new Date(dueDate) < now) return 'late'
  return 'pending'
}

function mapRow(row: Record<string, unknown>): Activity {
  const subj = row.subjects as Record<string, string> | null
  const cls  = row.classes  as Record<string, string> | null
  return {
    id:           row.id as string,
    title:        row.title as string,
    subjectId:    subj?.id    ?? (row.subject_id as string) ?? '',
    subjectName:  subj?.name  ?? '',
    subjectColor: subj?.color ?? '#1E3A8A',
    type:         row.type as Activity['type'],
    dueDate:      row.due_date as string,
    startDate:    (row.start_date as string) ?? (row.due_date as string),
    weight:       (row.weight as number) ?? 20,
    description:  row.description as string | undefined,
    classIds:     [row.class_id as string],
    classNames:   [cls?.name ?? ''],
    status:       computeStatus(row.due_date as string, row.start_date as string | null),
    published:    row.published as boolean,
    allowResubmit: row.allow_resubmit as boolean | undefined,
    maxAttempts:   row.max_attempts as number | undefined,
  }
}

async function fetchForStudent(userId: string): Promise<Activity[]> {
  const { data: enrollment } = await supabase
    .from('class_students')
    .select('class_id')
    .eq('student_id', userId)

  const classIds = (enrollment ?? []).map(e => (e as Record<string, string>).class_id)
  if (!classIds.length) return []

  const { data, error } = await supabase
    .from('activities')
    .select('*, subjects(id, name, color, color_light), classes(id, name)')
    .in('class_id', classIds)
    .eq('published', true)
    .order('due_date', { ascending: true })
  if (error) throw error
  return (data ?? []).map(r => mapRow(r as Record<string, unknown>))
}

async function fetchForTeacher(userId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*, subjects(id, name, color, color_light), classes(id, name)')
    .eq('teacher_id', userId)
    .order('due_date', { ascending: false })
  if (error) throw error
  return (data ?? []).map(r => mapRow(r as Record<string, unknown>))
}

export function useActivities() {
  const user = useAuthStore(s => s.user)

  return useQuery({
    queryKey: ['activities', user?.id, user?.role],
    queryFn: async (): Promise<Activity[]> => {
      if (!user) return []
      if (user.role === 'student')  return fetchForStudent(user.id)
      if (user.role === 'teacher')  return fetchForTeacher(user.id)
      return []
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  return useMutation({
    mutationFn: async (form: ActivityFormData) => {
      const { error } = await supabase.from('activities').insert({
        school_id:      user?.schoolId,
        class_id:       form.classIds?.[0],
        teacher_id:     user?.id,
        subject_id:     form.subjectId,
        title:          form.title,
        type:           form.type,
        description:    form.description,
        start_date:     form.startDate,
        due_date:       form.dueDate,
        weight:         form.weight,
        allow_resubmit: form.allowResubmit ?? false,
        max_attempts:   form.maxAttempts ?? 1,
        published:      form.published ?? true,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
