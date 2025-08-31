import React from 'react';
import { Users, UserPlus, FileText, PlusCircle, FlaskConical, TestTube2, ListChecks } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useFetchUsers } from '../../hooks/useFetchUsers';
import { useFetchRequests } from '../../hooks/useFetchRequests';
import { useFetchReports } from '../../hooks/useFetchReports';
import { useFetchSamples } from '../../hooks/useSamples';
import { useFetchTypes } from '../../hooks/useTypes';
import { ROLES } from '../../Constants/Roles';

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];


const DashboardAdmin = () => {
  const {users}= useFetchUsers();
  const {requests}= useFetchRequests();
  const {reports}= useFetchReports();
  const {samples}= useFetchSamples();
  const {types}= useFetchTypes();
             const usersLength = users.length;
  const analysisLength= requests.length;
  const reportsLength= reports.length;
  const samplesLength= samples.length;
  const typesLength= types.length;
  const patients = users.filter(u => u.role === ROLES.PATIENT);
  const requestsEnAttente = requests.filter(r => r.status === "En attente").length;
const requestsTerminees = requests.filter(r => r.status === "Terminé").length;
const requestsEncours = requests.filter(r => r.status === "En cours").length;


  // const navigate = useNavigate(); // décommente si tu veux la navigation
const stats = [
  { label: "Utilisateurs", value: usersLength, icon: <Users size={28} />, color: "#2563eb" },
  { label: "Demandes d'analyses", value: analysisLength, icon: <FileText size={28} />, color: "#f59e42" },
  { label: "Rapports d'analyses", value: reportsLength, icon: <ListChecks size={28} />, color: "#22c55e" },
  { label: "Types de prélèvement", value: samplesLength, icon: <FlaskConical size={28} />, color: "#a21caf" },
  { label: "Types d'analyse", value: typesLength, icon: <TestTube2 size={28} />, color: "#4ade80" },
];

let barData = days.map(day => ({ name: day, patients: 0 }));
patients.forEach(patient => {
  const date = new Date(patient.createdAt); 
  const dayIndex = date.getDay();
  console.log("day index : ",dayIndex) 
  barData[dayIndex].patient += 1;
});
console.log(barData);

const requestsStatusData = [
  { name: "En attente", value: requestsEnAttente, color: "#f59e42" },
  { name: "En cours", value: requestsEncours, color: "#2563eb" },
  { name: "Terminé", value: requestsTerminees, color: "#22c55e" }
];

const sorted = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const lastThree = sorted.slice(0, 3);
const recentUsers = lastThree.map(user => ({
  id: user.id,
  name: `${user.firstname} ${user.lastname}`,
  CIN: user.CIN,
  role : user.role,
  date: new Date(user.createdAt).toISOString().split("T")[0] // format YYYY-MM-DD
}));
  return (
    <div className="dashboard-tech-container">
      <div className="dashboard-topbar">
        <h2 className="dashboard-title">Dashboard Administrateur</h2>
      </div>

      {/* Statistiques */}
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

      {/* Actions rapides */}
      <div className="dashboard-actions" style={{ flexWrap: "wrap" }}>
        <button className="dashboard-btn-primary" /*onClick={() => navigate('/utilisateurs')}*/>
          <Users size={18} /> Consulter les utilisateurs
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/utilisateurs/ajouter')}*/>
          <UserPlus size={18} /> Créer un utilisateur
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/demandes-d-analyse')}*/>
          <FileText size={18} /> Consulter les demandes d'analyses
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/rapports-d-analyse')}*/>
          <ListChecks size={18} /> Consulter les rapports d'analyses
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/prelevements/ajouter')}*/>
          <FlaskConical size={18} /> Créer un type de prélèvement
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/prelevements')}*/>
          <FlaskConical size={18} /> Liste des prélèvements
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/types/ajouter')}*/>
          <TestTube2 size={18} /> Créer un type d'analyse
        </button>
        <button className="dashboard-btn-outline" /*onClick={() => navigate('/types')}*/>
          <TestTube2 size={18} /> Liste des types d'analyse
        </button>
      </div>

      {/* Graphique activité */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h3>Activité des patients par jour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="patients" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
          <div className="dashboard-chart-card">
    <h3>Demandes d'analyses par statut</h3>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={requestsStatusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {requestsStatusData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
      </div>
      

      {/* Derniers utilisateurs */}
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Derniers utilisateurs inscrits</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>CIN</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.CIN}</td>
                <td>{u.role}</td>
                <td>{u.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;