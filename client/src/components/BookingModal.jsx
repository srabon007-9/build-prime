// ====================================================================
// 📋 BOOKING MODAL — Admin assigns a flat to a customer
// ====================================================================
// Admin enters customer email and negotiated Booking Money amount.
// Money is NOT hardcoded to 10% — admin can set any agreed amount!
// ====================================================================

import React, { useState } from 'react'

export default function BookingModal({ unit, project, onClose, onConfirm }) {
  const [email, setEmail] = useState('')
  const defaultFee = Math.round(unit.priceBDT * (project.bookingFeePercent || 10) / 100)
  const [bookingAmount, setBookingAmount] = useState(defaultFee)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const numericAmount = Number(bookingAmount) || 0
  const remaining = Math.max(0, unit.priceBDT - numericAmount)

  async function handleConfirm() {
    if (!email.trim()) { setError('Please enter the customer email'); return }
    if (numericAmount < 0) { setError('Booking money cannot be negative'); return }
    setSubmitting(true)
    setError('')
    try {
      await onConfirm(unit._id, email.trim(), numericAmount)
    } catch (err) {
      setError(err.message || 'Could not assign flat')
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="label">Assign Flat & Set Booking Money</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
        </div>
        <h2>Flat {unit.flatNumber} — Floor {unit.floor}</h2>

        {/* Flat specs */}
        <div className="flat-specs-grid">
          {[
            { label: 'Area', value: `${unit.areaSqFt.toLocaleString()} Sq.Ft` },
            { label: 'Type', value: unit.type },
            { label: 'Rooms', value: `${unit.beds} Bed / ${unit.baths} Bath` },
            { label: 'Facing', value: unit.facing },
          ].map(({ label, value }) => (
            <div className="spec-item" key={label}>
              <div className="spec-label">{label}</div>
              <div className="spec-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Total Flat Price */}
        <div className="price-summary" style={{ marginBottom: 16 }}>
          <div className="price-row" style={{ fontSize: '1.05rem' }}>
            <span>Total Agreed Flat Price</span>
            <strong>৳{unit.priceBDT.toLocaleString()}</strong>
          </div>
        </div>

        {/* Negotiated Booking Money Input */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 6, display: 'block' }}>
            Agreed Booking Money (BDT) — Negotiable
          </label>
          <input
            type="number"
            min="0"
            value={bookingAmount}
            onChange={e => setBookingAmount(e.target.value)}
            placeholder="e.g. 500000"
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 'bold', padding: '10px 14px' }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', marginTop: 4 }}>
            Discuss and enter the negotiated booking deposit with the buyer. Default is recommended ~{project.bookingFeePercent || 10}%.
          </p>
        </div>

        {/* Remaining calculation */}
        <div style={{ background: 'var(--light-gray)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 600 }}>
            <span>Balance Due After Booking:</span>
            <strong style={{ color: 'var(--black)' }}>৳{remaining.toLocaleString()}</strong>
          </div>
        </div>

        {/* Customer email */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>
            Buyer Customer Email (registered)
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="buyer@gmail.com"
            style={{ width: '100%' }}
          />
        </div>

        {error && <p style={{ color: '#c62828', fontSize: '0.88rem', marginBottom: 12, fontWeight: 600 }}>{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Assigning…' : `Confirm Flat Sale & Record ৳${numericAmount.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
