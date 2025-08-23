import { useState } from 'react'
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home';
import './App.css'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Sidebar from './components/Sidebar';
import PatientsList from './pages/Patients/PatientsList';
import AnalysisReqList from './pages/AnalysisRequests/AnalysisReqList';
import AnalysisReportsList from './pages/AnalysisReports/AnalysisReportsList';

function LayoutWithSidebar({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1rem" }}>
        {children}
      </div>
    </div>
  )
}
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/dashboard' element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
      <Route path='/profile' element={<LayoutWithSidebar><Profile /></LayoutWithSidebar>} />
      <Route path='/patients' element={<LayoutWithSidebar><PatientsList /></LayoutWithSidebar>} />
      <Route path="/demandes-d'analyse" element={<LayoutWithSidebar><AnalysisReqList /></LayoutWithSidebar>} />
      <Route path="/rapports-d'analyse" element={<LayoutWithSidebar><AnalysisReportsList /></LayoutWithSidebar>} />

    </Routes>
    </>
  )
}

export default App
