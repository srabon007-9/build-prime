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
    <div>
      <div style={{ backgroundColor: 'var(--light-gray)', padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="label">BuildPrime BD / Operational Assets</span>
          <h1 style={{ marginBottom: '16px' }}>INFRASTRUCTURE<br/>PROGRESS TRACKER</h1>
          <p className="text-muted" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
            Monitor active construction projects and engineering progress across Bangladesh.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ marginBottom: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', backgroundColor: 'var(--light-gray)', border: 'none' }}>
          <div className="form-group" style={{ flex: '1 1 250px', marginBottom: 0 }}>
            <label>Search Projects</label>
            <input placeholder="Search name, ID, location..." value={q} onChange={e=>setQ(e.target.value)} style={{ backgroundColor: 'var(--white)' }} />
          </div>
          <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
            <label>Project Type</label>
            <select value={type} onChange={e=>setType(e.target.value)} style={{ backgroundColor: 'var(--white)' }}>
              <option>All</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
            <label>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{ backgroundColor: 'var(--white)' }}>
              <option>All</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Upcoming</option>
            </select>
          </div>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filtered.length > 0 ? (
            filtered.map(p=> <ProjectCard key={p._id} project={p} />)
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--medium-gray)' }}>
              <h3>No projects found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
