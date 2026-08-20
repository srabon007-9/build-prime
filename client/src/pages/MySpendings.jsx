// ====================================================================
// 💰 MY FLAT & SPENDINGS PAGE (Customer Portal)
// ====================================================================
// Customers can track their flats, see payment progress, AND submit
// offline payment claims (bank transfer, cheque, bKash, cash) for admin verification!
// ====================================================================

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, apiFetch } from '../api'

function taka(amount) {
  return '৳' + Number(amount || 0).toLocaleString()
}

export default function MySpendings() {
  const navigate = useNavigate()
  const token = getToken()

  const [flats, setFlats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Payment Request Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedFlat, setSelectedFlat] = useState(null)
  const [payForm, setPayForm] = useState({ milestone: '1st Installment', amount: '', paymentMethod: 'Bank Transfer', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchFlats()
  }, [token])

  async function fetchFlats() {
    setLoading(true)
    const { ok, data } = await apiFetch('/customer/my-flats')
    if (ok) setFlats(data)
    else setError(data.message || 'Could not load your flats')
    setLoading(false)
  }

  function openPaymentModal(flat) {
    setSelectedFlat(flat)
    setSubmitMsg('')
    setShowPaymentModal(true)
  }

  async function handleSubmitPayment(e) {
    e.preventDefault()
    if (!payForm.amount || Number(payForm.amount) <= 0) {
      setSubmitMsg('Please enter a valid payment amount')
      return
    }
    setSubmitting(true)
    setSubmitMsg('')

    const targetFlat = selectedFlat || flats[0]
    const { ok, data } = await apiFetch('/customer/submit-payment', {
      method: 'POST',
      body: JSON.stringify({
        projectId: targetFlat.projectId,
        unitId: targetFlat.unitId,
        milestone: payForm.milestone,
        amount: payForm.amount,
        paymentMethod: payForm.paymentMethod,
        note: payForm.note
      })
    })

    setSubmitting(false)
    if (!ok) {
      setSubmitMsg(data.message || 'Could not submit payment request')
      return
    }

    setSubmitMsg('Payment request submitted! Admin will verify soon. ✓')
    setTimeout(() => {
      setShowPaymentModal(false)
      setSubmitMsg('')
      setPayForm({ milestone: '1st Installment', amount: '', paymentMethod: 'Bank Transfer', note: '' })
      fetchFlats()
    }, 1200)
  }

  // Aggregate totals across all flats
  const totalCommitted = flats.reduce((sum, f) => sum + f.priceBDT, 0)
  const totalPaid      = flats.reduce((sum, f) => sum + f.totalPaid, 0)
  const totalDue       = flats.reduce((sum, f) => sum + f.remaining, 0)
  const overallPct     = totalCommitted > 0 ? Math.round((totalPaid / totalCommitted) * 100) : 0

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Loading your flat portal...</div>

  return (
    <div>
      {/* Hero */}
      <section className="spendings-hero">
        <div className="container">
          <span className="label" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Customer Portal
          </span>
          <h1>My Flat & Spendings</h1>
          <p>Track your booked flats, view payment history, and submit payment verification requests.</p>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 0 }}>

        {/* 4 Summary Cards — pulls up into hero section seamlessly */}
        <div className="spending-summary-grid">
          {[
            { icon: '🏠', label: 'My Flats',        value: flats.length,      cls: '' },
            { icon: '💰', label: 'Total Committed',  value: taka(totalCommitted), cls: 'green' },
            { icon: '✅', label: 'Total Paid',        value: taka(totalPaid),   cls: 'gold' },
            { icon: '📊', label: 'Remaining Due',    value: taka(totalDue),    cls: 'red' },
          ].map(({ icon, label, value, cls }) => (
            <div className="spending-summary-card" key={label}>
              <div className="summary-icon">{icon}</div>
              <div className="summary-label">{label}</div>
              <div className={`summary-value ${cls}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Section Header & Action Button — neatly positioned below summary cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Financial Overview & Payment Portal</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              Track your installment progress or declare an offline payment for admin verification.
            </p>
          </div>
          {flats.length > 0 && (
            <button
              className="btn btn-primary"
              style={{ padding: '12px 22px', fontSize: '0.95rem', fontWeight: 700, boxShadow: 'var(--shadow)' }}
              onClick={() => openPaymentModal(flats[0])}
            >
              + Declare / Submit Payment Request
            </button>
          )}
        </div>

        {/* Overall progress bar */}
        {flats.length > 0 && (
          <div className="card" style={{ padding: '24px 28px', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 700 }}>Overall Payment Progress</span>
              <span style={{ fontWeight: 800, color: 'var(--green)' }}>{overallPct}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: 14, borderRadius: 7 }}>
              <div className="progress-bar-fill" style={{ width: `${overallPct}%`, borderRadius: 7 }} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p style={{ color: '#c62828', padding: 16, background: '#ffebee', borderRadius: 8 }}>{error}</p>}

        {/* Empty state */}
        {flats.length === 0 && !error && (
          <div className="card empty-state" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏗️</div>
            <h2>No Flats Assigned Yet</h2>
            <p className="text-muted" style={{ marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              You don't have any flats assigned yet. Browse our projects and contact BuildPrime to assign your flat.
            </p>
            <Link to="/projects" className="btn btn-primary">Browse Projects →</Link>
          </div>
        )}

        {/* One card per flat */}
        {flats.map(flat => (
          <div className="flat-detail-card" key={`${flat.projectId}-${flat.unitId}`}>

            {/* Flat header */}
            <div className="flat-detail-header">
              <div className="flat-detail-title">
                <div className="flat-icon">{flat.flatNumber}</div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Flat {flat.flatNumber}</h3>
                  <Link to={`/projects/${flat.projectId}`} style={{ fontSize: '0.88rem', color: 'var(--medium-gray)', fontWeight: 600 }}>
                    {flat.projectName} — {flat.projectLocation}
                  </Link>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge">{flat.unitStatus}</span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                  onClick={() => openPaymentModal(flat)}
                >
                  + Report Payment
                </button>
              </div>
            </div>

            {/* Flat specs */}
            <div className="flat-specs-row">
              <span className="spec">🛏️ <strong>{flat.beds}</strong> Bed</span>
              <span className="spec">🛁 <strong>{flat.baths}</strong> Bath</span>
              <span className="spec">🏞️ <strong>{flat.balconies}</strong> Balcony</span>
              <span className="spec">📐 <strong>{flat.areaSqFt.toLocaleString()}</strong> Sq.Ft</span>
              <span className="spec">🧭 <strong>{flat.facing}</strong></span>
              <span className="spec">🏷️ <strong>{flat.type}</strong></span>
            </div>

            {/* Payment progress */}
            <div className="payment-progress">
              <div className="progress-info">
                <span className="paid">Verified Paid: {taka(flat.totalPaid)}</span>
                <span className="remaining">Due: {taka(flat.remaining)} of {taka(flat.priceBDT)}</span>
              </div>
              <div className="progress-bar-container" style={{ height: 12, borderRadius: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${flat.progressPercent}%`, borderRadius: 6 }} />
              </div>
              <div style={{ textAlign: 'right', marginTop: 4, fontSize: '0.82rem', fontWeight: 700, color: 'var(--green)' }}>
                {flat.progressPercent}% Verified Complete
              </div>
            </div>

            {/* Payment history table */}
            {flat.payments.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Milestone</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Note / Ref</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...flat.payments]
                      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                      .map((p, i) => {
                        const isVerified = p.status === 'Verified' || (p.verifiedByAdmin && p.status !== 'Rejected')
                        const isRejected = p.status === 'Rejected'
                        return (
                          <tr key={p._id || i}>
                            <td style={{ fontWeight: 600 }}>{p.milestone}</td>
                            <td className="amount-cell">{taka(p.amount)}</td>
                            <td>{new Date(p.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td>{p.paymentMethod}</td>
                            <td style={{ color: 'var(--medium-gray)' }}>{p.note || '—'}</td>
                            <td>
                              {isVerified ? (
                                <span className="verified-badge">✓ Verified</span>
                              ) : isRejected ? (
                                <span style={{ fontSize: '0.78rem', color: '#991B1B', background: '#FEE2E2', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                                  ✕ Rejected
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                                  ⏳ Pending Verification
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                No payment records yet. Click "+ Report Payment" above to declare an installment payment.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Customer Payment Request Modal */}
      {showPaymentModal && (
        <div className="booking-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="label">Submit Payment Declaration</span>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            <h2>Declare Payment for Flat {selectedFlat ? selectedFlat.flatNumber : ''}</h2>
            <p className="text-muted" style={{ marginBottom: 20 }}>
              Submit your offline payment details (Bank Transfer, Cheque, bKash, etc.) for admin verification.
            </p>

            <form onSubmit={handleSubmitPayment}>
              {flats.length > 1 && (
                <div className="form-group">
                  <label>Select Flat</label>
                  <select
                    value={selectedFlat ? selectedFlat.unitId : ''}
                    onChange={e => setSelectedFlat(flats.find(f => f.unitId === e.target.value))}
                  >
                    {flats.map(f => (
                      <option key={f.unitId} value={f.unitId}>
                        Flat {f.flatNumber} — {f.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Payment Milestone</label>
                <select value={payForm.milestone} onChange={e => setPayForm(p => ({ ...p, milestone: e.target.value }))} required>
                  <option>Booking Money</option>
                  <option>Down Payment</option>
                  <option>1st Installment</option>
                  <option>2nd Installment</option>
                  <option>3rd Installment</option>
                  <option>4th Installment</option>
                  <option>5th Installment</option>
                  <option>Final Payment</option>
                  <option>Other / Utility</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label>Paid Amount (BDT)</label>
                  <input
                    type="number"
                    min="1"
                    value={payForm.amount}
                    onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="e.g. 500000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={payForm.paymentMethod} onChange={e => setPayForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Bank Cheque No / TxID / Note</label>
                <input
                  value={payForm.note}
                  onChange={e => setPayForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="e.g. Sonali Bank Cheque #982134 or bKash TxID 8X92K"
                />
              </div>

              {submitMsg && (
                <p style={{ textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, color: submitMsg.includes('submitted') ? 'var(--green)' : '#c62828', marginBottom: 12 }}>
                  {submitMsg}
                </p>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit for Verification ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
