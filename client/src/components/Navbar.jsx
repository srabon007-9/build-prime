import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout(){
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <Link to="/" style={{fontWeight:700,fontSize:18}}>BuildPrime</Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/estimator">Estimator</Link>
          {token ? (
            <>
              <Link to="/my-estimates">My Estimates</Link>
              <button onClick={handleLogout} style={{marginLeft:8}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Log In</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
