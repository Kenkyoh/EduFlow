import { useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[70]" onClick={onCancel} />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-modal w-full max-w-sm pointer-events-auto animate-fade-in">
          <div className="px-6 pt-5 pb-4 flex items-start gap-3">
            {danger && (
              <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-[#0F172A]">{title}</h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="px-6 pb-5 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary text-sm"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={clsx('text-sm gap-1.5', danger ? 'btn-danger' : 'btn-primary')}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
