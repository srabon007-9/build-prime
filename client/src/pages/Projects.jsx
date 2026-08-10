import React, {useEffect, useState} from 'react'
import ProjectCard from '../components/ProjectCard'

export default function Projects(){
  const [projects,setProjects]=useState([])
  const [q,setQ]=useState('')
  const [type,setType]=useState('All')
  const [status,setStatus]=useState('All')

  useEffect(()=>{fetchProjects()},[])
  async function fetchProjects(){
    const res = await fetch('http://localhost:5500/api/projects')
    const data = await res.json()
    setProjects(data)
  }

  const filtered = projects.filter(p=>{
    const matchesQ = q === '' || [p.name,p.projectId,p.location].join(' ').toLowerCase().includes(q.toLowerCase())
    const matchesType = type==='All' || p.projectType===type
    const matchesStatus = status==='All' || p.status===status
    return matchesQ && matchesType && matchesStatus
  })

  return (
    <div className="container">
      <h2>Projects</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Search name, id, location" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option>All</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Industrial</option>
          <option>Infrastructure</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option>All</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Upcoming</option>
        </select>
      </div>
      <div className="projects-grid">
        {filtered.map(p=> <ProjectCard key={p._id} project={p} />)}
      </div>
    </div>
  )
}
