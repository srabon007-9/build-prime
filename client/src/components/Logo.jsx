// ====================================================================
// 📐 BRAND LOGO COMPONENT (Logo.jsx)
// ====================================================================
// Combines the geometric "B" structural mark with the BuildPrime wordmark.
// Props:
// - size     : Height & width of SVG emblem (default: 32)
// - showText : Whether to display "BuildPrime" text (default: true)
// - onClick  : Optional click handler (e.g. closing mobile menu)
// ====================================================================

import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo({ size = 32, showText = true, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="brand-logo" aria-label="BuildPrime Home">
      {/* Geometric Architectural "B" Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-symbol"
      >
        {/* Main Vertical Structural Column (Spine of 'B') */}
        <rect x="4" y="4" width="5.5" height="24" rx="1.2" fill="#059669" />

        {/* Upper Structural Loop (Warm Gold Roofline Beam) */}
        <path d="M11.5 4H19.5C22.5 4 25 6.5 25 9.5C25 12.5 22.5 15 19.5 15H11.5V4Z" fill="#d97706" />
        <path d="M11.5 7.5H19C19.8 7.5 20.5 8.2 20.5 9C20.5 9.8 19.8 10.5 19 10.5H11.5V7.5Z" fill="#ffffff" />

        {/* Lower Structural Base Loop (Deep Emerald Foundation) */}
        <path d="M11.5 14.5H21.5C24.8 14.5 27.5 17.2 27.5 20.5C27.5 23.8 24.8 26.5 21.5 26.5H11.5V14.5Z" fill="#059669" />
        <path d="M11.5 18H20.5C21.6 18 22.5 18.9 22.5 20C22.5 21.1 21.6 22 20.5 22H11.5V18Z" fill="#ffffff" />

        {/* Interlocking Beam Support Joint */}
        <rect x="4" y="13.5" width="7.5" height="3" fill="#d97706" />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <span className="brand-wordmark">
          <span className="brand-build">Build</span>
          <span className="brand-prime">Prime</span>
        </span>
      )}
    </Link>
  )
}
