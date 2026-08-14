import React from 'react'

export default function FloatingContact() {
  return (
    <div className="floating-contact" aria-label="Quick contact buttons">
      <a
        href="tel:+8801682399499"
        className="floating-btn call"
        title="Call BuildPrime"
        aria-label="Call us"
      >
        <span className="floating-icon" aria-hidden="true">📞</span>
        <span>Call Us</span>
      </a>
      <a
        href="https://wa.me/8801682399499"
        className="floating-btn whatsapp"
        target="_blank"
        rel="noreferrer noopener"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="floating-icon" aria-hidden="true">💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  )
}
