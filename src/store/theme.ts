import { create } from 'zustand'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('vekta_theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try { localStorage.setItem('vekta_theme', theme) } catch {}
}

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  const initial = getInitialTheme()
  applyTheme(initial)
  return {
    theme: initial,
    toggleTheme() {
      const next = get().theme === 'light' ? 'dark' : 'light'
      applyTheme(next)
      set({ theme: next })
    },
  }
})
