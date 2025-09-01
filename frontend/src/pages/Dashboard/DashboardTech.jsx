import React from 'react';
import { Bell, FlaskConical, FileText, CheckCircle, User, PlusCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './TechnicianDashboard.css';
import { useFetchRequests } from '../../hooks/useFetchRequests';
import { useFetchReports } from '../../hooks/useFetchReports';
import { useFetchNotif } from '../../hooks/useFetchNotif';

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const DashboardTech = () => {
  const {
          token,role,
          isLoading,setIsLoading,
          requests,setRequests,
          statusChanged,setStatusChanged
        }= useFetchRequests();
  const {reports,setReports}= useFetchReports()
        const analysesATraiter = requests.filter(r => r.status === "En attente").length;
const analysesTerminees = requests.filter(r => r.status === "Terminé").length;
const demandesRecues   = requests.length;
const reportsLength = reports.length;

const stats = [
  { label: "Analyses à traiter", value: analysesATraiter, icon: <FlaskConical size={28} />, color: "#2563eb" },
  { label: "Analyses terminées", value: analysesTerminees, icon: <CheckCircle size={28} />, color: "#22c55e" },
  { label: "Demandes reçues", value: demandesRecues, icon: <FileText size={28} />, color: "#f59e42" },
  { label: "Rapports terminés", value: reportsLength, icon: <User size={28} />, color: "#a21caf" },
];
      let barData = days.map(day => ({ name: day, analyses: 0 }));
requests.forEach(req => {
  const date = new Date(req.createdAt); 
  const dayIndex = date.getDay();
  // console.log("day index : ",dayIndex) 
  barData[dayIndex].analyses += 1;
});
// console.log(barData);

const sorted = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const lastThree = sorted.slice(0, 3);
const recentAnalyses = lastThree.map(req => ({
  id: req.id,
  patient: `${req.patient.firstname} ${req.patient.lastname}`,
  status: req.status,
  date: new Date(req.createdAt).toISOString().split("T")[0] 
}));

// get notifs
const [showNotif, setShowNotif] = React.useState(false);
const { notifs,
    isRead, markAsRead,
    unreadCount}= useFetchNotif();


  return (
    <div className="dashboard-tech-container">
      {/* Barre supérieure */}
     <div className="dashboard-topbar">
  <h2 className="dashboard-title">Dashboard Technicien</h2>
  <div style={{ position: "relative" }}>
    <button className="dashboard-notif-btn" onClick={() => {setShowNotif(v => !v), markAsRead()}}>
      <Bell size={22} />
       {unreadCount > 0 && (
      <span className="notif-bubble">{unreadCount}</span>
    )}
    </button>
    {showNotif && (
      <div className="dashboard-notif-list-container notif-dropdown">
        <h3 className="notif-title">Notifications</h3>
        <div className="dashboard-notif-list">
          {notifs && notifs.length > 0 ? (
            notifs.map((notif, idx) => (
              <div className={`notif-item${notif.isRead ? " read" : ""}`} key={notif.id || idx}>
                <span className="notif-message">{notif.message}</span>
                <span className="notif-date">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                </span>
              </div>
            ))
          ) : (
            <div className="notif-item empty">Aucune notification</div>
          )}
        </div>
      </div>
    )}
  </div>
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

      {/* Actions */}
      <div className="dashboard-actions">
        <button className="dashboard-btn-primary">
          <PlusCircle size={18} /> Nouvelle analyse
        </button>
        <button className="dashboard-btn-outline">
          <FileText size={18} /> Voir toutes les demandes
        </button>
      </div>

      {/* Charts */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h3>Analyses par jour</h3>
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

      {/* Dernières analyses */}
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Dernières analyses</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentAnalyses.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`status-badge ${a.status === "Terminé" ? "done" : "pending"}`}>
                    {a.status}
                  </span>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTech;