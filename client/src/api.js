// ====================================================================
// 🌐 API & AUTHENTICATION UTILITIES
// ====================================================================
// - API_URL   : Backend server endpoint URL
// - getToken  : Retrieves current saved login JWT token from localStorage
// - getUser   : Retrieves current logged-in user profile from localStorage
// - isAdmin   : Returns true if logged-in user role is 'admin'
// - apiFetch  : Shared helper function for API requests with auto auth header
// ====================================================================

// In production (Vercel), API is served from relative /api unless VITE_API_URL is specified
// In local development, fallback to http://localhost:5500/api when on localhost
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
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    return { ok: false, status: 0, data: { message: 'Network error — check your connection' } }
  }
}
