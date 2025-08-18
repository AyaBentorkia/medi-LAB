import React from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardSecretary from './DashboardSecretary';

const Dashboard = () => {
    const role = localStorage.getItem("role");

  return (
    <div>
      {role === "Secrétaire d'accueil" && <DashboardSecretary />}
    </div>
  )
}

export default Dashboard
