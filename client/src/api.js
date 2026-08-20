const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5500/api' : '/api')

export function getToken() {
  return localStorage.getItem('token')
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user') || '{}')
}

export function isAdmin() {
  return getUser().role === 'admin'
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers })
    let data = {}
    try {
      data = await res.json()
    } catch (e) {
      data = { message: `Server returned status ${res.status}` }
    }
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    return { ok: false, status: 0, data: { message: 'Network error — check your connection' } }
  }
}
