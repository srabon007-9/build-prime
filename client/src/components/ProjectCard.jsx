import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({project}){
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <img className="card-image" src={project.image} alt={project.name} style={{ marginBottom: 0, borderRadius: '4px 4px 0 0', height: '220px' }} onError={(e)=>e.target.style.display='none'} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span className="badge">{project.status}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', fontWeight: 600 }}>{project.projectId}</span>
        </div>
        
        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{project.name}</h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', marginBottom: '16px' }}>{project.location} • {project.projectType}</div>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
            <span>Progress</span>
            <span>{project.progressPercentage}%</span>
          </div>
          <div className="progress-bar-container" style={{ marginBottom: '16px' }}>
            <div className="progress-bar-fill" style={{ width: `${project.progressPercentage}%` }}></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>BDT {project.budgetBDT.toLocaleString()}</div>
            <Link to={`/projects/${project._id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
