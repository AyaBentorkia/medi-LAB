"use client"

import { useState } from "react"
import "./PatientsList.css"

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "Marie Dubois",
      age: 34,
      phone: "01 23 45 67 89",
      email: "marie.dubois@email.com",
      lastVisit: "2024-01-15",
      status: "active",
      condition: "Consultation générale",
    },
    {
      id: 2,
      name: "Jean Martin",
      age: 45,
      phone: "01 98 76 54 32",
      email: "jean.martin@email.com",
      lastVisit: "2024-01-12",
      status: "inactive",
      condition: "Suivi cardiologique",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      age: 28,
      phone: "01 11 22 33 44",
      email: "sophie.laurent@email.com",
      lastVisit: "2024-01-18",
      status: "active",
      condition: "Dermatologie",
    },
    {
      id: 4,
      name: "Pierre Moreau",
      age: 52,
      phone: "01 55 66 77 88",
      email: "pierre.moreau@email.com",
      lastVisit: "2024-01-10",
      status: "pending",
      condition: "Orthopédie",
    },
    {
      id: 5,
      name: "Claire Rousseau",
      age: 39,
      phone: "01 44 55 66 77",
      email: "claire.rousseau@email.com",
      lastVisit: "2024-01-16",
      status: "active",
      condition: "Gynécologie",
    },
  ]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || patient.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Actif", class: "status-active" },
      inactive: { label: "Inactif", class: "status-inactive" },
      pending: { label: "En attente", class: "status-pending" },
    }

    return statusConfig[status] || { label: status, class: "status-default" }
  }

  return (
    <div className="patients-list-container">
      {/* Header */}
      <div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Patients</h1>
          <p className="page-subtitle">
            {filteredPatients.length} patient{filteredPatients.length > 1 ? "s" : ""} trouvé
            {filteredPatients.length > 1 ? "s" : ""}
          </p>
        </div>
        <button className="add-patient-btn">
          <span className="btn-icon">+</span>
          Nouveau Patient
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-container">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Patients List */}
      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Aucun patient trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-header">
                <div className="patient-avatar">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="patient-info">
                  <h3 className="patient-name">{patient.name}</h3>
                  <p className="patient-age">{patient.age} ans</p>
                </div>
                <div className={`status-badge ${getStatusBadge(patient.status).class}`}>
                  {getStatusBadge(patient.status).label}
                </div>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <span className="detail-icon">📞</span>
                  <span className="detail-text">{patient.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">✉️</span>
                  <span className="detail-text">{patient.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🏥</span>
                  <span className="detail-text">{patient.condition}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">
                    Dernière visite: {new Date(patient.lastVisit).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="patient-actions">
                <button className="action-btn primary">Voir Détails</button>
                <button className="action-btn secondary">Modifier</button>
                <button className="action-btn tertiary">Rendez-vous</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PatientsList
