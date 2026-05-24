import { Router } from 'express'
import type { Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import { authenticate } from '../middleware/authenticate'
import type { AuthRequest } from '../middleware/authenticate'

const router = Router()

// GET /api/subjects — lista disciplinas da escola do usuário
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('school_id')
    .eq('id', req.userId!)
    .single()

  if (!profile?.school_id) {
    res.status(400).json({ error: 'Usuário sem escola associada' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id, name, color, color_light')
    .eq('school_id', profile.school_id)
    .order('name')

  if (error) {
    res.status(500).json({ error: 'Erro ao buscar disciplinas' })
    return
  }

  const subjects = (data ?? []).map(s => ({
    id: s.id as string,
    name: s.name as string,
    color: s.color as string,
    colorLight: s.color_light as string,
  }))

  res.json(subjects)
})

// POST /api/subjects — cria disciplina (coordinator/admin)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, school_id')
    .eq('id', req.userId!)
    .single()

  if (!profile || !['coordinator', 'admin'].includes(profile.role as string)) {
    res.status(403).json({ error: 'Sem permissão para criar disciplinas' })
    return
  }

  const { name, color, colorLight } = req.body as {
    name?: string
    color?: string
    colorLight?: string
  }

  if (!name) {
    res.status(400).json({ error: 'Nome da disciplina é obrigatório' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .insert({
      school_id: profile.school_id,
      name,
      color: color ?? '#1E3A8A',
      color_light: colorLight ?? '#EFF6FF',
    })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: 'Erro ao criar disciplina' })
    return
  }

  res.status(201).json(data)
})

export default router
