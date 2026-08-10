import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="container">
      <section className="hero">
        <div className="left">
          <h1>Engineering the New Skyline of Bangladesh</h1>
          <p>BuildPrime Construction — demo university project showcasing projects and a simple estimator.</p>
          <div style={{marginTop:12}}>
            <Link to="/estimator"><button>Start Estimator</button></Link>
            <Link to="/projects"><button style={{marginLeft:8}}>Explore Projects</button></Link>
          </div>
        </div>
        <div className="right card">
          <h3>Featured Projects</h3>
          <p>Check the Projects page for progress and details.</p>
        </div>
      </section>

      <section style={{marginTop:20}}>
        <h3>Core Capabilities</h3>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <div className="card">Structural Engineering</div>
          <div className="card">Regulatory Compliance</div>
          <div className="card">Heavy Machinery</div>
          <div className="card">Sustainable Urbanism</div>
          <div className="card">Skilled Logistics</div>
        </div>
      </section>
    </div>
  )
}
