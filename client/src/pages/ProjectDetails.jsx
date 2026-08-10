import React, {useEffect, useState} from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ProjectDetails(){
  const { id } = useParams()
  const [project,setProject]=useState(null)

  useEffect(()=>{fetchProject()},[id])
  async function fetchProject(){
    const res = await fetch(`http://localhost:5500/api/projects/${id}`)
    const data = await res.json()
    setProject(data)
  }

  if(!project) return <div className="container section" style={{ textAlign: 'center', color: 'var(--medium-gray)' }}>Loading project data...</div>

  return (
    <div>
      {project.image && (
        <div style={{ width: '100%', height: '400px', backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      )}
      
      <div className="container section">
        <Link to="/projects" style={{ display: 'inline-block', marginBottom: '24px', color: 'var(--medium-gray)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>← Back to Projects</Link>
        
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge">{project.status}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', fontWeight: 600, letterSpacing: '1px' }}>ID: {project.projectId}</span>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{project.name}</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.8 }}>{project.description}</p>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                <span>PROJECT PROGRESS</span>
                <span>{project.progressPercentage}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '16px', borderRadius: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${project.progressPercentage}%`, borderRadius: '8px' }}></div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{ backgroundColor: 'var(--light-gray)', border: 'none', padding: '32px' }}>
            <span className="label" style={{ marginBottom: '24px' }}>TECHNICAL SPECIFICATIONS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Location</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.location}, Bangladesh</div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Project Type</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.projectType} Development</div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Allocated Budget</div>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--black)' }}>BDT {project.budgetBDT.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
