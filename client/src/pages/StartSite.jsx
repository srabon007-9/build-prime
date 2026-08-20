// ====================================================================
// 👑 ADMIN SITE CREATION & MANAGEMENT PAGE (StartSite.jsx)
// ====================================================================
// Allowed for ADMIN users only.
// Features: Create new project, Edit project, Delete project, Update status %
// ====================================================================

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL, apiFetch, isAdmin } from '../api'
import { useToast } from '../components/Toast'

const EMPTY = {
  name: '', location: '', projectType: 'Residential', description: '', image: '',
  landPrice: '', materialCost: '', equipmentCost: '', laborCost: '',
  permitCost: '', contingencyPercent: 10, investorCount: '',
  totalFloors: 6, flatsPerFloor: 3, defaultAreaSqFt: 1200, bookingFeePercent: 10
}

function toNum(v) { return Number(v) || 0 }

function calcEstimate(s) {
  const direct = toNum(s.landPrice) + toNum(s.materialCost) + toNum(s.equipmentCost) + toNum(s.laborCost) + toNum(s.permitCost)
  return Math.round(direct + direct * toNum(s.contingencyPercent) / 100)
}

function calcLandPerPerson(s) {
  const n = toNum(s.investorCount)
  return n ? Math.round(toNum(s.landPrice) / n) : 0
}

