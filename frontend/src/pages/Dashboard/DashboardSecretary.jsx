import React from 'react';
import { Users, FileText, PlusCircle, FlaskConical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFetchRequests } from '../../hooks/useFetchRequests';
import { useFetchUsers } from '../../hooks/useFetchUsers';


const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// const stats = [
//   { label: "Patients enregistrés", value: 120, icon: <Users size={28} />, color: "#2563eb" },
//   { label: "Demandes d'analyses", value: 45, icon: <FileText size={28} />, color: "#f59e42" },
//   { label: "Analyses réalisées", value: 30, icon: <FlaskConical size={28} />, color: "#22c55e" },
// ];



// Données pour le BarChart : demandes d'analyses par jour
// const analysisRequestsData = [
//   { day: "Lun", demandes: 7 },
//   { day: "Mar", demandes: 12 },
//   { day: "Mer", demandes: 9 },
//   { day: "Jeu", demandes: 15 },
//   { day: "Ven", demandes: 8 },
//   { day: "Sam", demandes: 5 },
//   { day: "Dim", demandes: 3 }
// ];

const DashboardSecretary = () => {
  const {
            requests,
          }= useFetchRequests();
const {users,setUsers}= useFetchUsers();

           const patientsLength = users.length;
const analysesTerminees = requests.filter(r => r.status === "Terminé").length;
const demandesRecues   = requests.length;
const analysesLength = requests.length;

const stats = [
  { label: "Patients enregistrés", value: patientsLength, icon: <Users size={28} />, color: "#2563eb" },
  { label: "Demandes d'analyses", value: analysesLength, icon: <FileText size={28} />, color: "#22c55e" },
  { label: "Analyses réalisées", value: analysesTerminees, icon: <FlaskConical size={28} />, color: "#f59e42" },
];
      let barData = days.map(day => ({ name: day, analyses: 0 }));
requests.forEach(req => {
  const date = new Date(req.createdAt); 
  const dayIndex = date.getDay();
  console.log("day index : ",dayIndex) 
  barData[dayIndex].analyses += 1;
});
console.log(barData);


const sorted = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const lastThree = sorted.slice(0, 3);
const recentPatients = lastThree.map(user => ({
  id: user.id,
  name: `${user.firstname} ${user.lastname}`,
  CIN: user.CIN,
  date: new Date(user.createdAt).toISOString().split("T")[0] // format YYYY-MM-DD
}));
  return (
    <div className="dashboard-tech-container">
      <div className="dashboard-topbar">
        <h2 className="dashboard-title">Dashboard Secrétaire d'accueil</h2>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat, idx) => (
          <div className="dashboard-stat-card" key={idx}>
            <div className="stat-icon" style={{ background: stat.color + "22", color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-actions">
        <button className="submit-add-result-btn btn-add-result">
          <PlusCircle size={18} /> Nouvelle demande d'analyse
        </button>
        <button className="dashboard-btn-outline">
          <Users size={18} /> Voir les patients
        </button>

      </div>

      {/* BarChart des demandes d'analyses par jour */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h3>Demandes d'analyses par jour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="analyses" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Derniers patients enregistrés</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>CIN</th>
              <th>Date d'enregistrement</th>
            </tr>
          </thead>
          <tbody>
            {recentPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.CIN}</td>
                <td>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSecretary;