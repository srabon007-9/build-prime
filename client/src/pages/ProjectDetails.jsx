import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

export default function ProjectDetails(){
  const { id } = useParams()
  const [project,setProject]=useState(null)

  useEffect(()=>{fetchProject()},[id])
  async function fetchProject(){
    const res = await fetch(`http://localhost:5500/api/projects/${id}`)
    const data = await res.json()
    setProject(data)
  }

  if(!project) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h2>{project.name}</h2>
      {project.image && <img src={project.image} className="project-image" alt="" />}
      <p>{project.description}</p>
      <div>Project ID: {project.projectId}</div>
      <div>Location: {project.location}</div>
      <div>Type: {project.projectType}</div>
      <div>Status: {project.status}</div>
      <div style={{marginTop:8}}>Progress</div>
      <div className="progress"><div style={{width:`${project.progressPercentage}%`}}></div></div>
      <div style={{marginTop:8}}>Budget: BDT {project.budgetBDT.toLocaleString()}</div>
    </div>
  )
}
