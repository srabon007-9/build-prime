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
    <div className="container">
      <h2>My Estimates</h2>
      {list.length===0 && <div>No saved estimates yet.</div>}
      {list.map(e=> (
        <div key={e._id} className="card" style={{marginTop:8}}>
          <div>{new Date(e.createdAt).toLocaleString()}</div>
          <div>{e.buildingType} • {e.area} sq ft • {e.floors} floors</div>
          <div>{e.location} • {e.materialQuality}</div>
          <div style={{fontWeight:700}}>BDT {e.estimatedCost.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
