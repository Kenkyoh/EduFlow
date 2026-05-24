import { create } from 'zustand'
import type { User } from '../types'
import { supabase } from '../lib/supabase'

interface ProfileRow {
  id: string
  name: string
  role: User['role']
  institution: string | null
  school_id: string | null
  bio: string | null
  avatar_url: string | null
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, institution, school_id, bio, avatar_url')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return data as ProfileRow
}

function toUser(profile: ProfileRow, email: string): User {
  return {
    id: profile.id,
    name: profile.name,
    email,
    role: profile.role,
    institution: profile.institution ?? 'Vekta',
    schoolId: profile.school_id ?? undefined,
    avatar: profile.avatar_url ?? undefined,
    bio: profile.bio ?? undefined,
  }
}

interface AuthStore {
  user: User | null
  loginWithCredentials: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
  updateProfile: (updates: { name?: string; avatar?: string; bio?: string }) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  loginWithCredentials: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user || !data.session) {
      throw new Error(error?.message ?? 'Email ou senha inválidos')
    }

    const profile = await fetchProfile(data.user.id)
    if (!profile) throw new Error('Perfil não encontrado. Contate o suporte.')

    set({ user: toUser(profile, data.user.email ?? '') })
  },

  logout: async () => {
    try { await supabase.auth.signOut() } catch { /* ignora erros de rede */ }
    set({ user: null })
  },

  restoreSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const profile = await fetchProfile(session.user.id)
    if (!profile) return

    set({ user: toUser(profile, session.user.email ?? '') })
  },

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))
