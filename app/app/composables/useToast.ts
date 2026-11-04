export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
  title?: string
  duration: number
  action?: ToastAction
}

export interface ToastOptions {
  title?: string
  duration?: number
  action?: ToastAction
}

let seq = 0

/** Notifikasi singkat yang bisa dipanggil dari mana saja. */
export function useToast() {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const push = (type: ToastItem['type'], message: string, opts: ToastOptions = {}) => {
    const id = ++seq
    const item: ToastItem = {
      id,
      type,
      message,
      title: opts.title,
      action: opts.action,
      duration: opts.duration ?? (type === 'error' ? 6500 : 4000)
    }
    toasts.value = [...toasts.value.slice(-3), item]
    return id
  }

  return {
    toasts,
    dismiss,
    push,
    success: (m: string, o?: ToastOptions) => push('success', m, o),
    error: (m: string, o?: ToastOptions) => push('error', m, o),
    info: (m: string, o?: ToastOptions) => push('info', m, o)
  }
}

