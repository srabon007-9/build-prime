import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="container" style={{maxWidth:420}}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" /></div>
        <div style={{marginTop:8}}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /></div>
        <div style={{marginTop:8}}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /></div>
        <div style={{marginTop:8}}><button type="submit">Register</button></div>
        {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
      </form>
    </div>
  )
}
