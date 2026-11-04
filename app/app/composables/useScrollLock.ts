let locks = 0

/**
 * Mengunci scroll halaman saat modal/drawer terbuka. Pakai penghitung supaya
 * modal bertumpuk (mis. konfirmasi di atas drawer) tidak saling membuka kunci.
 * Lebar scrollbar dijaga lewat `scrollbar-gutter: stable` di main.css.
 */
export function useScrollLock() {
  const lock = () => {
    if (!import.meta.client) return
    if (locks++ === 0) document.documentElement.style.overflow = 'hidden'
  }
  const unlock = () => {
    if (!import.meta.client) return
    if (locks > 0 && --locks === 0) document.documentElement.style.overflow = ''
  }
  return { lock, unlock }
}

