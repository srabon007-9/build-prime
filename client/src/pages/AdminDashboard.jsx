// ====================================================================
// 📊 ADMIN ANALYTICS DASHBOARD (AdminDashboard.jsx)
// ====================================================================
// Admin-only overview of the whole business:
// - Stat cards (projects, budget, collections, users, leads, estimates)
// - Pie chart of projects by status
// - Bar chart of budget vs collected per project
// - Line chart of monthly investor collections
// - Recent investor transactions feed
// ====================================================================

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'
import { getUser, apiFetch } from '../api'

const STATUS_COLORS = {
  'Ongoing': 'var(--gold)',
  'Upcoming': '#8fae9d',
  'Completed': 'var(--green)',
  'On Hold': '#c96a4a'
}

function formatBDT(value) {
  const amount = Number(value) || 0
  if (amount >= 10000000) return `BDT ${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `BDT ${(amount / 100000).toFixed(2)} L`
  return `BDT ${amount.toLocaleString()}`
}

function StatCard({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="label" style={{ marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--green)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.85rem', color: 'var(--medium-gray)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const user = getUser()

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { ok, data } = await apiFetch('/projects/stats/overview')
    if (!ok) {
      setError(data.message || 'Could not load dashboard data')
      return
    }
    setStats(data)
  }

  if (error) return <div className="container section"><div className="card empty-state">{error}</div></div>
  if (user.role !== 'admin') return <div className="container section"><div className="card empty-state">Admin access only</div></div>
  if (!stats) return <div className="container section" style={{ textAlign: 'center', color: 'var(--medium-gray)' }}>Loading dashboard...</div>

  const { totals, statusBreakdown, perProject, recentTransactions, monthlyCollections } = stats
  const collectionRate = totals.totalBudget ? Math.round((totals.totalCollected / totals.totalBudget) * 100) : 0
  const remaining = totals.totalBudget - totals.totalCollected

  return (
    <div className="container section">
      <span className="badge">Admin</span>
      <h1 style={{ fontSize: '2.2rem', margin: '12px 0 32px' }}>Analytics Dashboard</h1>

      {/* Summary Stat Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: '40px' }}>
        <StatCard label="Total Projects" value={totals.totalProjects} sub={`${statusBreakdown.find(s => s.status === 'Ongoing')?.count || 0} ongoing · ${statusBreakdown.find(s => s.status === 'Completed')?.count || 0} completed`} />
        <StatCard label="Total Budget" value={formatBDT(totals.totalBudget)} sub="Across all projects" />
        <StatCard label="Total Collected" value={formatBDT(totals.totalCollected)} sub={`${collectionRate}% of budget · ${formatBDT(remaining)} remaining`} />
        <StatCard label="Avg. Progress" value={`${totals.avgProgress}%`} sub="Construction completion" />
        <StatCard label="Registered Users" value={totals.totalUsers} sub="Customer accounts" />
        <StatCard label="Quote Leads" value={totals.totalLeads} sub="Consultation requests" />
        <StatCard label="Saved Estimates" value={totals.totalEstimates} sub="Cost calculator results" />
        <StatCard label="Investment Gap" value={formatBDT(remaining)} sub="Yet to be collected" />
      </div>

      {/* Charts Row: Status Pie + Monthly Collections Line */}
      <div className="grid-2" style={{ alignItems: 'start', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <span className="label" style={{ marginBottom: '16px' }}>PROJECT PIPELINE</span>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Projects by Status</h2>
          {statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={95}
                  paddingAngle={3}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {statusBreakdown.map(entry => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || 'var(--medium-gray)'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No projects yet. <Link to="/start-site">Create the first site</Link>.</p>
          )}
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <span className="label" style={{ marginBottom: '16px' }}>CASH FLOW</span>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Monthly Investor Collections</h2>
          {monthlyCollections.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyCollections}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
                <YAxis tickFormatter={value => `${Math.round(value / 100000)}L`} tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
                <Tooltip formatter={value => formatBDT(value)} />
                <Line type="monotone" dataKey="amount" stroke="var(--green)" strokeWidth={2.5} dot={{ fill: 'var(--gold)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">No investor payments recorded yet.</p>
          )}
        </div>
      </div>

      {/* Budget vs Collected Bar Chart */}
      <div className="card" style={{ padding: '28px', marginBottom: '40px' }}>
        <span className="label" style={{ marginBottom: '16px' }}>FUNDING STATUS</span>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Budget vs Collected per Project</h2>
        {perProject.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perProject}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
              <YAxis tickFormatter={value => `${Math.round(value / 100000)}L`} tick={{ fontSize: 12, fill: 'var(--medium-gray)' }} />
              <Tooltip formatter={value => formatBDT(value)} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="var(--medium-gray)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="var(--green)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted">No projects to compare yet.</p>
        )}
      </div>

      {/* Recent Transactions Feed */}
      <div className="card" style={{ padding: '28px' }}>
        <span className="label" style={{ marginBottom: '16px' }}>LATEST ACTIVITY</span>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Recent Investor Payments</h2>
        {recentTransactions.length > 0 ? (
          <div className="transaction-list">
            {recentTransactions.map((item, index) => (
              <div className="transaction-row" key={index}>
                <span style={{ fontWeight: 600 }}>{item.investorName}</span>
                <span style={{ color: 'var(--medium-gray)' }}>{item.projectName} · {item.stageName}</span>
                <span style={{ color: 'var(--medium-gray)', fontSize: '0.85rem' }}>{new Date(item.date).toLocaleDateString()}</span>
                <strong style={{ color: 'var(--green)' }}>BDT {(item.amount || 0).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No payments recorded yet.</p>
        )}
      </div>
    </div>
  )
}
