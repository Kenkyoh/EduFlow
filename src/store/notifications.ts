import { create } from 'zustand'
import type { Notification } from '../types'
import { mockNotifications } from '../data/mock'

interface NotificationsStore {
  notifications: Notification[]
  isOpen: boolean
  unreadCount: number
  openPanel: () => void
  closePanel: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (n: Notification) => void
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: mockNotifications,
  isOpen: false,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
  markAsRead: (id) =>
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
      return { notifications, unreadCount: notifications.filter(n => !n.read).length }
    }),
  markAllAsRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (n) =>
    set(state => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + (n.read ? 0 : 1),
    })),
}))
