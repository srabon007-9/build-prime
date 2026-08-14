import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand" style={{ marginBottom: '12px' }}>
              <Logo size={28} />
            </div>
            <p className="footer-desc">
              Premier construction planning, project development, cost estimation, and transparent engineering monitoring across Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="footer-heading">Quick Links</span>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/cost-estimator">Cost Calculator</Link></li>
              <li><Link to="/materials">Materials</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <span className="footer-heading">Services</span>
            <ul className="footer-links text-only">
              <li>Residential Construction</li>
              <li>Commercial Projects</li>
              <li>Land Development</li>
              <li>Project Management</li>
              <li>Cost Breakdown Planning</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="footer-heading">Contact Us</span>
            <ul className="footer-links text-only">
              <li>Dhaka, Bangladesh</li>
              <li>+880 1682-399499</li>
              <li>info@buildprime.com</li>
              <li>Mon - Sat: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© 2026 BuildPrime Construction Ltd. All rights reserved.</span>
          <div className="footer-legal">
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
