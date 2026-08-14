import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { API_URL, getUser } from '../api'

function SkeletonCards() {
  return (
    <div className="grid-3">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-img"></div>
          <div className="skeleton-body">
            <div className="skeleton skeleton-line short"></div>
            <div className="skeleton skeleton-line tall" style={{ marginBottom: '4px' }}></div>
            <div className="skeleton skeleton-line medium"></div>
            <div style={{ marginTop: '16px' }}>
              <div className="skeleton skeleton-line full" style={{ height: '8px', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = getUser()

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_URL}/projects`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Could not load projects')
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = projects.filter(p => {
    const matchesQ = q === '' || [p.name, p.projectId, p.location].join(' ').toLowerCase().includes(q.toLowerCase())
    const matchesType = type === 'All' || p.projectType === type
    const matchesStatus = status === 'All' || p.status === status
    return matchesQ && matchesType && matchesStatus
  })

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Project Monitoring</span>
          <h1>Construction Projects</h1>
          <p>Monitor active construction sites, stage progress, and engineering developments across Bangladesh.</p>
          {user.role === 'admin' && (
            <div style={{ marginTop: '20px' }}>
              <Link to="/start-site" className="btn btn-primary">+ Publish New Site</Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Section */}
      <div className="container section">
        {/* Search & Filters */}
        <div className="card filter-bar-card">
          <div className="form-group filter-input-group">
            <label htmlFor="search-q">Search Sites</label>
            <input
              id="search-q"
              placeholder="Search by project name, ID, or location..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <div className="form-group filter-select-group">
            <label htmlFor="type-filter">Project Type</label>
            <select id="type-filter" value={type} onChange={e => setType(e.target.value)}>
              <option>All</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
            </select>
          </div>

          <div className="form-group filter-select-group">
            <label htmlFor="status-filter">Status</label>
            <select id="status-filter" value={status} onChange={e => setStatus(e.target.value)}>
              <option>All</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Upcoming</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && <SkeletonCards />}

        {/* Error State */}
        {error && (
          <div className="card empty-state">
            <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>⚠️</div>
            <h3>Could not load projects</h3>
            <p className="text-muted">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid-3">
            {filtered.length > 0 ? (
              filtered.map(p => <ProjectCard key={p._id} project={p} />)
            ) : (
              <div className="card empty-state" style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</div>
                <h3>No Construction Sites Found</h3>
                <p className="text-muted">No projects match your filter criteria or no sites have been published yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
