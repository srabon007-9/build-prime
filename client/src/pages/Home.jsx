// ====================================================================
// 🏠 HOME PAGE (Home.jsx)
// ====================================================================
// EDIT PAGE CONTENT HERE:
// - SERVICES     : Edit or add home page service cards (lines 14-21)
// - TESTIMONIALS : Edit or add client reviews (lines 23-27)
// - FAQ          : Edit or add frequently asked questions (lines 29-33)
// ====================================================================

import React from 'react'
import { Link } from 'react-router-dom'

// --- 1. CONTENT DATA ARRAYS ---
const SERVICES = [
  { icon: '🏠', title: 'Residential Construction', text: 'Modern apartment complexes, duplex family homes, and planned residential developments built to international standards.' },
  { icon: '🏢', title: 'Commercial Development', text: 'State-of-the-art office towers, retail showrooms, shopping plazas, and mixed-use commercial properties.' },
  { icon: '🌿', title: 'Land Development', text: 'Strategic site preparation, land acquisition planning, cost estimation, and investor stage management.' },
  { icon: '📋', title: 'Project Management', text: 'Real-time stage-by-stage engineering monitoring, payment tracking, and milestone status reporting.' },
  { icon: '💰', title: 'Cost Breakdown Planning', text: 'Transparent budget forecasts, structural material breakdowns, and preliminary cost estimates for every scale.' },
  { icon: '🔩', title: 'Materials & Equipment', text: 'Logistics planning for 500W rebar, cement, heavy machinery, skilled labor, and site resources.' },
]

const TESTIMONIALS = [
  { name: 'Mahmud Hossain', role: 'Real Estate Investor', text: 'BuildPrime gave us complete cost transparency and regular engineering updates before we broke ground. Outstanding professional commitment.' },
  { name: 'Nusrat Jahan', role: 'Homeowner', text: 'The stage-by-stage payment tracking made every construction milestone crystal clear. I always felt in control of my investment.' },
  { name: 'Tanvir Ahmed', role: 'Commercial Client', text: 'On-time delivery, honest communication, and impeccable site safety standards. BuildPrime is our trusted building partner in Dhaka.' },
]

const FAQ = [
  { q: 'How do I request a construction quotation?', a: 'Fill out our online Request Quote form or contact us via Call/WhatsApp. Our engineering team will review your site details and respond within 24 hours.' },
  { q: 'Can investors track construction payments in real time?', a: 'Yes! Every published project page shows completed construction stages, payment targets, total collected funds, and full transaction history.' },
  { q: 'How accurate is the online Cost Calculator?', a: 'Our Cost Calculator uses live Bangladesh market parameters (location factors, floor counts, material standards) to provide an accurate preliminary budget.' },
]

function Stars() {
  return <div className="testimonial-stars" aria-label="5 stars">★★★★★</div>
}

// --- 2. HOME PAGE COMPONENT ---
export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" aria-label="BuildPrime Hero">
        <div className="container hero-content">
          <span className="label">BuildPrime Construction</span>
          <h1>Trusted Construction &amp; Real Estate Development in Bangladesh</h1>
          <p>
            We engineer, estimate, construct, and monitor landmark projects with 100% transparent
            stage-by-stage reporting for clients and investors.
          </p>
          <div className="hero-actions">
            <Link to="/quote" className="btn btn-primary">Request Quote →</Link>
            <Link to="/projects" className="btn btn-hero-secondary">View Projects →</Link>
          </div>
        </div>
      </section>

      {/* Trust & Experience Statistics */}
      <section className="trust-band" aria-label="Key statistics">
        <div className="container trust-grid">
          <div><strong>12+</strong><span>Years Experience</span></div>
          <div><strong>30+</strong><span>Project Partners</span></div>
          <div><strong>1.2M</strong><span>Sq. Ft. Built</span></div>
          <div><strong>24/7</strong><span>Site Monitoring</span></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="label">Our Core Capabilities</span>
            <h2>Engineering Excellence from Foundation to Handover</h2>
            <p className="text-muted">BuildPrime combines structural expertise, cost forecasting, premium material sourcing, and transparent monitoring.</p>
          </div>
          <div className="grid-3">
            {SERVICES.map(service => (
              <div className="card service-card" key={service.title}>
                <div>
                  <div className="service-icon" aria-hidden="true">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p className="text-muted">{service.text}</p>
                </div>
                <Link to="/services" className="service-link">Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency & Process Section */}
      <section className="section soft-section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="label">Complete Transparency</span>
            <h2>Every Stage, Payment &amp; Progress Milestone Tracked Online</h2>
            <p className="text-muted" style={{ marginBottom: '28px' }}>
              When BuildPrime starts a development project, clients and investors can monitor land acquisition, structural foundation, column casting, finishing, and stage payments directly on the site page.
            </p>
            <Link to="/projects" className="btn btn-primary">Explore Active Sites →</Link>
          </div>
          <div className="process-list">
            <div><strong>1</strong><span>Land Acquisition &amp; Soil Test Planning</span></div>
            <div><strong>2</strong><span>Architectural Blueprint &amp; Cost Forecast</span></div>
            <div><strong>3</strong><span>Stage-by-Stage Milestone Payments</span></div>
            <div><strong>4</strong><span>Real-Time Site Monitoring &amp; Handover</span></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="label">Client Feedback</span>
            <h2>Built On Trust, Integrity &amp; Proven Quality</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(item => (
              <div className="card testimonial-card" key={item.name}>
                <div>
                  <Stars />
                  <p>"{item.text}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" aria-hidden="true">{item.name[0]}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <span className="label">Frequently Asked Questions</span>
            <h2>Common Queries About Our Process</h2>
          </div>
          <div className="faq-list" style={{ maxWidth: '820px', margin: '0 auto' }}>
            {FAQ.map((item, i) => (
              <div className="card faq-card" key={item.q}>
                <h3>
                  <span className="faq-icon" aria-hidden="true">{i + 1}</span>
                  {item.q}
                </h3>
                <p className="text-muted" style={{ paddingLeft: '42px' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Band */}
      <section className="cta-band" aria-label="Call to action">
        <div className="container cta-content">
          <div>
            <span className="label">Ready to Build?</span>
            <h2>Talk to Our Lead Engineers About Your Project</h2>
          </div>
          <Link to="/quote" className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Request Quote →</Link>
        </div>
      </section>
    </div>
  )
}
