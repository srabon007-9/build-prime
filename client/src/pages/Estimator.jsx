import React, { useState } from 'react'
import { API_URL } from '../api'
import { useToast } from '../components/Toast'

const LOCATIONS = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara', 'Purbachal', 'Mirpur', 'Khilgaon', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna']
const FLOORS = ['1', '2', '3', '4', '5+']

export default function Estimator() {
  const [buildingType, setBuildingType] = useState('Residential')
  const [area, setArea] = useState(2000)
  const [floors, setFloors] = useState('1')
  const [location, setLocation] = useState('Dhanmondi')
  const [materialQuality, setMaterialQuality] = useState('Standard')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [areaError, setAreaError] = useState('')
  const toast = useToast()

  function validateArea(val) {
    if (!val || Number(val) <= 0) { setAreaError('Area must be a positive number'); return false }
    if (Number(val) > 1000000) { setAreaError('Area seems too large. Please check the value.'); return false }
    setAreaError('')
    return true
  }

  async function handleCalc(save = false) {
    if (!validateArea(area)) return

    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/estimates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ buildingType, area, floors, location, materialQuality, save })
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.message || 'Could not generate estimate', 'error')
        return
      }
      setResult(data)
      if (save) toast('Estimate saved to your records!', 'success')
    } catch {
      toast('Network error — check your connection', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Cost Planning &amp; Budgeting</span>
          <h1>Construction Cost Calculator</h1>
          <p>Generate preliminary budget forecasts based on real-time Bangladesh market adjustment factors.</p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container section">
        <div className="grid-2" style={{ alignItems: 'start' }}>

          {/* Left: Input Parameters */}
          <div className="card">
            <span className="label" style={{ marginBottom: '20px' }}>Project Definition</span>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="buildingType">Building Type</label>
                <select id="buildingType" value={buildingType} onChange={e => setBuildingType(e.target.value)}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="area">Construction Area (Sq. Ft.)</label>
                <input
                  id="area"
                  type="number"
                  min="100"
                  max="1000000"
                  value={area}
                  onChange={e => { setArea(Number(e.target.value)); validateArea(e.target.value) }}
                  className={areaError ? 'invalid' : ''}
                  placeholder="e.g. 2000"
                />
                {areaError && <p className="field-error">{areaError}</p>}
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="floors">Number of Floors</label>
                <select id="floors" value={floors} onChange={e => setFloors(e.target.value)}>
                  {FLOORS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Project Location</label>
                <select id="location" value={location} onChange={e => setLocation(e.target.value)}>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label htmlFor="materialQuality">Material Quality Standard</label>
              <select id="materialQuality" value={materialQuality} onChange={e => setMaterialQuality(e.target.value)}>
                <option>Economy</option>
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleCalc(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Calculating…' : 'Calculate Budget →'}
              </button>
              <button
                onClick={() => handleCalc(true)}
                className="btn btn-secondary"
                disabled={loading}
                title="Save this estimate to your account"
              >
                Save
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--medium-gray)', marginTop: '16px', textAlign: 'center' }}>
              Estimates are derived from local material, labor, and location pricing parameters in Bangladesh.
            </p>
          </div>

          {/* Right: Results Card */}
          <div className="card" style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '36px' }}>
            <span className="label" style={{ marginBottom: '20px', color: 'var(--gold)' }}>Projected Budget Summary</span>

            {result ? (
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '4px', lineHeight: 1, color: 'var(--gold)' }}>
                  ৳{result.estimatedCost.toLocaleString()}
                </div>
                <div style={{ color: '#cfd8d2', marginBottom: '28px', fontSize: '0.9rem', letterSpacing: '0.5px' }}>TOTAL ESTIMATED COST</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '24px' }}>
                  {[
                    { label: 'Base Rate / Sq. Ft.', value: `৳${result.baseRate}` },
                    { label: 'Location Adjustment', value: `+${Math.round((result.locationMultiplier - 1) * 100)}%` },
                    { label: 'Floor Adjustment', value: `+${Math.round((result.floorMultiplier - 1) * 100)}%` },
                    { label: 'Material Quality', value: result.materialQuality },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                      <span style={{ color: '#cfd8d2', fontSize: '0.9rem' }}>{row.label}</span>
                      <span style={{ fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <span className="label" style={{ marginBottom: '14px', color: 'var(--gold)' }}>COST BREAKDOWN</span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'MATERIALS (60%)', value: result.estimatedCost * 0.6 },
                    { label: 'LABOUR (25%)', value: result.estimatedCost * 0.25 },
                    { label: 'LOGISTICS (10%)', value: result.estimatedCost * 0.10 },
                    { label: 'OTHER (5%)', value: result.estimatedCost * 0.05 },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cfd8d2' }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>৳{Math.round(item.value).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '360px', color: '#cfd8d2', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🧮</div>
                <h3>Ready to Calculate</h3>
                <p className="text-muted" style={{ color: '#a0aca3', maxWidth: '300px' }}>
                  Set your building area, floors, location, and quality parameters on the left.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
