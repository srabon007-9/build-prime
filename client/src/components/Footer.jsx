import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer style={{ backgroundColor: 'var(--light-gray)', padding: '60px 0 20px', marginTop: '40px' }}>
      <div className="container">
        <div className="grid-3" style={{ marginBottom: '40px', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--black)', borderRadius: '2px' }}></div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>BuildPrime Construction</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Structural engineering, construction management and technical solutions for Bangladesh's next generation of infrastructure.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <span className="label">Quick Links</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <Link to="/" style={{ color: 'var(--black)', textDecoration: 'none' }}>Home</Link>
                <Link to="/projects" style={{ color: 'var(--black)', textDecoration: 'none' }}>Projects</Link>
                <Link to="/estimator" style={{ color: 'var(--black)', textDecoration: 'none' }}>Estimator</Link>
                <Link to="/my-estimates" style={{ color: 'var(--black)', textDecoration: 'none' }}>My Estimates</Link>
              </div>
            </div>
            <div>
              <span className="label">Our Services</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--black)' }}>
                <span>Residential Building</span>
                <span>Commercial Development</span>
                <span>Industrial Construction</span>
                <span>Project Consultation</span>
              </div>
            </div>
          </div>

          <div>
            <span className="label">Contact</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--black)' }}>
              <span>Dhaka, Bangladesh</span>
              <span>+880 1XXX-XXXXXX</span>
              <span>info@buildprime.com</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--medium-gray)' }}>
          <span>© 2026 BuildPrime Construction — Demo project</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
