import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
        const res = await fetch('http://localhost:5500/api/auth/login',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      navigate('/')
    }catch(err){setError('Server error')}
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /></div>
        <div style={{marginTop:8}}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /></div>
        <div style={{marginTop:8}}><button type="submit">Login</button></div>
        {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
      </form>
    </div>
  )
}
