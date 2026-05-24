import { Router } from 'express'
import type { Request, Response } from 'express'
import { supabaseAdmin, createAuthClient } from '../config/supabase'
import { authenticate } from '../middleware/authenticate'
import type { AuthRequest } from '../middleware/authenticate'
import type { AuthUser } from '../types'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' })
    return
  }

  // Cliente isolado para signInWithPassword — evita contaminar supabaseAdmin com sessão de usuário
  const authClient = createAuthClient()
  const { data, error } = await authClient.auth.signInWithPassword({ email, password })

  if (error || !data.user || !data.session) {
    res.status(401).json({ error: 'Email ou senha inválidos' })
    return
  }

  // supabaseAdmin usa service role key sem sessão → bypassa RLS
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, name, role, institution, school_id, bio, avatar_url')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile) {
    res.status(500).json({ error: 'Perfil não encontrado. Contate o suporte.' })
    return
  }

  const user: AuthUser = {
    id: data.user.id,
    name: profile.name as string,
    email: data.user.email ?? '',
    role: profile.role as AuthUser['role'],
    institution: (profile.institution as string | null) ?? 'Vekta',
    schoolId: (profile.school_id as string | null) ?? null,
    avatar: (profile.avatar_url as string | null) ?? null,
    bio: (profile.bio as string | null) ?? null,
  }

  res.json({
    user,
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
  })
})

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  await supabaseAdmin.auth.admin.signOut(req.userId!)
  res.json({ message: 'Logout realizado com sucesso' })
})

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, name, role, institution, school_id, bio, avatar_url')
    .eq('id', req.userId!)
    .single()

  if (error || !profile) {
    res.status(404).json({ error: 'Usuário não encontrado' })
    return
  }

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(req.userId!)

  const user: AuthUser = {
    id: req.userId!,
    name: profile.name as string,
    email: userData.user?.email ?? '',
    role: profile.role as AuthUser['role'],
    institution: (profile.institution as string | null) ?? 'Vekta',
    schoolId: (profile.school_id as string | null) ?? null,
    avatar: (profile.avatar_url as string | null) ?? null,
    bio: (profile.bio as string | null) ?? null,
  }

  res.json({ user })
})

export default router
