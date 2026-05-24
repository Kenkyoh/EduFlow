import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import { authenticate } from '../middleware/authenticate'
import type { AuthRequest } from '../middleware/authenticate'

const router = Router()

const ACTIVITY_SELECT = `
  id, title, type, description, start_date, due_date, weight,
  allow_resubmit, max_attempts, published, created_at,
  class:class_id ( id, name, students_count ),
  subject:subject_id ( id, name, color, color_light )
`

function computeStatus(dueDate: string): string {
  const now = new Date()
  const due = new Date(dueDate)
  if (due < now) return 'late'
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 1 ? 'pending' : 'upcoming'
}

function mapActivity(a: Record<string, unknown>) {
  const cls = a.class as Record<string, unknown> | null
  const subject = a.subject as Record<string, unknown> | null
  return {
    id: a.id as string,
    title: a.title as string,
    type: a.type as string,
    description: (a.description as string) ?? '',
    subjectId: (subject?.id as string) ?? '',
    subjectName: (subject?.name as string) ?? '',
    subjectColor: (subject?.color as string) ?? '#1E3A8A',
    subjectColorLight: (subject?.color_light as string) ?? '#EFF6FF',
    classId: (cls?.id as string) ?? '',
    classIds: [(cls?.id as string) ?? ''],
    classNames: [(cls?.name as string) ?? ''],
    startDate: (a.start_date as string) ?? (a.due_date as string),
    dueDate: a.due_date as string,
    weight: (a.weight as number) ?? 20,
    allowResubmit: (a.allow_resubmit as boolean) ?? false,
    maxAttempts: (a.max_attempts as number) ?? 1,
    published: (a.published as boolean) ?? true,
    totalStudents: (cls?.students_count as number) ?? 0,
    submissionsCount: 0,
    status: computeStatus(a.due_date as string),
  }
}

// GET /api/activities
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', req.userId!)
    .single()

  if (!profile?.school_id) {
    res.status(400).json({ error: 'Usuário sem escola associada' })
    return
  }

  let query = supabaseAdmin
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('school_id', profile.school_id)
    .order('due_date')

  if (profile.role === 'teacher') {
    query = query.eq('teacher_id', req.userId!)
  } else if (profile.role === 'student') {
    const { data: enrollments } = await supabaseAdmin
      .from('class_students')
      .select('class_id')
      .eq('student_id', req.userId!)

    const classIds = (enrollments ?? []).map(e => e.class_id as string)
    if (classIds.length === 0) {
      res.json([])
      return
    }
    query = query.in('class_id', classIds).eq('published', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('activities GET error:', error)
    res.status(500).json({ error: 'Erro ao buscar atividades' })
    return
  }

  res.json((data ?? []).map(a => mapActivity(a as Record<string, unknown>)))
})

// POST /api/activities — teacher creates activity (one row per classId)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, school_id')
    .eq('id', req.userId!)
    .single()

  if (!profile || !['teacher', 'coordinator', 'admin'].includes(profile.role as string)) {
    res.status(403).json({ error: 'Sem permissão para criar atividades' })
    return
  }

  const {
    title, classIds, subjectId, type, startDate, dueDate, dueTime,
    weight, description, allowResubmit, maxAttempts,
  } = req.body as {
    title?: string
    classIds?: string[]
    subjectId?: string
    type?: string
    startDate?: string
    dueDate?: string
    dueTime?: string
    weight?: number
    description?: string
    allowResubmit?: boolean
    maxAttempts?: number
  }

  if (!title?.trim() || !classIds?.length || !dueDate) {
    res.status(400).json({ error: 'title, classIds e dueDate são obrigatórios' })
    return
  }

  const dueDatetime = `${dueDate}T${dueTime ?? '23:59'}:00`

  const rows = classIds.map(classId => ({
    school_id: profile.school_id,
    class_id: classId,
    teacher_id: req.userId!,
    subject_id: subjectId || null,
    title: title.trim(),
    type: type ?? 'trabalho',
    description: description?.trim() || null,
    start_date: startDate ? `${startDate}T00:00:00` : null,
    due_date: dueDatetime,
    weight: weight ?? 20,
    allow_resubmit: allowResubmit ?? false,
    max_attempts: maxAttempts ?? 1,
    published: true,
  }))

  const { data, error } = await supabaseAdmin
    .from('activities')
    .insert(rows)
    .select(ACTIVITY_SELECT)

  if (error) {
    console.error('activities POST error:', error)
    res.status(500).json({ error: 'Erro ao criar atividade' })
    return
  }

  res.status(201).json((data ?? []).map(a => mapActivity(a as Record<string, unknown>)))
})

export default router
