import { create } from 'zustand'
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastStore {
  toasts: Toast[]
  add: (type: Toast['type'], message: string) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (type, message) => {
    const id = Math.random().toString(36).slice(2)
    set(state => ({ toasts: [...state.toasts, { id, type, message }] }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

export function toast(message: string, type: Toast['type'] = 'success') {
  useToastStore.getState().add(type, message)
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
}

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts)
  const remove = useToastStore(s => s.remove)

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast animate-slide-down">
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            aria-label="Fechar notificação"
            onClick={() => remove(t.id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
