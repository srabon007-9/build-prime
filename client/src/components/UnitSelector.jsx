import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// Default realistic sample units for projects
function generateDefaultUnits(project) {
  const baseArea = 1650
  return [
    { id: '101', name: 'Unit 1A (1st Floor)', type: '3 Bed Family Unit', area: baseArea, beds: 3, baths: 3, balconies: 2, facing: 'South-East', status: 'Available', pricePerSqFt: 8500 },
    { id: '201', name: 'Unit 2A (2nd Floor)', type: '3 Bed Luxury Unit', area: baseArea + 100, beds: 3, baths: 3, balconies: 2, facing: 'South Facing', status: 'Booked', pricePerSqFt: 8800 },
    { id: '301', name: 'Unit 3A (3rd Floor)', type: '3 Bed Deluxe Unit', area: baseArea + 150, beds: 3, baths: 4, balconies: 3, facing: 'South-West', status: 'Available', pricePerSqFt: 9200 },
    { id: '401', name: 'Unit 4A (4th Floor)', type: '4 Bed Executive', area: baseArea + 400, beds: 4, baths: 4, balconies: 3, facing: 'South Facing', status: 'Available', pricePerSqFt: 9800 },
    { id: '501', name: 'Unit 5A (5th Floor)', type: '4 Bed Executive', area: baseArea + 400, beds: 4, baths: 4, balconies: 3, facing: 'Corner Plot', status: 'Sold', pricePerSqFt: 10200 },
    { id: '601', name: 'Penthouse 6A (Top Floor)', type: 'Duplex Penthouse', area: baseArea + 900, beds: 5, baths: 5, balconies: 4, facing: '360° Open View', status: 'Available', pricePerSqFt: 11500 },
  ]
}

export default function UnitSelector({ project }) {
  const [filter, setFilter] = useState('All')
  const units = (project && project.units && project.units.length > 0)
    ? project.units
    : generateDefaultUnits(project)

  const filteredUnits = filter === 'All'
    ? units
    : units.filter(u => u.status === filter)

  const availableCount = units.filter(u => u.status === 'Available').length
  const bookedCount = units.filter(u => u.status === 'Booked').length
  const soldCount = units.filter(u => u.status === 'Sold').length

  return (
    <div className="card cost-breakdown-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <span className="label">Interactive Layouts</span>
          <h2>Floor Plans &amp; Unit Availability Selector</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Select an available unit below to inspect floor specs or schedule a site visit.
          </p>
        </div>

        {/* Availability Summary Counter */}
        <div className="unit-summary-pills">
          <span className="summary-pill available">● {availableCount} Available</span>
          <span className="summary-pill booked">● {bookedCount} Booked</span>
          <span className="summary-pill sold">● {soldCount} Sold</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-row" style={{ marginBottom: '24px' }}>
        {['All', 'Available', 'Booked', 'Sold'].map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={filter === option ? 'filter-btn active' : 'filter-btn'}
          >
            {option} {option === 'All' ? `(${units.length})` : ''}
          </button>
        ))}
      </div>

      {/* Unit Cards Grid */}
      <div className="grid-3" style={{ gap: '20px' }}>
        {filteredUnits.map(unit => {
          const totalPrice = unit.totalPrice || (unit.area * unit.pricePerSqFt)
          const badgeClass = unit.status ? unit.status.toLowerCase() : 'available'

          return (
            <div className={`card unit-card ${badgeClass}`} key={unit.id || unit.name}>
              {/* Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className={`badge ${badgeClass}`}>{unit.status}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', fontWeight: 600 }}>{unit.type}</span>
              </div>

              {/* Unit Title & Area */}
              <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{unit.name}</h3>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--green)', marginBottom: '14px' }}>
                {unit.area.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--medium-gray)' }}>Sq. Ft.</span>
              </div>

              {/* Key Features List */}
              <div className="unit-specs-list">
                <div>🛏️ {unit.beds} Bedrooms</div>
                <div>🛁 {unit.baths} Bathrooms</div>
                <div>🏞️ {unit.balconies} Balconies</div>
                <div>🧭 {unit.facing}</div>
              </div>

              {/* Price & Action */}
              <div className="unit-card-footer">
                <div>
                  <span className="price-label">Estimated Price</span>
                  <strong className="price-amount" style={{ fontSize: '1.05rem' }}>
                    ৳{(totalPrice / 100000).toFixed(1)} Lakh
                  </strong>
                </div>

                {unit.status === 'Available' ? (
                  <Link
                    to={`/quote?project=${encodeURIComponent(project.name)}&unit=${encodeURIComponent(unit.name)}`}
                    className="btn btn-primary btn-sm"
                  >
                    Book Visit →
                  </Link>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    {unit.status}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
