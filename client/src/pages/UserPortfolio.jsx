// ====================================================================
// 👤 USER / CUSTOMER PORTFOLIO PAGE (UserPortfolio.jsx)
// ====================================================================
// Complete customer portfolio hub showing:
// 1. Personal Profile & Identification (Editable: Phone, Address, NID)
// 2. Owned Property & Flat Portfolio (Building, Flat #, Financial Summary)
// 3. Saved Construction Cost Estimates
// 4. Submitted Quote Consultation Requests
// ====================================================================

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, apiFetch } from '../api'

function taka(amount) {
  return '৳' + Number(amount || 0).toLocaleString()
}

export default function UserPortfolio() {
  const navigate = useNavigate()
  const token = getToken()

  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit Profile Modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', nidPassport: '' })
  const [editMsg, setEditMsg] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchPortfolio()
  }, [token])

  async function fetchPortfolio() {
    setLoading(true)
    const { ok, status, data } = await apiFetch('/customer/portfolio')
    if (!ok) {
      if (status === 401 || (data.message && data.message.includes('not found'))) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return
      }
      setError(data.message || 'Could not load your user portfolio')
      setLoading(false)
      return
    }
    setPortfolio(data)
    if (data.profile) {
      setEditForm({
        name: data.profile.name || '',
        phone: data.profile.phone || '',
        address: data.profile.address || '',
        nidPassport: data.profile.nidPassport || ''
      })
    }
    setLoading(false)
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setUpdating(true)
    setEditMsg('')

    const { ok, data } = await apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(editForm)
    })

    setUpdating(false)
    if (!ok) {
      setEditMsg(data.message || 'Could not update profile')
      return
    }

    setEditMsg('Profile updated successfully! ✓')
    setTimeout(() => {
      setShowEditModal(false)
      setEditMsg('')
      fetchPortfolio()
    }, 1000)
  }

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', color: 'var(--medium-gray)' }}>
        Loading your customer portfolio...
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="container section">
        <div className="card empty-state" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
          <h3>Portfolio Error</h3>
          <p className="text-muted">{error || 'Could not load user portfolio'}</p>
        </div>
      </div>
    )
  }

  const { profile, summary, flats, estimates, quotes } = portfolio

  return (
    <div>
      {/* Hero */}
      <section className="spendings-hero">
        <div className="container">
          <span className="label" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Customer Account
          </span>
          <h1>User Portfolio & Profile</h1>
          <p>Manage your customer information, owned properties, saved estimates, and consultation records.</p>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 0 }}>

        {/* Top Summary Metric Cards */}
        <div className="spending-summary-grid">
          <div className="spending-summary-card">
            <div className="summary-icon">👤</div>
            <div className="summary-label">Account Status</div>
            <div className="summary-value" style={{ textTransform: 'capitalize' }}>{profile.role}</div>
          </div>
          <div className="spending-summary-card">
            <div className="summary-icon">🏠</div>
            <div className="summary-label">Owned Flats</div>
            <div className="summary-value green">{summary.totalFlats}</div>
          </div>
          <div className="spending-summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-label">Total Investment</div>
            <div className="summary-value gold">{taka(summary.totalCommitted)}</div>
          </div>
          <div className="spending-summary-card">
            <div className="summary-icon">📐</div>
            <div className="summary-label">Saved Estimates</div>
            <div className="summary-value">{summary.totalEstimates}</div>
          </div>
        </div>

        {/* Main Grid: Customer Personal Info & Quick Actions */}
        <div className="grid-2" style={{ alignItems: 'start', marginBottom: 32 }}>

          {/* Personal Information Card */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span className="label" style={{ marginBottom: 4 }}>Customer Profile</span>
                <h2 style={{ fontSize: '1.3rem' }}>Personal Information</h2>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.85rem' }}
                onClick={() => setShowEditModal(true)}
              >
                ✏️ Edit Info
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile.name}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{profile.email}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{profile.phone || 'Not provided'}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Present Address</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.address || 'Not provided'}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NID / Passport No.</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{profile.nidPassport || 'Not provided'}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--medium-gray)' }}>
                  {new Date(profile.memberSince).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Portfolio Stats & Actions */}
          <div className="card" style={{ padding: 28, backgroundColor: 'var(--light-gray)', border: 'none' }}>
            <span className="label" style={{ marginBottom: 16 }}>Financial Overview</span>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 20 }}>Investment Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--medium-gray)' }}>Total Property Price</span>
                <strong>{taka(summary.totalCommitted)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--medium-gray)' }}>Total Paid (Verified)</span>
                <strong style={{ color: 'var(--green)' }}>{taka(summary.totalPaid)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--medium-gray)' }}>Balance Outstanding</span>
                <strong style={{ color: '#c62828' }}>{taka(summary.totalDue)}</strong>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>
                <span>Overall Payment Progress</span>
                <span>{summary.overallProgress}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: 12, borderRadius: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${summary.overallProgress}%`, borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {summary.totalFlats > 0 && (
                <Link to="/my-spendings" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                  🏠 My Flat & Spendings →
                </Link>
              )}
              <Link to="/cost-estimator" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                📐 Cost Calculator →
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Property & Flat Portfolio */}
        <div className="card cost-breakdown-card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span className="label">Flats & Real Estate Portfolio</span>
              <h2>My Booked Properties ({flats.length})</h2>
            </div>
            {flats.length > 0 && (
              <Link to="/my-spendings" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                View Spendings Tracker →
              </Link>
            )}
          </div>

          {flats.length > 0 ? (
            <div style={{ display: 'grid', gap: 16 }}>
              {flats.map(flat => (
                <div
                  key={`${flat.projectId}-${flat.flatNumber}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius)', flexWrap: 'wrap', gap: 16 }}
                >
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      {flat.flatNumber}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Flat {flat.flatNumber} — {flat.projectName}</h3>
                      <p style={{ color: 'var(--medium-gray)', fontSize: '0.88rem' }}>
                        📍 {flat.location} · {flat.beds} Bed / {flat.baths} Bath · {flat.areaSqFt} Sq.Ft
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--green)' }}>{taka(flat.priceBDT)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)' }}>
                      Paid: {taka(flat.totalPaid)} ({flat.progress}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card empty-state" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏗️</div>
              <p className="text-muted">No flats currently assigned to your portfolio. Contact BuildPrime to book a flat.</p>
            </div>
          )}
        </div>

        {/* Section 3: Saved Cost Estimations */}
        <div className="card cost-breakdown-card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span className="label">Calculations</span>
              <h2>Saved Cost Estimates ({estimates.length})</h2>
            </div>
            <Link to="/cost-estimator" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              + New Estimate
            </Link>
          </div>

          {estimates.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {estimates.map(est => (
                <div key={est._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <strong style={{ fontSize: '1rem' }}>{est.plotArea.toLocaleString()} Sq.Ft · {est.floors} Floor{est.floors > 1 ? 's' : ''}</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--medium-gray)' }}>
                      Quality: {est.qualityGrade} · Interior: {est.interiorType} · Created: {new Date(est.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--green)' }}>
                    ৳{(est.estimatedCost / 100000).toFixed(1)} Lakh
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted" style={{ padding: 16 }}>No saved estimates yet. Use the Cost Calculator to save your building estimates.</p>
          )}
        </div>

        {/* Section 4: Submitted Quote Consultation Requests */}
        <div className="card cost-breakdown-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span className="label">Consultations</span>
              <h2>Quote Requests ({quotes.length})</h2>
            </div>
            <Link to="/quote" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              + Request Quote
            </Link>
          </div>

          {quotes.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {quotes.map(q => (
                <div key={q._id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>{q.serviceType || 'Construction Quote'}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)' }}>{new Date(q.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--medium-gray)' }}>{q.projectDetails || q.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted" style={{ padding: 16 }}>No consultation quote requests submitted yet.</p>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="booking-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="label">Update Customer Information</span>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            <h2 style={{ marginBottom: 20 }}>Edit Profile Details</h2>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+880 1711-XXXXXX"
                  />
                </div>
                <div className="form-group">
                  <label>NID / Passport No.</label>
                  <input
                    value={editForm.nidPassport}
                    onChange={e => setEditForm(p => ({ ...p, nidPassport: e.target.value }))}
                    placeholder="19920192XXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Present Address</label>
                <textarea
                  rows="2"
                  value={editForm.address}
                  onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="House #, Road #, Area, City"
                />
              </div>

              {editMsg && (
                <p style={{ textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, color: editMsg.includes('success') ? 'var(--green)' : '#c62828', marginBottom: 12 }}>
                  {editMsg}
                </p>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)} disabled={updating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving…' : 'Save Profile ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
