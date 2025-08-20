import React from 'react'

const AnalysisReqHeader = ({ filteredRequests, setIsModalAddReqOpen, role, setSearchTerm, searchTerm }) => {
  return (
    <><div className="patients-header">
        <div className="header-content">
          <h1 className="page-title">Liste des Demandes d'analyse</h1>
          <p className="page-subtitle">
            {filteredRequests.length} demande
            {filteredRequests.length > 1 ? "s" : ""} trouvé
          </p>
        </div>
        {role === "Secrétaire d'accueil" && (
          <button className="btn-primary-add" onClick={() => setIsModalAddReqOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouvelle Demande
          </button>
        )}
      </div>
       <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
         <div className="filters">
          <select className="filter-select">
            <option value="">Tous les statuts</option>
            <option value="Terminé">Terminé</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
          </select>
        </div>
        
      </div>
      </>
  )
}

export default AnalysisReqHeader
