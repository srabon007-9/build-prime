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
    <div className="container" style={{maxWidth:720}}>
      <h2>Construction Cost Estimator</h2>
      <div className="card">
        <div className="form-row">
          <select value={buildingType} onChange={e=>setBuildingType(e.target.value)}>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
          </select>
          <input value={area} onChange={e=>setArea(Number(e.target.value))} placeholder="Area (sq ft)" />
          <select value={floors} onChange={e=>setFloors(e.target.value)}>{FLOORS.map(f=><option key={f}>{f}</option>)}</select>
          <select value={location} onChange={e=>setLocation(e.target.value)}>{LOCATIONS.map(l=><option key={l}>{l}</option>)}</select>
          <select value={materialQuality} onChange={e=>setMaterialQuality(e.target.value)}>
            <option>Economy</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
        </div>
        <div style={{marginTop:8}}>
          <button onClick={()=>handleCalc(false)}>Calculate</button>
          <button onClick={()=>handleCalc(true)} style={{marginLeft:8}}>Calculate & Save</button>
        </div>
      </div>

      {result && (
        <div style={{marginTop:12}} className="card">
          <h3>Estimated Construction Cost</h3>
          <div style={{fontSize:20,fontWeight:700}}>BDT {result.estimatedCost.toLocaleString()}</div>
          <div>Rate per Sq. Ft.: BDT {result.baseRate}</div>
          <div>Location Adjustment: +{Math.round((result.locationMultiplier-1)*100)}%</div>
          <div>Floor Adjustment: +{Math.round((result.floorMultiplier-1)*100)}%</div>
          <div>Material Quality: {result.materialQuality}</div>

          <h4 style={{marginTop:10}}>Cost Breakdown</h4>
          <div>Materials: BDT {(result.estimatedCost*0.6).toLocaleString()}</div>
          <div>Labour: BDT {(result.estimatedCost*0.25).toLocaleString()}</div>
          <div>Utilities & Logistics: BDT {(result.estimatedCost*0.10).toLocaleString()}</div>
          <div>Other: BDT {(result.estimatedCost*0.05).toLocaleString()}</div>

          <p style={{fontSize:13,color:'#666'}}>Note: Location multiplier is a demo market adjustment for construction costs only. It does not include land price.</p>
        </div>
      )}
    </div>
  )
}
