import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const LOCATIONS = ['Gulshan','Banani','Dhanmondi','Uttara','Bashundhara','Purbachal','Mirpur','Khilgaon','Chattogram','Sylhet','Rajshahi','Khulna']
const FLOORS = ['1','2','3','4','5+']

export default function Estimator(){
  const [buildingType,setBuildingType]=useState('Residential')
  const [area,setArea]=useState(2000)
  const [floors,setFloors]=useState('1')
  const [location,setLocation]=useState('Dhanmondi')
  const [materialQuality,setMaterialQuality]=useState('Standard')
  const [result,setResult]=useState(null)
  const navigate = useNavigate()

  async function handleCalc(save=false){
    const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5500/api/estimates',{
      method:'POST',headers:{'Content-Type':'application/json', 'Authorization': token?`Bearer ${token}`:''},
      body:JSON.stringify({buildingType,area,floors,location,materialQuality,save})
    })
    const data = await res.json()
    if (!res.ok) return alert(data.message||'Error')
    setResult(data)
  }

  return (
    <div>
      <div style={{ backgroundColor: 'var(--light-gray)', padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="label">BuildPrime BD / Engineering</span>
          <h1 style={{ marginBottom: '16px' }}>CONSTRUCTION COST<br/>ESTIMATOR</h1>
          <p className="text-muted" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
            Generate preliminary budget forecasts based on Bangladesh market parameters.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid-2" style={{ alignItems: 'start' }}>
          
          {/* Left Column: Input Form */}
          <div className="card" style={{ padding: '32px' }}>
            <span className="label" style={{ marginBottom: '24px' }}>PROJECT DEFINITION</span>
            
            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Building Type</label>
                <select value={buildingType} onChange={e=>setBuildingType(e.target.value)}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Construction Area (Sq Ft)</label>
                <input type="number" value={area} onChange={e=>setArea(Number(e.target.value))} placeholder="Area (sq ft)" />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label>Number of Floors</label>
                <select value={floors} onChange={e=>setFloors(e.target.value)}>{FLOORS.map(f=><option key={f}>{f}</option>)}</select>
              </div>
              <div className="form-group">
                <label>Project Location</label>
                <select value={location} onChange={e=>setLocation(e.target.value)}>{LOCATIONS.map(l=><option key={l}>{l}</option>)}</select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label>Material Quality Standard</label>
              <select value={materialQuality} onChange={e=>setMaterialQuality(e.target.value)}>
                <option>Economy</option>
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={()=>handleCalc(false)} className="btn btn-primary" style={{ flex: 1 }}>GENERATE ESTIMATE →</button>
              <button onClick={()=>handleCalc(true)} className="btn btn-secondary">Save Record</button>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', marginTop: '16px', textAlign: 'center' }}>
              Preliminary estimate based on demo construction-market adjustment factors for Bangladesh.
            </p>
          </div>

          {/* Right Column: Results */}
          <div className="card" style={{ padding: '32px', backgroundColor: 'var(--black)', color: 'var(--white)' }}>
            <span className="label" style={{ marginBottom: '24px', color: 'var(--medium-gray)' }}>ESTIMATED BUDGET</span>
            
            {result ? (
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1 }}>
                  ৳{result.estimatedCost.toLocaleString()}
                </div>
                <div style={{ color: 'var(--medium-gray)', marginBottom: '32px' }}>TOTAL PROJECTED COST</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #333', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--medium-gray)' }}>Base Rate / Sq. Ft.</span>
                    <span>৳{result.baseRate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--medium-gray)' }}>Location Adjustment</span>
                    <span>+{Math.round((result.locationMultiplier-1)*100)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--medium-gray)' }}>Floor Adjustment</span>
                    <span>+{Math.round((result.floorMultiplier-1)*100)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--medium-gray)' }}>Material Quality</span>
                    <span>{result.materialQuality}</span>
                  </div>
                </div>

                <span className="label" style={{ marginBottom: '16px', color: 'var(--medium-gray)' }}>COST BREAKDOWN</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'MATERIALS (60%)', value: result.estimatedCost * 0.6 },
                    { label: 'LABOUR (25%)', value: result.estimatedCost * 0.25 },
                    { label: 'LOGISTICS (10%)', value: result.estimatedCost * 0.10 },
                    { label: 'OTHER (5%)', value: result.estimatedCost * 0.05 }
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: '#222', padding: '12px 16px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontWeight: 700 }}>৳{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--medium-gray)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>৳0</div>
                <p>Define your project parameters on the left to generate a preliminary budget estimate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
