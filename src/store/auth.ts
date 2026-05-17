import { create } from 'zustand'
import type { User } from '../types'
import { api, setToken, clearToken, getToken } from '../lib/api'

interface LoginResponse {
  user: ApiUser
  token: string
  refreshToken: string
}

interface MeResponse {
  user: ApiUser
}

interface ApiUser {
  id: string
  name: string
  email: string
  role: User['role']
  institution: string
  schoolId: string | null
  avatar: string | null
  bio: string | null
}

function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    institution: apiUser.institution ?? 'Vekta',
    schoolId: apiUser.schoolId ?? undefined,
    avatar: apiUser.avatar ?? undefined,
    bio: apiUser.bio ?? undefined,
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
    const { user: apiUser, token } = await api.post<LoginResponse>('/api/auth/login', { email, password })
    setToken(token)
    set({ user: mapApiUser(apiUser) })
  },

  logout: async () => {
    try {
      if (getToken()) {
        await api.post('/api/auth/logout')
      }
    } catch {
      // ignora erros de rede no logout
    } finally {
      clearToken()
      set({ user: null })
    }
  },

  restoreSession: async () => {
    if (!getToken()) return
    try {
      const { user: apiUser } = await api.get<MeResponse>('/api/auth/me')
      set({ user: mapApiUser(apiUser) })
    } catch {
      clearToken()
    }
  },

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))
