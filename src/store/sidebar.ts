import { create } from 'zustand'

interface SidebarStore {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  openMobile: () => void
  closeMobile: () => void
}

export const useSidebarStore = create<SidebarStore>(set => ({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => set(s => ({ collapsed: !s.collapsed })),
  openMobile:  () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
}))
