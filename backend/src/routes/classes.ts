import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import { authenticate } from '../middleware/authenticate'
import type { AuthRequest } from '../middleware/authenticate'

const router = Router()

const CLASS_SELECT = `
  id, name, year, period, grading_type,
  students_count, delivery_rate, average, at_risk,
  subject:subject_id ( id, name, color, color_light ),
  teacher:teacher_id ( id, name )
`

function mapClass(c: Record<string, unknown>) {
  const subject = c.subject as Record<string, string> | null
  const teacher = c.teacher as Record<string, string> | null
  return {
    id: c.id as string,
    name: c.name as string,
    subjectId: subject?.id ?? '',
    subjectName: subject?.name ?? '',
    color: subject?.color ?? '#1E3A8A',
    colorLight: subject?.color_light ?? '#EFF6FF',
    teacher: teacher?.name ?? '',
    teacherId: teacher?.id ?? '',
    studentsCount: (c.students_count as number) ?? 0,
    year: c.year as string,
    period: c.period as string,
    deliveryRate: (c.delivery_rate as number) ?? 0,
    gradingType: (c.grading_type as string) ?? 'numeric',
    average: (c.average as number | null) ?? null,
    atRisk: (c.at_risk as number) ?? 0,
  }
}

// GET /api/classes — lista turmas filtradas por perfil
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
    .from('classes')
    .select(CLASS_SELECT)
    .eq('school_id', profile.school_id)
    .order('name')

  if (profile.role === 'teacher') {
    // Professor vê apenas suas turmas
    query = query.eq('teacher_id', req.userId!)
  } else if (profile.role === 'student') {
    // Aluno vê turmas em que está matriculado
    const { data: enrollments } = await supabaseAdmin
      .from('class_students')
      .select('class_id')
      .eq('student_id', req.userId!)

    const classIds = (enrollments ?? []).map(e => e.class_id as string)
    if (classIds.length === 0) {
      res.json([])
      return
    }
    query = query.in('id', classIds)
  }
  // coordinator e admin veem todas da escola

  const { data, error } = await query

  if (error) {
    res.status(500).json({ error: 'Erro ao buscar turmas' })
    return
  }

  res.json((data ?? []).map(c => mapClass(c as Record<string, unknown>)))
})

// GET /api/classes/:id — detalhes de uma turma
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('classes')
    .select(CLASS_SELECT)
    .eq('id', req.params.id)
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Turma não encontrada' })
    return
  }

  res.json(mapClass(data as Record<string, unknown>))
})

// POST /api/classes — cria turma (teacher/coordinator/admin)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, school_id')
    .eq('id', req.userId!)
    .single()

  if (!profile || !['teacher', 'coordinator', 'admin'].includes(profile.role as string)) {
    res.status(403).json({ error: 'Sem permissão para criar turmas' })
    return
  }

  const { subjectId, teacherId, name, year, period, gradingType } = req.body as {
    subjectId?: string
    teacherId?: string
    name?: string
    year?: string
    period?: string
    gradingType?: string
  }

  if (!subjectId || !name) {
    res.status(400).json({ error: 'subjectId e name são obrigatórios' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('classes')
    .insert({
      school_id: profile.school_id,
      subject_id: subjectId,
      teacher_id: teacherId ?? req.userId!,
      name,
      year: year ?? new Date().getFullYear().toString(),
      period: period ?? '1º Bimestre',
      grading_type: gradingType ?? 'numeric',
    })
    .select(CLASS_SELECT)
    .single()

  if (error) {
    res.status(500).json({ error: 'Erro ao criar turma' })
    return
  }

  res.status(201).json(mapClass(data as Record<string, unknown>))
})

export default router
