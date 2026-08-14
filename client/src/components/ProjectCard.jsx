import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const price = project.estimatedPrice || project.budgetBDT || 0
  const image = project.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop'
  const statusClass = project.status ? project.status.toLowerCase().replace(' ', '-') : 'upcoming'

  return (
    <div className="card project-card">
      {/* Project Image */}
      <div className="project-card-image-wrap">
        <img src={image} alt={`${project.name} construction site`} />
        <span className={`badge ${statusClass}`}>{project.status || 'Upcoming'}</span>
      </div>

      {/* Card Content */}
      <div className="project-card-body">
        <div className="project-card-meta">
          <span className="project-id">{project.projectId}</span>
          <span className="project-type">{project.projectType}</span>
        </div>

        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-location">📍 {project.location}</p>

        {/* Progress Bar & Price */}
        <div className="project-card-footer">
          <div className="project-progress-info">
            <span>Progress</span>
            <strong>{project.progressPercentage}%</strong>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${project.progressPercentage}%` }}></div>
          </div>

          <div className="project-price-row">
            <div>
              <span className="price-label">Budget</span>
              <strong className="price-amount">BDT {price.toLocaleString()}</strong>
            </div>
            <Link to={`/projects/${project._id}`} className="btn btn-secondary btn-sm">
              View Site →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