export default function StartSite() {
  const navigate = useNavigate()
  const toast = useToast()

  // guard
  if (!isAdmin()) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔒</div>
          <span className="label">Admin Only</span>
          <h2>Restricted Access</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>Only BuildPrime admin can manage construction sites.</p>
          <Link to="/" className="btn btn-secondary">Go to Home</Link>
        </div>
      </div>
    )
  }

  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Progress update state
  const [progressEdit, setProgressEdit] = useState({})

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    setLoadingProjects(true)
    const { ok, data } = await apiFetch('/projects')
    if (ok) setProjects(data)
    setLoadingProjects(false)
  }

  function update(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast('File size must be under 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
      toast('Photo uploaded successfully!', 'success')
    }
    reader.readAsDataURL(file)
  }

  function startEdit(project) {
    setEditingId(project._id)
    setForm({
      name: project.name || '',
      location: project.location || '',
      projectType: project.projectType || 'Residential',
      description: project.description || '',
      image: project.image || '',
      landPrice: project.landPrice || '',
      materialCost: project.materialCost || '',
      equipmentCost: project.equipmentCost || '',
      laborCost: project.laborCost || '',
      permitCost: project.permitCost || '',
      contingencyPercent: project.contingencyPercent ?? 10,
      investorCount: project.investorCount || '',
      totalFloors: project.totalFloors || 6,
      flatsPerFloor: project.flatsPerFloor || 3,
      defaultAreaSqFt: project.defaultAreaSqFt || 1200,
      bookingFeePercent: project.bookingFeePercent || 10
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.location || !form.description) {
      toast('Name, location and description are required', 'error')
      return
    }
    setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const path = editingId ? `/projects/${editingId}` : '/projects'
    const { ok, data } = await apiFetch(path, { method, body: JSON.stringify(form) })
    setSubmitting(false)
    if (!ok) { toast(data.message || 'Could not save project', 'error'); return }
    toast(editingId ? 'Project updated!' : 'New project published!', 'success')
    setEditingId(null)
    setForm(EMPTY)
    fetchProjects()
  }

  async function handleDelete(id) {
    const { ok, data } = await apiFetch(`/projects/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    if (!ok) { toast(data.message || 'Could not delete', 'error'); return }
    toast('Project deleted', 'info')
    setProjects(prev => prev.filter(p => p._id !== id))
  }

  async function handleStatusUpdate(projectId, status, progress) {
    const { ok, data } = await apiFetch(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, progressPercentage: Number(progress) })
    })
    if (!ok) { toast(data.message || 'Could not update', 'error'); return }
    toast('Status updated', 'success')
    setProjects(prev => prev.map(p => p._id === projectId ? { ...p, status: data.status, progressPercentage: data.progressPercentage } : p))
    setProgressEdit(prev => { const n = { ...prev }; delete n[projectId]; return n })
  }

  const estimate = calcEstimate(form)
  const landPerPerson = calcLandPerPerson(form)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="label">Admin — Project Management</span>
          <h1>{editingId ? 'Edit Project' : 'Publish New Construction Site'}</h1>
          <p>Create, update, and manage real BuildPrime construction projects.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* ── FORM ── */}
          <div className="grid-2" style={{ alignItems: 'start', marginBottom: 60 }}>
            <form className="card" style={{ padding: 32 }} onSubmit={handleSubmit}>
              <span className="label" style={{ marginBottom: 20 }}>
                {editingId ? '✏️ EDITING PROJECT' : '+ NEW PROJECT'}
              </span>

              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label htmlFor="name">Site Name *</label>
                  <input id="name" name="name" value={form.name} onChange={update} required />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input id="location" name="location" value={form.location} onChange={update} required />
                </div>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType" value={form.projectType} onChange={update}>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Site Photo (Upload or Paste URL)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input id="image" name="image" value={form.image} onChange={update} placeholder="https://... or click Upload" />
                    <label htmlFor="photo-file" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap', cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center' }}>
                      📁 Upload
                    </label>
                    <input id="photo-file" type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea id="description" name="description" rows="3" value={form.description} onChange={update} required />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Cost Inputs (BDT)</h3>
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label htmlFor="investorCount">Interested Investors</label>
                    <input id="investorCount" name="investorCount" type="number" min="0" value={form.investorCount} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contingencyPercent">Contingency %</label>
                    <input id="contingencyPercent" name="contingencyPercent" type="number" min="0" max="50" value={form.contingencyPercent} onChange={update} />
                  </div>
                </div>
                <div className="grid-2" style={{ gap: 16 }}>
                  {['landPrice', 'materialCost', 'equipmentCost', 'laborCost', 'permitCost'].map(field => (
                    <div className="form-group" key={field}>
                      <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace('Price', '').replace('Cost', ' Cost')}</label>
                      <input id={field} name={field} type="number" min="0" value={form[field]} onChange={update} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 16 }}>
                <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>🏢 Building Configuration</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginBottom: 16 }}>Configure the building layout — flats will be auto-generated (e.g. 1A, 1B, 1C per floor).</p>
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label htmlFor="totalFloors">Total Floors</label>
                    <input id="totalFloors" name="totalFloors" type="number" min="1" max="30" value={form.totalFloors} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="flatsPerFloor">Flats per Floor</label>
                    <input id="flatsPerFloor" name="flatsPerFloor" type="number" min="1" max="10" value={form.flatsPerFloor} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="defaultAreaSqFt">Default Area (Sq.Ft per flat)</label>
                    <input id="defaultAreaSqFt" name="defaultAreaSqFt" type="number" min="400" value={form.defaultAreaSqFt} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookingFeePercent">Booking Fee %</label>
                    <input id="bookingFeePercent" name="bookingFeePercent" type="number" min="1" max="50" value={form.bookingFeePercent} onChange={update} />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginTop: 8 }}>
                  This will generate <strong>{toNum(form.totalFloors) * toNum(form.flatsPerFloor)}</strong> flats across <strong>{toNum(form.totalFloors)}</strong> floors.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Saving…' : editingId ? '✓ Update Project' : '+ Publish Project'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                )}
              </div>
            </form>

            {/* Live preview panel */}
            <div style={{ display: 'grid', gap: 16 }}>
              {form.image && (
                <img src={form.image} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              )}
              <div className="estimate-box">
                <span className="label">Calculated Estimated Price</span>
                <h2>BDT {estimate.toLocaleString()}</h2>
                <p>Land + Materials + Equipment + Labor + Permit + Contingency</p>
              </div>
              <div className="cost-list">
                <div><span>Land per Investor</span><strong>BDT {landPerPerson.toLocaleString()}</strong></div>
                <div><span>Investors</span><strong>{toNum(form.investorCount)}</strong></div>
                <div><span>Land</span><strong>BDT {toNum(form.landPrice).toLocaleString()}</strong></div>
                <div><span>Materials</span><strong>BDT {toNum(form.materialCost).toLocaleString()}</strong></div>
                <div><span>Equipment</span><strong>BDT {toNum(form.equipmentCost).toLocaleString()}</strong></div>
                <div><span>Labor</span><strong>BDT {toNum(form.laborCost).toLocaleString()}</strong></div>
                <div><span>Permit</span><strong>BDT {toNum(form.permitCost).toLocaleString()}</strong></div>
                <div><span>Contingency</span><strong>{toNum(form.contingencyPercent)}%</strong></div>
              </div>
            </div>
          </div>

          {/* ── PROJECT LIST ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>Published Projects ({projects.length})</h2>
            </div>

            {loadingProjects && (
              <div className="card empty-state"><p className="text-muted">Loading projects…</p></div>
            )}

            {!loadingProjects && projects.length === 0 && (
              <div className="card empty-state">
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🏗️</div>
                <h3>No projects yet</h3>
                <p className="text-muted">Use the form above to publish your first real project.</p>
              </div>
            )}

            <div style={{ display: 'grid', gap: 14 }}>
              {projects.map(p => {
                const pe = progressEdit[p._id] || { status: p.status, progress: p.progressPercentage }
                return (
                  <div key={p._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: p.image ? '120px 1fr' : '1fr', gap: 0 }}>
                      {p.image && (
                        <img src={p.image} alt={p.name} style={{ width: 120, height: '100%', minHeight: 100, objectFit: 'cover' }} />
                      )}
                      <div style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                              <span className="badge">{p.status}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', fontWeight: 600 }}>{p.projectId}</span>
                            </div>
                            <h3 style={{ marginBottom: 4, fontSize: '1.1rem' }}>{p.name}</h3>
                            <p style={{ color: 'var(--medium-gray)', fontSize: '0.9rem' }}>{p.location} · {p.projectType} · BDT {(p.estimatedPrice || 0).toLocaleString()}</p>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <Link to={`/projects/${p._id}`} className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>View</Link>
                            <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }} onClick={() => startEdit(p)}>Edit</button>
                            <button
                              className="btn"
                              style={{ padding: '7px 14px', fontSize: '0.82rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
                              onClick={() => setConfirmDelete(p._id)}
                            >Delete</button>
                          </div>
                        </div>

                        {/* Status + Progress quick update */}
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                          <select
                            value={pe.status}
                            onChange={e => setProgressEdit(prev => ({ ...prev, [p._id]: { ...pe, status: e.target.value } }))}
                            style={{ padding: '6px 10px', fontSize: '0.85rem', flex: '0 0 auto' }}
                          >
                            <option>Upcoming</option>
                            <option>Ongoing</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                          </select>
                          <input
                            type="number" min="0" max="100"
                            value={pe.progress}
                            onChange={e => setProgressEdit(prev => ({ ...prev, [p._id]: { ...pe, progress: e.target.value } }))}
                            style={{ padding: '6px 10px', fontSize: '0.85rem', width: 90 }}
                            placeholder="Progress %"
                          />
                          <button
                            className="btn btn-primary"
                            style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                            onClick={() => handleStatusUpdate(p._id, pe.status, pe.progress)}
                          >Update Status</button>
                          <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)' }}>Current: {p.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ marginBottom: 8 }}>Delete This Project?</h3>
            <p className="text-muted" style={{ marginBottom: 24 }}>This will permanently remove the project and all its transactions. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn"
                style={{ background: '#991B1B', color: '#fff' }}
                onClick={() => handleDelete(confirmDelete)}
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
