import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
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
import NotFound from './pages/NotFound'
import AdminQuotes from './pages/AdminQuotes'

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-estimates" element={<MyEstimates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <FloatingContact />
      <Footer />
    </div>
  )
}
