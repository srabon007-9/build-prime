import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({project}){
  return (
    <div className="card">
      <img className="project-image" src={project.image} alt="" onError={(e)=>e.target.style.display='none'} />
      <h3>{project.name}</h3>
      <div style={{fontSize:13,color:'#666'}}>{project.projectId} • {project.location}</div>
      <p>{project.projectType} • {project.status}</p>
      <div className="progress" style={{marginTop:8}}>
        <div style={{width: `${project.progressPercentage}%`}}></div>
      </div>
      <div style={{marginTop:8,display:'flex',justifyContent:'space-between'}}>
        <div>BDT {project.budgetBDT.toLocaleString()}</div>
        <Link to={`/projects/${project._id}`}>Details</Link>
      </div>
    </div>
  )
}
