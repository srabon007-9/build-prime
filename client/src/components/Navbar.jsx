// ====================================================================
// 🔗 NAVBAR
// ====================================================================
// "My Flat" link only appears when the logged-in user has a booked flat.
// This is checked once on mount via a lightweight API call.
// ====================================================================

import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getToken, isAdmin, apiFetch } from '../api'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const navigate = useNavigate()
  const token = getToken()
  const admin = isAdmin()
  const [open, setOpen] = useState(false)
  const [hasFlat, setHasFlat] = useState(false)  // true only if user has a booked flat

  // Check once if this user has any booked flats
  // Only runs when user is logged in and is NOT an admin
  useEffect(() => {
    if (!token || admin) return
    apiFetch('/customer/my-flats').then(({ ok, data }) => {
      if (ok && Array.isArray(data) && data.length > 0) {
        setHasFlat(true)
      }
    })
  }, [token])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setOpen(false)
    setHasFlat(false)
    navigate('/')
  }

  function close() { setOpen(false) }
  const linkClass = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo onClick={close} />

        {/* Desktop Navigation */}
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/cost-estimator" className={linkClass}>Cost Calculator</NavLink>
          <NavLink to="/materials" className={linkClass}>Materials</NavLink>
          <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
        </nav>

        {/* Desktop User Actions */}
        <div className="nav-actions">
          {token ? (
            <>
              <NavLink to="/my-estimates" className={linkClass}>My Estimates</NavLink>
              <NavLink to="/my-portfolio" className={linkClass}>👤 My Profile</NavLink>
              {hasFlat && <NavLink to="/my-spendings" className={linkClass}>🏠 My Flat</NavLink>}
              {admin && <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>}
              {admin && <NavLink to="/start-site" className={linkClass}>New Site</NavLink>}
              {admin && <NavLink to="/admin/quotes" className={linkClass}>Quotes</NavLink>}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log In</NavLink>
              <Link to="/quote" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
                Request Quote
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <nav className={`nav-mobile${open ? ' open' : ''}`} aria-label="Mobile navigation">
        <Link to="/" onClick={close}>Home</Link>
        <Link to="/services" onClick={close}>Services</Link>
        <Link to="/projects" onClick={close}>Projects</Link>
        <Link to="/cost-estimator" onClick={close}>Cost Calculator</Link>
        <Link to="/materials" onClick={close}>Materials</Link>
        <Link to="/portfolio" onClick={close}>Portfolio</Link>
        {token ? (
          <>
            <Link to="/my-estimates" onClick={close}>My Estimates</Link>
            <Link to="/my-portfolio" onClick={close}>👤 My Profile</Link>
            {hasFlat && <Link to="/my-spendings" onClick={close}>🏠 My Flat</Link>}
            {admin && <Link to="/admin/dashboard" onClick={close}>Dashboard</Link>}
            {admin && <Link to="/start-site" onClick={close}>New Site</Link>}
            {admin && <Link to="/admin/quotes" onClick={close}>Quote Requests</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>Log In</Link>
            <Link to="/quote" onClick={close}>Request Quote</Link>
          </>
        )}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
