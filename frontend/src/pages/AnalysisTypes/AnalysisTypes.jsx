import React, { useState } from 'react'
import { useFetchTypes } from '../../hooks/useTypes';
import { Eye, Pencil, Trash } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import ViewTypeModal from './ViewTypeModal';
const AddNewTypeModal = React.lazy(() => import('./AddNewTypeModal.jsx'));
const EditAnalysisTypeModal= React.lazy(() => import('./EditAnalysisTypeModal'));

const TypeRow = React.memo(({ 
    type, 
    onViewType ,
    onUpdateType
  }) => {
    return (
      <tr >
        <td>
          {type?.id}
        </td>
        <td>
          <div className="patient-info">
            <div className="patient-details">
              <div className="patient-name">{type?.title}</div>
            </div>
          </div>
        </td>
        <td>{type?.StandardValue}</td>
        {/* <td>{type?.phoneNumber}</td> */}
        <td>{type?.createdAt.split("T")[0]}</td>
        <td>
          <div className="actions">
            <button 
              className="btn-icon" 
              onClick={() => onViewType(type?.id)}
            >
              <Eye size={18} /> 
            </button>
             <button 
              className="btn-icon-add-file" 
              onClick={() => onUpdateType(type)}
            >
              <Pencil size={18} /> 
            </button>
             <button 
              className="btn-icon-delete-file" 
            >
              <Trash size={18} /> 
            </button>
          </div>
        </td>
      </tr>
    );
  });

const AnalysisTypes =  () => {
    const [selectedtypeId, setSelectedtypeId] = useState(null);
      const [isModalAddtypeOpen, setIsModalAddtypeOpen] = useState(false);
      const [isModalViewOpen,setIsModalViewOpen]=useState(false);
      const [type,setType]=useState({});
     const {
        token,role,
        isLoading,setIsLoading,
        types,setTypes,handleUpdateType,
        isUpdateModalOpen,setIsUpdateModalOpen,
      }= useFetchTypes();
      // const {type}=fetchOneType(selectedtypeId);
    
   const {
    data: filteredtypes,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    searchTerm,
    setSearch,
    hasNextPage,
    hasPrevPage
  } = usePagination(types, 10, 'type');

  
    const handleViewtype = React.useCallback((typeId) => {
      setSelectedtypeId(typeId);
      setIsModalAddtypeOpen(false);
      setIsUpdateModalOpen(false);
      setIsModalViewOpen(true);
      console.log("type ID sélectionné :", typeId)
    }, []);

    const handleAddtype= React.useCallback(() => {
      setIsModalViewOpen(false);
      setIsUpdateModalOpen(false);
      setIsModalAddtypeOpen(true);
    },[])

     const handleUpdateAnalysisType= React.useCallback((type) => {
      setSelectedtypeId(type.id);
      setType(type);
      setIsModalViewOpen(false);
      setIsModalAddtypeOpen(false);
      setIsUpdateModalOpen(true);
      
    },[])

  
  return (
     <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des types d'analyse </h1>
              <p className="page-subtitle">
            {totalItems} types d'analyse {totalItems !== 1 ? "s" : ""} trouvé
                {isLoading ? " (chargement...)" : ""}
              </p>
            </div>
            <button className="btn-primary-add" onClick={()=>handleAddtype(true)} >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau type d'analyse
          </button>
          </div>
    
          {/* Search */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher par titre ou bien id"
                value={searchTerm}
                onChange={(e) => setSearch(e.target.value)}
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
                  <th>Titre</th>
                  <th>Valeur standard</th>
                  <th>Date de création</th>
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
                ) : filteredtypes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Aucun type trouvé
                    </td>
                  </tr>
                ) : (
                  filteredtypes.map((type) => (
                    <TypeRow
                      key={type?.id}
                      type={type}
                      onViewType={handleViewtype}
                      onUpdateType={handleUpdateAnalysisType}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
    
          {/* État vide (version alternative) */}
          {!isLoading && filteredtypes.length === 0 && searchTerm && (
            <div className="empty-state">
              <h3>Aucun utilisateur trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
          
          {isModalViewOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <ViewTypeModal 
                selectedtypeId={selectedtypeId} 
                onClose={() => setIsModalViewOpen(false)} 
              />
            </React.Suspense>
          )}
          {isModalAddtypeOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <AddNewTypeModal 
                onClose={() => setIsModalAddtypeOpen(false)} 
              />
            </React.Suspense>
          )}
            {isUpdateModalOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <EditAnalysisTypeModal 
              selectedtypeId={selectedtypeId}
              type={type}
                onClose={() => setIsUpdateModalOpen(false)
                } 
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


export default AnalysisTypes
