import React, {useEffect, useState} from 'react'

export default function MyEstimates(){
  const [list,setList]=useState([])

  useEffect(()=>{fetchMy()},[])

  async function fetchMy(){
    const token = localStorage.getItem('token')
    if(!token) return window.location='/login'
    const res = await fetch('http://localhost:5500/api/estimates/my',{headers:{'Authorization':`Bearer ${token}`}})
    const data = await res.json()
    if(!res.ok) return alert(data.message||'Error')
    setList(data)
  }

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="label">ESTIMATION REPORT</span>
        <h1>MY ESTIMATION RECORDS</h1>
      </div>
      
      {list.length===0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--light-gray)', border: 'none' }}>
          <span className="label">NO ESTIMATES YET</span>
          <p className="text-muted">Your saved construction estimates will appear here.</p>
        </div>
      ) : (
        <div className="grid-2">
          {list.map(e=> (
            <div key={e._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', fontWeight: 600 }}>{new Date(e.createdAt).toLocaleDateString()}</span>
                <span className="badge">{e.buildingType}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>Area</div>
                  <div style={{ fontWeight: 600 }}>{e.area} sq ft</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>Floors</div>
                  <div style={{ fontWeight: 600 }}>{e.floors}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>Location</div>
                  <div style={{ fontWeight: 600 }}>{e.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)', textTransform: 'uppercase', marginBottom: '4px' }}>Quality</div>
                  <div style={{ fontWeight: 600 }}>{e.materialQuality}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: 'var(--light-gray)', padding: '16px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--medium-gray)' }}>Estimated Cost</span>
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>৳{e.estimatedCost.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
