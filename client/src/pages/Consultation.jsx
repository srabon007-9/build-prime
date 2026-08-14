import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API_URL } from '../api'
import { useToast } from '../components/Toast'

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  projectType: 'Residential',
  location: '',
  budget: '',
  message: ''
}

export default function Consultation() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const proj = searchParams.get('project')
    const unit = searchParams.get('unit')
    if (proj || unit) {
      const defaultMsg = `I would like to schedule a site visit to inspect ${unit || 'a unit'} at ${proj || 'your site'}. Please contact me with available consultation times.`
      setForm(prev => ({ ...prev, message: defaultMsg }))
    }
  }, [searchParams])

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.message.trim()) newErrors.message = 'Project details are required'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function submitForm(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.message || 'Something went wrong', 'error')
        return
      }
      toast('Request sent! Our team will contact you soon.', 'success')
      setForm(EMPTY_FORM)
      setErrors({})
    } catch {
      toast('Network error — please try again', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function Field({ name, label, type = 'text', required = false, placeholder = '' }) {
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}{required && ' *'}</label>
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={updateField}
          placeholder={placeholder}
          className={errors[name] ? 'invalid' : ''}
        />
        {errors[name] && <p className="field-error">{errors[name]}</p>}
      </div>
    )
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="label">Consultation and Quotation</span>
          <h1>Request A Project Quotation</h1>
          <p>Share your construction idea, land location, budget range, and contact details. Our team will review it and contact you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <form className="card" style={{ padding: '32px' }} onSubmit={submitForm} noValidate>
            <div className="grid-2">
              <Field name="name" label="Your Name" required />
              <Field name="phone" label="Phone Number" required />
            </div>
            <div className="grid-2">
              <Field name="email" label="Email" type="email" placeholder="Optional" />
              <div className="form-group">
                <label htmlFor="projectType">Project Type</label>
                <select id="projectType" name="projectType" value={form.projectType} onChange={updateField}>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Infrastructure</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <Field name="location" label="Project Location" required />
              <Field name="budget" label="Budget Range" placeholder="Example: 50 lakh" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Project Details *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={updateField}
                className={errors.message ? 'invalid' : ''}
              />
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit Request'}
            </button>
          </form>

          <div className="quote-panel">
            <span className="label">How it works</span>
            <h2>Clear quotation process</h2>
            <p>BuildPrime reviews your requirements, estimates the project scope, and contacts you with a consultation time.</p>
            <div className="steps">
              <span>1. Submit project information</span>
              <span>2. Engineer reviews the request</span>
              <span>3. Team shares a quotation plan</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
