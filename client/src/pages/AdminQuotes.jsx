import React, {useEffect, useState} from 'react'
import { API_URL, getToken, isAdmin } from '../api'

export default function AdminQuotes(){
  const [quotes, setQuotes] = useState([])
  const [message, setMessage] = useState('Loading quote requests...')

  useEffect(() => { fetchQuotes() }, [])

  async function fetchQuotes(){
    if (!isAdmin()) {
      setMessage('Only admin can view quotation requests.')
      return
    }

    const res = await fetch(`${API_URL}/consultations`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    const data = await res.json()

    if (!res.ok) {
      setMessage(data.message || 'Could not load quote requests')
      return
    }

    setQuotes(data)
    setMessage('')
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="label">Admin</span>
          <h1>Quotation Requests</h1>
          <p>Review client consultation requests and contact leads quickly.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {message && <div className="card empty-state">{message}</div>}

          <div className="grid-2">
            {quotes.map(quote => (
              <div className="card" key={quote._id}>
                <span className="badge">{quote.projectType}</span>
                <h3>{quote.name}</h3>
                <p className="text-muted">{quote.location}</p>
                <div className="cost-list" style={{ marginTop: '16px' }}>
                  <div><span>Phone</span><strong>{quote.phone}</strong></div>
                  <div><span>Email</span><strong>{quote.email || 'Not given'}</strong></div>
                  <div><span>Budget</span><strong>{quote.budget || 'Not given'}</strong></div>
                </div>
                <p style={{ marginTop: '16px' }}>{quote.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
