// ====================================================================
// 🧱 MATERIALS & EQUIPMENT PAGE (Showcase.jsx)
// ====================================================================
// To add or edit construction materials or machines, update the ITEMS array below.
// ====================================================================

import React, { useState } from 'react'

const ITEMS = [
  { name: 'Cement', type: 'Material', price: 'BDT 550 / bag', use: 'Foundation, columns, roof slab, structural mortar', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Steel Rod (500W)', type: 'Material', price: 'BDT 95 / kg', use: 'Beam, column, and foundation rebar reinforcement', image: '/steel-rod.jpg' },
  { name: 'Bricks (1st Class)', type: 'Material', price: 'BDT 12 / piece', use: 'Exterior wall construction and interior partitions', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Concrete Mixer', type: 'Equipment', price: 'BDT 4,500 / day', use: 'On-site concrete batch mixing and pouring', image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Tower Crane', type: 'Equipment', price: 'BDT 35,000 / day', use: 'Lifting heavy materials in multi-story high-rise sites', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Hydraulic Excavator', type: 'Equipment', price: 'BDT 18,000 / day', use: 'Deep soil excavation, earthwork, and piling prep', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop' }
]

export default function Showcase() {
  const [type, setType] = useState('All')
  const filteredItems = type === 'All' ? ITEMS : ITEMS.filter(item => item.type === type)

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Materials &amp; Equipment</span>
          <h1>Construction Resources</h1>
          <p>Explore standard structural materials and heavy machinery deployed across BuildPrime sites.</p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section">
        <div className="container">
          {/* Category Filter Tabs */}
          <div className="filter-row">
            {['All', 'Material', 'Equipment'].map(option => (
              <button
                key={option}
                onClick={() => setType(option)}
                className={type === option ? 'filter-btn active' : 'filter-btn'}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid-3">
            {filteredItems.map(item => (
              <div className="card item-card" key={item.name}>
                <img src={item.image} alt={item.name} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge">{item.type}</span>
                  <strong style={{ color: 'var(--green)', fontSize: '0.95rem' }}>{item.price}</strong>
                </div>
                <h3>{item.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.92rem' }}>{item.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
