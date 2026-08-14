import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../api'
import { useToast } from '../components/Toast'

function SkeletonEstimate() {
  return (
    <div className="grid-2">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-body">
            <div className="skeleton skeleton-line short"></div>
            <div className="skeleton skeleton-line tall" style={{ width: '60%', height: '28px', marginBottom: '8px' }}></div>
            <div className="skeleton skeleton-line full"></div>
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-line full"></div>
            <div className="skeleton skeleton-line short" style={{ marginTop: '8px', height: '40px', width: '100%', borderRadius: '6px' }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MyEstimates() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => { fetchMy() }, [])

  async function fetchMy() {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const res = await fetch(`${API_URL}/estimates/my`, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) {
        toast(data.message || 'Could not load your estimates', 'error')
        return
      }
      setList(data)
    } catch {
      toast('Network error — please try again', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="label">Estimation History</span>
          <h1>My Saved Estimates</h1>
          <p>Review and track your previously saved construction budget forecasts.</p>
        </div>
      </section>

      {/* Main Section */}
      <div className="container section">
        {loading && <SkeletonEstimate />}

        {!loading && list.length === 0 && (
          <div className="card empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
            <h3>No Estimates Saved Yet</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>Generate and save budget calculations to view them here.</p>
            <Link to="/cost-estimator" className="btn btn-primary">Open Cost Calculator →</Link>
          </div>
        )}

        {!loading && list.length > 0 && (
          <div className="grid-2">
            {list.map(e => (
              <div key={e._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--medium-gray)', fontWeight: 600 }}>
                    📅 {new Date(e.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="badge">{e.buildingType}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Area', value: `${e.area.toLocaleString()} sq ft` },
                    { label: 'Floors', value: `${e.floors} ${e.floors === '1' ? 'Floor' : 'Floors'}` },
                    { label: 'Location', value: e.location },
                    { label: 'Quality Standard', value: e.materialQuality },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px', fontWeight: 700 }}>
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', backgroundColor: 'var(--light-gray)', padding: '18px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--medium-gray)' }}>Estimated Total Cost</span>
                  <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--green)' }}>৳{e.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
