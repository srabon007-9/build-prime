import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-inner">
        <div className="not-found-code" aria-hidden="true">404</div>
        <h2>Page Not Found</h2>
        <p className="text-muted" style={{ marginBottom: '32px', fontSize: '1.05rem' }}>
          The page you're looking for doesn't exist, was moved, or the link may be broken.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/projects" className="btn btn-secondary">View Projects</Link>
        </div>
      </div>
    </div>
  )
}
