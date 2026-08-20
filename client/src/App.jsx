// ====================================================================
// 🚦 MAIN APPLICATION ROUTER (App.jsx)
// ====================================================================
// This file connects website URLs (routes) to page components:
// - '/'               -> Home.jsx (Landing page)
// - '/services'       -> Services.jsx (Services list)
// - '/projects'       -> Projects.jsx (Sites monitoring)
// - '/projects/:id'   -> ProjectDetails.jsx (Single site details & floor plans)
// - '/cost-estimator' -> Estimator.jsx (Cost calculator)
// - '/materials'      -> Showcase.jsx (Materials & machinery)
// - '/portfolio'      -> Portfolio.jsx (Portfolio explorer)
// - '/quote'          -> Consultation.jsx (Request quote form)
// - '/start-site'     -> StartSite.jsx (Admin site creation)
// - '/admin/quotes'   -> AdminQuotes.jsx (Admin quote leads)
// - '/admin/dashboard'-> AdminDashboard.jsx (Admin analytics dashboard)
// - '/login'          -> Login.jsx (User & admin login)
// - '/register'       -> Register.jsx (User registration)
// - '/my-estimates'   -> MyEstimates.jsx (Saved estimates)
// ====================================================================

import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Common UI Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'

// Website Pages
import Home from './pages/Home'
import Services from './pages/Services'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Estimator from './pages/Estimator'
import Showcase from './pages/Showcase'
import Portfolio from './pages/Portfolio'
import Consultation from './pages/Consultation'
import StartSite from './pages/StartSite'
import Login from './pages/Login'
import Register from './pages/Register'
import MyEstimates from './pages/MyEstimates'
import MySpendings from './pages/MySpendings'
import UserPortfolio from './pages/UserPortfolio'
import AdminQuotes from './pages/AdminQuotes'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/cost-estimator" element={<Estimator />} />
          <Route path="/materials" element={<Showcase />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/quote" element={<Consultation />} />
          <Route path="/start-site" element={<StartSite />} />
          <Route path="/admin/quotes" element={<AdminQuotes />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-estimates" element={<MyEstimates />} />
          <Route path="/my-spendings" element={<MySpendings />} />
          <Route path="/my-portfolio" element={<UserPortfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <FloatingContact />
      <Footer />
    </div>
  )
}
