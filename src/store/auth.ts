import { create } from 'zustand'
import type { User, UserRole } from '../types'
import { mockUsers } from '../data/mock'

interface AuthStore {
  user: User | null
  login: (email: string, role: UserRole) => void
  logout: () => void
  updateProfile: (updates: { name?: string; avatar?: string; bio?: string }) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (email: string, role: UserRole) => {
    const fallbackName: Record<string, string> = {
      student: 'Lucas Mendes',
      teacher: 'Profa. Ana Lima',
      coordinator: 'Dir. Carlos Santos',
      admin: 'Admin EduFlow',
      guardian: 'Responsável',
    }
    const found = mockUsers.find(u => u.role === role) ?? {
      id: `${role}-0`,
      name: fallbackName[role] ?? role,
      email,
      role,
      institution: role === 'admin' ? 'EduFlow' : 'Colégio Estadual São Paulo',
    }
    set({ user: { ...found, email } })
  },
  logout: () => set({ user: null }),
  updateProfile: (updates) => set(state => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}))
