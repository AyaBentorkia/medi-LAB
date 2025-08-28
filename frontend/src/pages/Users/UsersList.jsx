import React, { useEffect, useState, useMemo } from "react"
import { Eye } from "lucide-react"
import axios from "axios";
import { GetAllUsers, UpdateUserStatus } from "../../apis/UsersApi";
import { useFilterStatus, useSearchFilter } from "../../hooks/useSerachFilter";
import { ROLES } from "../../Constants/Roles";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { ManageUserStatus } from "../../hooks/useFetchProfile";
const ProfileModal = React.lazy(() => import('../Profile/ProfileModal'));
const AddUserModal = React.lazy(()=> import ('./AddUserModal'))

  const UserRow = React.memo(({ 
    user, 
    onViewUser ,
    onUpdateStatus
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
        {/* <td>{user?.phoneNumber}</td> */}
        <td>{user?.CIN}</td>
        <td>{user?.role}</td>
        <td>
          <select
                      value={user?.status}
                      onChange={(e) =>
                        onUpdateStatus(user?.id, e.target.value)
                      }
                    >
                      <option value="Activé">Activé</option>
                      <option value="Desactivé">Desactivé</option>
                    </select>
        </td>
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
      const [isModalAddUserOpen, setIsModalAddUserOpen] = useState(false);
      const [statusChanged,setStatusChanged]=useState(false);
     const {
            users,setUsers,
            token,isLoading,setIsLoading,role
          }= useFetchUsers(statusChanged);
    
   const {
    data: filteredUsers,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    searchTerm,
    setSearch,
    selectedFilter,
    setFilter,
    hasNextPage,
    hasPrevPage
  } = usePagination(users, 10);

  
    const handleViewUser = React.useCallback((userId) => {
      setSelectedUserId(userId);
      setIsModalAddUserOpen(false);
      setIsModalOpen(true);
      console.log("user ID sélectionné :", userId)
    }, []);

    const handleAddUser= React.useCallback(() => {
      setIsModalOpen(false);
      setIsModalAddUserOpen(true);
    },[])

    const handleUpdateStatus= React.useCallback(async (userId,status)=>{
      try {
        
           const response = await UpdateUserStatus(token,userId,status);
           if (response.status === 200) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: status } 
            : user
        )
        
      );
      setStatusChanged(true);
      console.log("Statut mis à jour avec succes");
    } 
  }
    catch (error) {
      console.error("Error updating profile:", error.message);
  }
}, [setUsers]);
  return (
     <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des Users</h1>
              <p className="page-subtitle">
            {totalItems} utilisateur{totalItems !== 1 ? "s" : ""} trouvé
                {isLoading ? " (chargement...)" : ""}
              </p>
            </div>
            <button className="btn-primary-add" onClick={()=>setIsModalAddUserOpen(true)} >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau utilisateur
          </button>
          </div>
    
          {/* Search */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, CIN ou téléphone"
                value={searchTerm}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
          <select className="filter-select" value={selectedFilter} 
  onChange={(e) => setFilter(e.target.value)}
            >
            <option value="">Tous les roles</option>
            <option value={ROLES.PATIENT}>{ROLES.PATIENT}</option>
            <option value={ROLES.ANALYST}>{ROLES.ANALYST}</option>
            <option value={ROLES.SECRETARY}>{ROLES.SECRETARY}</option>
            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
          </select>
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
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
    
          {/* État vide (version alternative) */}
          {!isLoading && filteredUsers.length === 0 && searchTerm && (
            <div className="empty-state">
              <h3>Aucun utilisateur trouvé</h3>
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
          {isModalAddUserOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <AddUserModal 
                onClose={() => setIsModalAddUserOpen(false)} 
                token={token}
              />
            </React.Suspense>
          )}
          {/* Pagination */}
      {!isLoading && totalPages > 1 && (
       <Pagination 
       hasPrevPage={hasPrevPage}
       currentPage={currentPage}
       goToPage={goToPage}
       totalPages={totalPages}
       hasNextPage={hasNextPage}
       />
      )}
          
        </div>
  )
}

export default UsersList
