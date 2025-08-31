import React from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardSecretary from './DashboardSecretary';
import {ROLES} from '../../Constants/Roles'
import DashboardTech from './DashboardTech';
import DashboardAdmin from './DashboardAdmin';
import DashboardPatient from './DashboardPatient';

const Dashboard = () => {
    const role = localStorage.getItem("role");
  return (
    <div>
      {/* <h1>ROLEEEEEEEEEEEEEEEEEE/ : {role}</h1> */}
      {role === ROLES.SECRETARY && <DashboardSecretary />}
{role === ROLES.ANALYST && <DashboardTech />}
{role === ROLES.ADMIN && <DashboardAdmin />}
{role === ROLES.PATIENT && <DashboardPatient />}

    </div>
  )
}

export default Dashboard
