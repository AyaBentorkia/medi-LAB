import React, { useEffect, useState, useMemo } from "react"
import { Eye } from "lucide-react"
import axios from "axios";
import { GetAllUsers } from "../../apis/UsersApi";
const ProfileModal = React.lazy(() => import('../Profile/ProfileModal'));

  const UserRow = React.memo(({ 
    user, 
    onViewUser 
  }) => {
    return (
      <tr >
        <td>
          {user?.id}
        </td>
        <td>
          <div className="patient-info">
            <div className="patient-avatar">
              {`${user?.firstname[0]}${user?.lastname[0]}`}
            </div>
            <div className="patient-details">
              <div className="patient-name">{`${user?.firstname} ${user?.lastname}`}</div>
            </div>
          </div>
        </td>
        <td>{user?.birth_date}</td>
        <td>{user?.phoneNumber}</td>
        <td>{user?.CIN}</td>
        <td>{user?.role}</td>
        <td>
          <div className="actions">
            <button 
              className="btn-icon" 
              onClick={() => onViewUser(user?.id)}
            >
              <Eye size={18} /> 
            </button>
          </div>
        </td>
      </tr>
    );
  });
const UsersList = () => {

    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState([])
    const token = localStorage.getItem("token");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        // Vérifier si les données sont déjà en cache
        const cacheKey = 'users_data';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const now = new Date().getTime();
        // Utiliser les données en cache si elles existent et sont récentes (moins de 5 minutes)
        if (cachedData && cacheTimestamp && now - cacheTimestamp < 300000) {
          setUsers(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
        
        try {
          setIsLoading(true);
          const response = await GetAllUsers(token);
          
          setUsers(response?.data?.users);
          
          // Mettre en cache les données (Solution 5)
          localStorage.setItem(cacheKey, JSON.stringify(response?.data?.users));
          localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
          
        } catch (error) {
          console.error("Error fetching users:", error);
          
          // En cas d'erreur, essayer d'utiliser les données en cache si disponibles
          if (cachedData) {
            setUsers(JSON.parse(cachedData));
          }
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchUsers();
    }, [token]);
  
    // Solution 6: Utilisation de useMemo pour optimiser le filtrage
    const filteredUsers = useMemo(() => {
      if (!users.length) return [];
      
      return users.filter((user) => {
        const fullName = `${user?.firstname || ''} ${user?.lastname || ''}`.toLowerCase();
        const cin = user?.CIN || '';
        const phone = user?.phoneNumber || '';
        
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          cin.includes(searchTerm) ||
          phone.includes(searchTerm)
        );
      });
    }, [users, searchTerm]);
  
    // Mémoriser la fonction de sélection pour éviter des rendus inutiles
  
  
    const handleViewUser = React.useCallback((userId) => {
      setSelectedUserId(userId);
      setIsModalOpen(true);
      console.log("user ID sélectionné :", userId)
    }, []);
  return (
     <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des Users</h1>
              <p className="page-subtitle">
                {filteredUsers.length} patient
                {filteredUsers.length !== 1 ? "s" : ""} trouvé
                {isLoading ? " (chargement...)" : ""}
              </p>
            </div>
          </div>
    
          {/* Search */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, CIN ou téléphone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
    
          {/* Tableau Patients */}
          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>
                  <th>Nom & Prénom</th>
                  <th>Date de Naissance</th>
                  <th>Téléphone</th>
                  <th>CIN</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="loading-skeleton">
                      Chargement des données...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Aucun patient trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserRow
                      key={user?.id}
                      user={user}
                      onViewUser={handleViewUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
    
          {/* État vide (version alternative) */}
          {!isLoading && filteredUsers.length === 0 && searchTerm && (
            <div className="empty-state">
              <h3>Aucun patient trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
          
          {isModalOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <ProfileModal 
                patientId={selectedUserId} 
                onClose={() => setIsModalOpen(false)} 
                token={token}
              />
            </React.Suspense>
          )}
        </div>
  )
}

export default UsersList
