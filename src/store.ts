import { create } from 'zustand'
import type { PromptsJson } from './types'

type State = {
  dark: boolean
  setDark: (v: boolean) => void
  data: PromptsJson | null
  setData: (d: PromptsJson) => void
  favorites: Record<string, true>
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

function loadFavorites(): Record<string, true> {
  try {
    const raw = localStorage.getItem('pv_favs')
    if (!raw) return {}
    const obj = JSON.parse(raw)
    return obj && typeof obj === 'object' ? obj : {}
  } catch { return {} }
}

export const useVault = create<State>((set, get) => ({
  dark: (localStorage.getItem('pv_dark') ?? 'false') === 'true',
  setDark: (v) => { localStorage.setItem('pv_dark', String(v)); set({ dark: v }) },
  data: (() => {
    try { const raw = localStorage.getItem('pv_json'); return raw ? JSON.parse(raw) : null } catch { return null }
  })(),
  setData: (d) => { try { localStorage.setItem('pv_json', JSON.stringify(d)) } catch {}; set({ data: d }) },
  favorites: loadFavorites(),
  toggleFavorite: (id) => {
    const favs = { ...get().favorites }
    if (favs[id]) delete favs[id]; else favs[id] = true
    try { localStorage.setItem('pv_favs', JSON.stringify(favs)) } catch {}
    set({ favorites: favs })
  },
  isFavorite: (id) => !!get().favorites[id],
  clearFavorites: () => { try { localStorage.removeItem('pv_favs') } catch {}; set({ favorites: {} }) },
}))
