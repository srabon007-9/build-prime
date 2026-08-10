import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const res = await fetch('http://localhost:5500/api/auth/register',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,password})
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Registration failed')
      navigate('/login')
    }catch(err){setError('Server error')}
  }

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '40px', backgroundColor: 'var(--white)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="label">BuildPrime</span>
          <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>CREATE YOUR ACCOUNT</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" required />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '24px' }}>CREATE ACCOUNT →</button>
          
          {error && <div style={{ color: '#D32F2F', backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>{error}</div>}
          
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--black)', fontWeight: 600 }}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
