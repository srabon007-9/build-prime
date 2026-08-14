import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api'

function SkeletonRows() {
  return (
    <div className="portfolio-list">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="portfolio-row" style={{ cursor: 'default' }}>
          <div className="skeleton" style={{ width: '160px', height: '100px', borderRadius: '8px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton skeleton-line short" style={{ height: '18px' }}></div>
            <div className="skeleton skeleton-line tall" style={{ width: '70%' }}></div>
            <div className="skeleton skeleton-line medium"></div>
          </div>
          <div className="skeleton skeleton-line" style={{ width: '60px', height: '32px' }}></div>
        </div>
      ))}
    </div>
  )
}

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [type, setType] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_URL}/projects`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Could not load portfolio')
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const projectTypes = ['All', ...new Set(projects.map(p => p.projectType))]
  const filtered = type === 'All' ? projects : projects.filter(p => p.projectType === type)
  const completed = projects.filter(p => p.status === 'Completed').length
  const avgProgress = projects.length ? Math.round(projects.reduce((s, p) => s + p.progressPercentage, 0) / projects.length) : 0

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Portfolio Explorer</span>
          <h1>Explore Our Construction Portfolio</h1>
          <p>Filter engineering developments by category and inspect progress milestones, budget allocations, and site locations.</p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section">
        <div className="container">
          {/* Top Summary Stats */}
          <div className="stats-grid">
            <div>
              <strong>{projects.length}</strong>
              <span>Total Sites</span>
            </div>
            <div>
              <strong>{completed}</strong>
              <span>Handed Over</span>
            </div>
            <div>
              <strong>{avgProgress}%</strong>
              <span>Average Progress</span>
            </div>
          </div>

          {/* Type Filters */}
          {!loading && !error && projects.length > 0 && (
            <div className="filter-row">
              {projectTypes.map(option => (
                <button
                  key={option}
                  onClick={() => setType(option)}
                  className={type === option ? 'filter-btn active' : 'filter-btn'}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Skeleton Loader */}
          {loading && <SkeletonRows />}

          {/* Error State */}
          {error && (
            <div className="card empty-state">
              <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>⚠️</div>
              <h3>Could not load portfolio</h3>
              <p className="text-muted">{error}</p>
            </div>
          )}

          {/* Portfolio List */}
          {!loading && !error && (
            <div className="portfolio-list">
              {filtered.length > 0 ? (
                filtered.map(project => (
                  <Link to={`/projects/${project._id}`} className="portfolio-row" key={project._id}>
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop'}
                      alt={`${project.name} construction site`}
                    />
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span className={`badge ${project.status ? project.status.toLowerCase() : ''}`}>{project.status}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', fontWeight: 600 }}>{project.projectId}</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{project.name}</h3>
                      <p>📍 {project.location} · {project.projectType}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--green)', display: 'block' }}>{project.progressPercentage}%</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progress</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="card empty-state">
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</div>
                  <h3>No Projects Published Yet</h3>
                  <p className="text-muted">The portfolio will display company projects once published by admin.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
