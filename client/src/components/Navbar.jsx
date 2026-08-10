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
    <header style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--white)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--black)', borderRadius: '2px' }}></div>
          <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--black)', textDecoration: 'none', letterSpacing: '-0.5px' }}>BuildPrime</Link>
        </div>
        
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: '0.9rem' }}>Home</Link>
          <Link to="/projects" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: '0.9rem' }}>Projects</Link>
          <Link to="/estimator" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: '0.9rem' }}>Estimator</Link>
        </nav>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {token ? (
            <>
              <Link to="/my-estimates" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: '0.9rem' }}>My Estimates</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--black)', fontWeight: 600, fontSize: '0.9rem' }}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Register →</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
