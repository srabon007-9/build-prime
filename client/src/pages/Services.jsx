// ====================================================================
// 🛠️ SERVICES PAGE (Services.jsx)
// ====================================================================
// To add or edit services, modify the SERVICES array below.
// ====================================================================

import React from 'react'
import { Link } from 'react-router-dom'

const SERVICES = [
  { icon: '🏠', title: 'Residential Construction', text: 'Multi-story apartment complexes, private luxury villas, and planned residential developments built to code.' },
  { icon: '🏢', title: 'Commercial Projects', text: 'Corporate offices, retail complexes, shopping centers, and mixed-use commercial properties.' },
  { icon: '🌿', title: 'Land Development', text: 'Soil testing, land acquisition strategy, site preparation, cost estimation, and investor planning.' },
  { icon: '📋', title: 'Project Management', text: 'On-site engineering monitoring, material inspection, milestone payment tracking, and stage updates.' },
  { icon: '🔩', title: 'Materials & Equipment', text: 'Resource planning for 500W rebar, cement, concrete batching, heavy cranes, labor, and logistics.' },
  { icon: '💬', title: 'Consultation & Quotation', text: 'Architectural planning review, transparent budget breakdowns, and professional client consultations.' },
]

export default function Services() {
  return (
    <div>
      {/* Page Hero Header */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Our Services</span>
          <h1>Construction Services Built Around Trust</h1>
          <p>BuildPrime provides end-to-end engineering, cost control, materials planning, and transparent site monitoring.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {SERVICES.map(service => (
              <div className="card service-card" key={service.title}>
                <div>
                  <div className="service-icon" aria-hidden="true">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p className="text-muted">{service.text}</p>
                </div>
                <Link to="/quote" className="service-link">Request Plan →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-band">
        <div className="container cta-content">
          <div>
            <span className="label">Need a Customized Project Plan?</span>
            <h2>Get a Detailed Engineering &amp; Cost Proposal Today.</h2>
          </div>
          <Link to="/quote" className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Request Quote →</Link>
        </div>
      </section>
    </div>
  )
}
