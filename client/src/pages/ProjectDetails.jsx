// ====================================================================
// 🏗️ PROJECT DETAILS PAGE (ProjectDetails.jsx)
// ====================================================================
// Displays a single project's technical specifications, progress bar,
// interactive unit selector, cost breakdown, stages, and transactions.
// ====================================================================

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, CartesianGrid
} from 'recharts'
import { getUser, apiFetch } from '../api'
import UnitSelector from '../components/UnitSelector'

export default function ProjectDetails() {
  const { id } = useParams()

  // --- 1. STATE ---
  const [project, setProject] = useState(null)
  const [payment, setPayment] = useState({ investorName: '', stageName: '', amount: '', note: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const user = getUser()

  // --- 2. FETCH SITE DATA ---
  useEffect(() => { fetchProject() }, [id])

  async function fetchProject() {
    try {
      const { ok, data } = await apiFetch(`/projects/${id}`)
      if (!ok) throw new Error(data.message || 'Project not found')
      setProject(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // --- 3. ADMIN PAYMENT HANDLER ---
  function updatePayment(event) {
    const { name, value } = event.target
    setPayment(prev => ({ ...prev, [name]: value }))
  }

  async function submitPayment(event) {
    event.preventDefault()
    setMessage('Saving payment...')

    const { ok, data } = await apiFetch(`/projects/${id}/transactions`, {
      method: 'POST',
      body: JSON.stringify(payment)
    })

    if (!ok) {
      setMessage(data.message || 'Could not save payment')
      return
    }

    setProject(data)
    setPayment({ investorName: '', stageName: '', amount: '', note: '' })
    setMessage('Payment saved ✓')
  }

  // --- 4. CONDITIONAL STATES ---
  if (error) return <div className="container section"><div className="card empty-state">{error}</div></div>
  if (!project) return <div className="container section" style={{ textAlign: 'center', color: 'var(--medium-gray)' }}>Loading project data...</div>

  const price = project.estimatedPrice || project.budgetBDT || 0
  const hasCostBreakdown = project.landPrice || project.materialCost || project.equipmentCost || project.laborCost || project.permitCost
  const stages = project.stages || []
  const transactions = project.transactions || []

  // Chart data: budget vs collected donut
  const totalCollected = project.totalCollected || 0
  const remainingBudget = Math.max(0, price - totalCollected)
  const fundingData = [
    { name: 'Collected', value: totalCollected },
    { name: 'Remaining', value: remainingBudget }
  ].filter(item => item.value > 0)
  const collectionPercent = price ? Math.round((totalCollected / price) * 100) : 0

  // Chart data: collected vs target per stage
  const stageData = stages.map(stage => ({
    name: stage.name,
    collected: stage.collectedAmount || 0,
    target: stage.targetAmount || 0
  }))

  // Chart data: cumulative collections over time
  const cumulativeData = [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, item, index) => {
      const previous = index > 0 ? acc[index - 1].total : 0
      acc.push({
        date: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        total: previous + (item.amount || 0)
      })
      return acc
    }, [])

  // --- 5. RENDER ---
  return (
    <div>
      {/* Project Banner Image */}
      {project.image && (
        <div style={{ width: '100%', height: '420px', overflow: 'hidden' }}>
          <img
            src={project.image}
            alt={`${project.name} construction site`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      )}
      
      <div className="container section">
        <Link to="/projects" style={{ display: 'inline-block', marginBottom: '24px', color: 'var(--medium-gray)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Projects
        </Link>
        
        {/* Main Grid: Overview & Specifications */}
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge">{project.status}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--medium-gray)', fontWeight: 600, letterSpacing: '1px' }}>ID: {project.projectId}</span>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{project.name}</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.8 }}>{project.description}</p>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                <span>PROJECT PROGRESS</span>
                <span>{project.progressPercentage}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '16px', borderRadius: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${project.progressPercentage}%`, borderRadius: '8px' }}></div>
              </div>
            </div>
          </div>
          
          {/* Technical Specifications Panel */}
          <div className="card" style={{ backgroundColor: 'var(--light-gray)', border: 'none', padding: '32px' }}>
            <span className="label" style={{ marginBottom: '24px' }}>TECHNICAL SPECIFICATIONS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Location</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.location}, Bangladesh</div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Project Type</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.projectType} Development</div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Estimated Price</div>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--black)' }}>BDT {price.toLocaleString()}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Interested Investors</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{project.investorCount || 0} people</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Initial Land Payment / Person</div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>BDT {(project.landPaymentPerInvestor || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Floor Plans & Unit Availability Selector */}
        <UnitSelector project={project} onProjectUpdate={data => setProject(data)} />

        {/* Cost Breakdown */}
        {hasCostBreakdown && (
          <div className="card cost-breakdown-card">
            <span className="label">Business Cost Breakdown</span>
            <h2>How The Estimated Price Was Calculated</h2>
            <div className="cost-list">
              <div><span>Land Price</span><strong>BDT {(project.landPrice || 0).toLocaleString()}</strong></div>
              <div><span>Material Cost</span><strong>BDT {(project.materialCost || 0).toLocaleString()}</strong></div>
              <div><span>Equipment Cost</span><strong>BDT {(project.equipmentCost || 0).toLocaleString()}</strong></div>
              <div><span>Labor Cost</span><strong>BDT {(project.laborCost || 0).toLocaleString()}</strong></div>
              <div><span>Permit / Utility Cost</span><strong>BDT {(project.permitCost || 0).toLocaleString()}</strong></div>
              <div><span>Contingency</span><strong>{project.contingencyPercent || 0}%</strong></div>
            </div>
          </div>
        )}

        {/* Stage Progress Breakdown */}
        {stages.length > 0 && (
          <div className="card cost-breakdown-card">
            <span className="label">Project Stage Monitor</span>
            <h2>Money Collection By Construction Step</h2>
            <div className="stage-list">
              {stages.map(stage => {
                const percent = stage.targetAmount ? Math.round((stage.collectedAmount / stage.targetAmount) * 100) : 0
                return (
                  <div className="stage-row" key={stage.name}>
                    <div>
                      <h3>{stage.name}</h3>
                      <p>{stage.status}</p>
                    </div>
                    <div>
                      <strong>BDT {(stage.collectedAmount || 0).toLocaleString()} / {(stage.targetAmount || 0).toLocaleString()}</strong>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Stage Collection Chart */}
        {stageData.length > 0 && (
          <div className="card cost-breakdown-card">
            <span className="label">Collection Visualisation</span>
            <h2>Collected vs Target by Stage</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageData} layout="vertical" margin={{ left: 40, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tickFormatter={value => `${Math.round(value / 100000)}L`} tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: 'var(--black)' }} />
                <Tooltip formatter={value => `BDT ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="target" name="Target" fill="var(--border)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="collected" name="Collected" fill="var(--green)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Funding Overview Charts */}
        {price > 0 && fundingData.length > 0 && (
          <div className="grid-2" style={{ alignItems: 'start', marginBottom: '40px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <span className="label" style={{ marginBottom: '16px' }}>FUNDING STATUS</span>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Budget vs Collected</h2>
              <div style={{ position: 'relative' }}>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={fundingData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={100}
                      paddingAngle={3}
                    >
                      <Cell fill="var(--green)" />
                      <Cell fill="var(--border)" />
                    </Pie>
                    <Tooltip formatter={value => `BDT ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--green)' }}>{collectionPercent}%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--medium-gray)', letterSpacing: '1px' }}>COLLECTED</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.85rem' }}>
                <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--green)', marginRight: '6px' }}></span>Collected: BDT {totalCollected.toLocaleString()}</span>
                <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--border)', marginRight: '6px' }}></span>Remaining: BDT {remainingBudget.toLocaleString()}</span>
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <span className="label" style={{ marginBottom: '16px' }}>CASH FLOW</span>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Cumulative Collections</h2>
              {cumulativeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={cumulativeData}>
                    <defs>
                      <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--green)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--green)" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--medium-gray)' }} />
                    <YAxis tickFormatter={value => `${Math.round(value / 100000)}L`} tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
                    <Tooltip formatter={value => `BDT ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="total" stroke="var(--green)" strokeWidth={2.5} fill="url(#collectionFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted" style={{ paddingTop: '80px' }}>No payments recorded yet — the chart will appear after the first transaction.</p>
              )}
            </div>
          </div>
        )}

        {/* Transaction History & Admin Record Payment */}
        <div className="card cost-breakdown-card">
          <span className="label">Transaction Monitor</span>
          <h2>All Project Transactions</h2>
          {user.role === 'admin' && (
            <form className="payment-form" onSubmit={submitPayment}>
              <input name="investorName" value={payment.investorName} onChange={updatePayment} placeholder="Investor name" required />
              <select name="stageName" value={payment.stageName} onChange={updatePayment} required>
                <option value="">Select stage</option>
                {stages.map(stage => <option key={stage.name}>{stage.name}</option>)}
              </select>
              <input name="amount" type="number" value={payment.amount} onChange={updatePayment} placeholder="Amount" required />
              <input name="note" value={payment.note} onChange={updatePayment} placeholder="Note" />
              <button className="btn btn-primary">Record Payment</button>
              {message && <p className="form-status">{message}</p>}
            </form>
          )}

          {transactions.length > 0 ? (
            <div className="transaction-list">
              {transactions.map((item, index) => (
                <div className="transaction-row" key={index}>
                  <span style={{ fontWeight: 600 }}>{item.investorName}</span>
                  <span style={{ color: 'var(--medium-gray)' }}>{item.stageName}</span>
                  <strong style={{ color: 'var(--green)' }}>BDT {(item.amount || 0).toLocaleString()}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No payments recorded yet. Admin can add payment recording later.</p>
          )}
        </div>
      </div>
    </div>
  )
}
