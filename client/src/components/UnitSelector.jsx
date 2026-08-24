// ====================================================================
// 🏢 UNIT SELECTOR — Interactive Building Elevation Grid
// ====================================================================
// Shows all flats in a building, floor by floor.
// Admins can: assign a flat, set custom booking money, record payments,
// verify/reject customer payment requests, change unit status.
// Regular users: view-only (green = available, orange = booked, red = sold)
// ====================================================================

import React, { useState } from 'react'
import { getUser, apiFetch } from '../api'
import BookingModal from './BookingModal'

export default function UnitSelector({ project, onProjectUpdate }) {
  const [filter, setFilter] = useState('All')
  const [selectedUnit, setSelectedUnit] = useState(null)    // unit to assign
  const [paymentUnit, setPaymentUnit] = useState(null)      // unit to record payment for
  const [paymentForm, setPaymentForm] = useState({ milestone: '', amount: '', paymentMethod: 'Bank Transfer', note: '' })
  const [msg, setMsg] = useState('')

  const isAdmin = getUser().role === 'admin'
  const units = project.units || []
  const customerPayments = project.customerPayments || []
  const pendingPayments = customerPayments.filter(p => p.status === 'Pending' || p.verifiedByAdmin === false)

  // Group units by floor, highest floor first
  const byFloor = {}
  units.forEach(u => {
    if (!byFloor[u.floor]) byFloor[u.floor] = []
    byFloor[u.floor].push(u)
  })
  const floors = Object.keys(byFloor).map(Number).sort((a, b) => b - a)

  // Filter units if a filter tab is selected
  const filteredFloors = floors.map(floor => ({
    floor,
    units: filter === 'All' ? byFloor[floor] : byFloor[floor].filter(u => u.status === filter)
  })).filter(f => f.units.length > 0)

  const counts = {
    available: units.filter(u => u.status === 'Available').length,
    booked: units.filter(u => u.status === 'Booked').length,
    sold: units.filter(u => u.status === 'Sold').length,
  }

  // ── API calls ──────────────────────────────────────────────────────

  async function assignFlat(unitId, customerEmail, bookingAmount) {
    const { ok, data } = await apiFetch(`/projects/${project._id}/book-unit`, {
      method: 'POST',
      body: JSON.stringify({ unitId, customerEmail, bookingAmount })
    })
    if (!ok) throw new Error(data.message || 'Could not assign flat')
    setSelectedUnit(null)
    onProjectUpdate && onProjectUpdate(data)
  }

  async function changeStatus(unitId, status) {
    const { ok, data } = await apiFetch(`/projects/${project._id}/units/${unitId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    if (ok) onProjectUpdate && onProjectUpdate(data)
  }

  async function recordPayment(e) {
    e.preventDefault()
    setMsg('Saving...')
    const { ok, data } = await apiFetch(`/projects/${project._id}/record-flat-payment`, {
      method: 'POST',
      body: JSON.stringify({ unitId: paymentUnit._id, ...paymentForm })
    })
    if (!ok) { setMsg(data.message || 'Error saving'); return }
    setMsg('Saved ✓')
    setPaymentForm({ milestone: '', amount: '', paymentMethod: 'Bank Transfer', note: '' })
    onProjectUpdate && onProjectUpdate(data)
    setTimeout(() => { setPaymentUnit(null); setMsg('') }, 1000)
  }

  async function handleVerifyPayment(paymentId, action) {
    const { ok, data } = await apiFetch(`/projects/${project._id}/payments/${paymentId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    })
    if (ok) onProjectUpdate && onProjectUpdate(data)
  }

  if (units.length === 0) {
    return (
      <div className="card cost-breakdown-card">
        <span className="label">Building Layout</span>
        <h2>No Flats Configured</h2>
        <p className="text-muted">
          {isAdmin ? 'Re-create this project with building configuration to auto-generate flats.' : 'Contact admin for details.'}
        </p>
      </div>
    )
  }

  return (
    <div className="card cost-breakdown-card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <span className="label">Interactive Building Layout</span>
          <h2>Floor Plans & Flat Availability</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            {isAdmin ? 'Click an available flat to assign it to a customer.' : 'Green = Available · Orange = Booked · Red = Sold'}
          </p>
        </div>
        <div className="unit-summary-pills">
          <span className="summary-pill available">● {counts.available} Available</span>
          <span className="summary-pill booked">● {counts.booked} Booked</span>
          <span className="summary-pill sold">● {counts.sold} Sold</span>
        </div>
      </div>

      {/* Admin Verification Notice for Pending Customer Payments */}
      {isAdmin && pendingPayments.length > 0 && (
        <div style={{ background: 'var(--gold-light)', border: '1px solid var(--gold)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>⏳</span>
            <strong style={{ color: 'var(--black)', fontSize: '1.05rem' }}>
              {pendingPayments.length} Pending Payment Request{pendingPayments.length > 1 ? 's' : ''} Awaiting Admin Verification
            </strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingPayments.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--white)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div>
                  <strong>Flat {p.flatNumber}</strong> — {p.customerName} ({p.milestone}): <strong style={{ color: 'var(--green)' }}>৳{p.amount.toLocaleString()}</strong> via {p.paymentMethod}
                  {p.note && <span style={{ color: 'var(--medium-gray)', fontSize: '0.85rem', display: 'block' }}>Note: {p.note}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleVerifyPayment(p._id, 'verify')}>
                    ✓ Verify & Approve
                  </button>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }} onClick={() => handleVerifyPayment(p._id, 'reject')}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        {['All', 'Available', 'Booked', 'Sold'].map(opt => (
          <button key={opt} onClick={() => setFilter(opt)} className={filter === opt ? 'filter-btn active' : 'filter-btn'}>
            {opt} {opt === 'All' ? `(${units.length})` : ''}
          </button>
        ))}
      </div>

      {/* Building Grid — floors stacked top to bottom */}
      <div className="building-grid-wrapper">
        <div className="building-grid">
          {filteredFloors.map(({ floor, units: floorUnits }) => (
            <div
              key={floor}
              className="floor-row"
              style={{ gridTemplateColumns: `60px repeat(${project.flatsPerFloor || 3}, 1fr)` }}
            >
              <div className="floor-label">Floor {floor}</div>

              {floorUnits.map(unit => {
                const cls = unit.status.toLowerCase()  // 'available' | 'booked' | 'sold'

                return (
                  <div
                    key={unit._id}
                    className={`flat-cell ${cls}`}
                    onClick={() => isAdmin && unit.status === 'Available' && setSelectedUnit(unit)}
                  >
                    <span className="flat-status-dot" />
                    <span className="flat-number">{unit.flatNumber}</span>
                    <span className="flat-area">{unit.areaSqFt} sqft</span>
                    <span className="flat-price">৳{(unit.priceBDT / 100000).toFixed(1)}L</span>

                    {/* Hover tooltip */}
                    <div className="flat-hover-info">
                      <strong>{unit.flatNumber}</strong> · {unit.type}<br />
                      {unit.beds} Bed · {unit.baths} Bath · {unit.facing}<br />
                      {unit.areaSqFt} sqft<br />
                      <strong>৳{unit.priceBDT.toLocaleString()}</strong><br />
                      Status: {unit.status}
                    </div>

                    {/* Admin quick-action buttons on non-available flats */}
                    {isAdmin && unit.status !== 'Available' && (
                      <div className="admin-flat-actions" onClick={e => e.stopPropagation()}>
                        {unit.status === 'Booked' && (
                          <button className="btn btn-primary" onClick={() => changeStatus(unit._id, 'Sold')}>Mark Sold</button>
                        )}
                        <button className="btn btn-secondary" onClick={() => setPaymentUnit(unit)}>💰 Payment</button>
                        <button className="btn btn-secondary" onClick={() => changeStatus(unit._id, 'Available')}>Reset</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          <div className="building-ground">▬▬▬ Ground Level ▬▬▬</div>
        </div>
      </div>

      {/* Assign Flat Modal */}
      {selectedUnit && (
        <BookingModal
          unit={selectedUnit}
          project={project}
          onClose={() => setSelectedUnit(null)}
          onConfirm={assignFlat}
        />
      )}

      {/* Record Payment & Payment History Modal */}
      {paymentUnit && (() => {
        const unitPayments = (project.customerPayments || []).filter(
          p => (p.unitId && p.unitId.toString() === paymentUnit._id.toString()) || p.flatNumber === paymentUnit.flatNumber
        )
        const verifiedPayments = unitPayments.filter(p => p.verifiedByAdmin === true && p.status !== 'Rejected')
        const totalPaid = verifiedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        const remainingDue = Math.max(0, (paymentUnit.priceBDT || 0) - totalPaid)
        const progressPercent = paymentUnit.priceBDT > 0 ? Math.round((totalPaid / paymentUnit.priceBDT) * 100) : 0
        const customerName = unitPayments[0]?.customerName || (paymentUnit.bookedBy?.name ? paymentUnit.bookedBy.name : 'Assigned Customer')

        return (
          <div className="booking-modal-overlay" onClick={() => setPaymentUnit(null)}>
            <div className="booking-modal" style={{ maxWidth: '660px', width: '100%' }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <span className="label" style={{ marginBottom: 4 }}>FLAT PAYMENT & HISTORY</span>
                  <h2 style={{ fontSize: '1.4rem', margin: '4px 0 2px' }}>Flat {paymentUnit.flatNumber}</h2>
                  <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0 }}>
                    {paymentUnit.type} · {paymentUnit.areaSqFt} sqft · Customer: <strong>{customerName}</strong>
                  </p>
                </div>
                <button 
                  onClick={() => setPaymentUnit(null)} 
                  style={{ background: 'var(--light-gray)', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>

              {/* Financial Progress & Overview Card */}
              <div style={{ background: 'var(--light-gray)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20, border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Price</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--black)' }}>৳{(paymentUnit.priceBDT || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified Paid</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--green)' }}>৳{totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining Due</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: remainingDue > 0 ? '#c62828' : 'var(--green)' }}>
                      ৳{remainingDue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="progress-bar-container" style={{ height: 8, borderRadius: 4, background: '#e2e8f0' }}>
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, borderRadius: 4, background: 'var(--green)' }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>
                  {progressPercent}% Paid
                </div>
              </div>

              {/* Payment History Section */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                    📜 Payment History ({unitPayments.length})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)' }}>
                    {verifiedPayments.length} verified
                  </span>
                </div>

                {unitPayments.length > 0 ? (
                  <div style={{ maxHeight: '190px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <table className="payment-table" style={{ fontSize: '0.82rem', margin: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 12px' }}>Milestone</th>
                          <th style={{ padding: '8px 12px' }}>Amount</th>
                          <th style={{ padding: '8px 12px' }}>Date</th>
                          <th style={{ padding: '8px 12px' }}>Method</th>
                          <th style={{ padding: '8px 12px' }}>Status</th>
                          <th style={{ padding: '8px 12px' }}>Note / Ref</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...unitPayments]
                          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                          .map((p, idx) => {
                            const isVerified = p.status === 'Verified' || (p.verifiedByAdmin && p.status !== 'Rejected')
                            const isRejected = p.status === 'Rejected'

                            return (
                              <tr key={p._id || idx}>
                                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.milestone}</td>
                                <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--green)' }}>
                                  ৳{(p.amount || 0).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                                  {new Date(p.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '8px 12px' }}>{p.paymentMethod || 'Offline'}</td>
                                <td style={{ padding: '8px 12px' }}>
                                  {isVerified ? (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--green)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                                      ✓ Verified
                                    </span>
                                  ) : isRejected ? (
                                    <span style={{ fontSize: '0.72rem', color: '#991B1B', background: '#FEE2E2', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                                      ✕ Rejected
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.72rem', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                                      ⏳ Pending
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: '8px 12px', color: 'var(--medium-gray)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.note || '—'}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ background: 'var(--light-gray)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--medium-gray)', fontSize: '0.88rem' }}>
                    No payment history recorded for Flat {paymentUnit.flatNumber} yet.
                  </div>
                )}
              </div>

              {/* Record New Payment Form */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 12, fontWeight: 700 }}>
                  + Record New Offline Payment
                </h3>

                <form onSubmit={recordPayment}>
                  <div className="form-group">
                    <label>Payment Milestone</label>
                    <select value={paymentForm.milestone} onChange={e => setPaymentForm(p => ({ ...p, milestone: e.target.value }))} required>
                      <option value="">Select milestone</option>
                      {['Booking Money', 'Down Payment', '1st Installment', '2nd Installment', '3rd Installment', '4th Installment', '5th Installment', 'Final Payment', 'Registration Fee', 'Utility Charges', 'Other']
                        .map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div className="form-group">
                      <label>Amount (BDT)</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={paymentForm.amount} 
                        onChange={e => setPaymentForm(p => ({ ...p, amount: e.target.value }))} 
                        placeholder={remainingDue > 0 ? `Remaining: ${remainingDue}` : "e.g. 500000"} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Method</label>
                      <select value={paymentForm.paymentMethod} onChange={e => setPaymentForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                        {['Bank Transfer', 'Cash', 'Cheque', 'bKash', 'Nagad', 'Other'].map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Note / Transaction Ref (optional)</label>
                    <input value={paymentForm.note} onChange={e => setPaymentForm(p => ({ ...p, note: e.target.value }))} placeholder="e.g. Received via Sonali Bank cheque #12345" />
                  </div>
                  <div className="modal-actions" style={{ marginTop: 16 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setPaymentUnit(null)}>Close</button>
                    <button type="submit" className="btn btn-primary">Record Payment ✓</button>
                  </div>
                  {msg && <p className="form-status" style={{ marginTop: 10, textAlign: 'center' }}>{msg}</p>}
                </form>
              </div>

            </div>
          </div>
        )
      })()}
    </div>
  )
}
