export interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  tone?: 'danger' | 'default'
}

let resolver: ((value: boolean) => void) | null = null

/** Dialog konfirmasi berbasis Promise: `if (await confirm({...})) { ... }` */
export function useConfirm() {
  const state = useState('confirm-state', () => ({
    open: false,
    title: '',
    message: '',
    confirmText: 'Ya, lanjut',
    cancelText: 'Batal',
    tone: 'default' as 'danger' | 'default'
  }))

  const confirm = (opts: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      resolver?.(false)
      resolver = resolve
      state.value = {
        open: true,
        title: opts.title,
        message: opts.message ?? '',
        confirmText: opts.confirmText ?? 'Ya, lanjut',
        cancelText: opts.cancelText ?? 'Batal',
        tone: opts.tone ?? 'default'
      }
    })

  const settle = (value: boolean) => {
    state.value = { ...state.value, open: false }
    resolver?.(value)
    resolver = null
  }

  return { state, confirm, settle }
}

