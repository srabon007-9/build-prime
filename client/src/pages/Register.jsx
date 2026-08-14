import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { ok, data } = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
    setSubmitting(false)
    if (!ok) return setError(data.message || 'Registration failed')
    navigate('/login')
  }

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="label">BuildPrime</span>
          <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Create Your Account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input id="reg-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" minLength={6} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account →'}
          </button>

          {error && <div className="error-banner">{error}</div>}

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--black)', fontWeight: 600 }}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
