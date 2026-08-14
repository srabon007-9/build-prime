import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { ok, data } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    setSubmitting(false)
    if (!ok) return setError(data.message || 'Login failed')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    navigate('/')
  }

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="label">BuildPrime</span>
          <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Member Access</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In →'}
          </button>

          {error && <div className="error-banner">{error}</div>}

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--black)', fontWeight: 600 }}>Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
