import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase'

export interface AuthRequest extends Request {
  userId?: string
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
    return
  }

  req.userId = user.id
  next()
}
