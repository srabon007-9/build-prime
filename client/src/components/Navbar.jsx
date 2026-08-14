import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getUser, isAdmin } from '../api'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const admin = isAdmin()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setOpen(false)
    navigate('/')
  }

  function close() {
    setOpen(false)
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Brand Logo */}
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"></div>
          <Link to="/" onClick={close}>BuildPrime</Link>
        </div>

        {/* Desktop Navigation Links */}
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
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
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
      </nav>
    </header>
  )
}
