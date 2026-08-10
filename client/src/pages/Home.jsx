import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '80vh', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--white)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '800px' }}>
            <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, color: 'var(--border)', marginBottom: '16px', display: 'block' }}>
              BuildPrime Bangladesh
            </span>
            <h1 style={{ fontSize: '4rem', marginBottom: '24px', letterSpacing: '-1px' }}>
              ENGINEERING THE NEW<br/>SKYLINE OF BANGLADESH
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: 'var(--light-gray)', maxWidth: '600px', lineHeight: 1.6 }}>
              Structural engineering, construction management and technical solutions for Bangladesh's next generation of infrastructure.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/projects" className="btn btn-primary" style={{ backgroundColor: 'var(--white)', color: 'var(--black)' }}>EXPLORE PROJECTS</Link>
              <Link to="/estimator" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--white)', border: '1px solid var(--white)' }}>CALCULATE COST</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px' }}>24+</div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--medium-gray)' }}>ACTIVE PROJECTS</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px' }}>1.2M</div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--medium-gray)' }}>SQ. FT. DELIVERED</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px' }}>150+</div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--medium-gray)' }}>ENGINEERING STAFF</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px' }}>9001:2015</div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--medium-gray)' }}>QUALITY STANDARD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="section" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="label">CORE CAPABILITIES</span>
            <h2>TECHNICAL UTILITY & PRECISION</h2>
          </div>
          
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { title: 'STRUCTURAL ENGINEERING', desc: 'Advanced modeling and load calculations for high-rise and industrial developments.' },
              { title: 'REGULATORY COMPLIANCE', desc: 'Full adherence to RAJUK guidelines and BNBC safety standards.' },
              { title: 'HEAVY MACHINERY', desc: 'Deployment of specialized construction equipment and cranes.' },
              { title: 'SUSTAINABLE BUILDING', desc: 'Integration of green building practices and energy-efficient materials.' },
              { title: 'PROJECT MANAGEMENT', desc: 'End-to-end oversight from foundation to final architectural finishing.' }
            ].map((cap, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '32px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--light-gray)', borderRadius: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--black)' }}></div>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{cap.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.95rem' }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured CTA */}
      <section className="section container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <span className="label">STRATEGIC PROJECT PORTFOLIO</span>
        <h2 style={{ marginBottom: '24px' }}>VIEW OUR ACTIVE DEVELOPMENTS</h2>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          Explore our real-time project progress tracker to monitor ongoing structural engineering works across Bangladesh.
        </p>
        <Link to="/projects" className="btn btn-primary">EXPLORE PROJECTS →</Link>
      </section>
    </div>
  )
}
