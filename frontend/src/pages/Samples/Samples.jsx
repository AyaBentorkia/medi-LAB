import React, { useState } from 'react';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useFetchSamples } from '../../hooks/useSamples';
const AddNewSampleModal = React.lazy(() => import('./AddSampleModal.jsx'));
const EditSampleModal= React.lazy(() => import('./EditSampleModal.jsx'));

const SampleRow = React.memo(({ 
    sample, 
    onUpdateSample
  }) => {
    return (
      <tr >
        <td>
          {sample?.id}
        </td>
        <td>
          <div className="patient-info">
            <div className="patient-details">
              <div className="patient-name">{sample?.title}</div>
            </div>
          </div>
        </td>
        <td>{sample?.createdAt.split("T")[0]}</td>
        <td>
          <div className="actions">
          
             <button 
              className="btn-icon-add-file" 
              onClick={() => onUpdateSample(sample)}
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
const Samples = () => {
const [selectedsampleId, setSelectedSampleId] = useState(null);
      const [isModalAddsampleOpen, setIsModalAddsampleOpen] = useState(false);
      const [sample,setSample]=useState({});
     const {
        
        isLoading,
        samples,
        isUpdateModalOpen,setIsUpdateModalOpen,
      }= useFetchSamples();
      // const {sample}=fetchOnesample(selectedsampleId);
    
   const {
    data: filteredsamples,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    searchTerm,
    setSearch,
    hasNextPage,
    hasPrevPage
  } = usePagination(samples, 10, 'sample');

  


    const handleAddsample= React.useCallback(() => {
      setIsUpdateModalOpen(false);
      setIsModalAddsampleOpen(true);
    },[])

     const handleUpdateAnalysissample= React.useCallback((sample) => {
      setSelectedSampleId(sample.id);
      setSample(sample);
      setIsModalAddsampleOpen(false);
      setIsUpdateModalOpen(true);
      
    },[])

  
  return (
     <div className="patients-list-container">
          {/* Header */}
          <div className="patients-header">
            <div className="header-content">
              <h1 className="page-title">Liste des types de prelevement </h1>
              <p className="page-subtitle">
            {totalItems} prelevement{totalItems !== 1 ? "s" : ""} trouvé
                {isLoading ? " (chargement...)" : ""}
              </p>
            </div>
            <button className="btn-primary-add" onClick={()=>handleAddsample(true)} >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau prelevement d'analyse
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
                ) : filteredsamples.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Aucun sample trouvé
                    </td>
                  </tr>
                ) : (
                  filteredsamples.map((sample) => (
                    <SampleRow
                      key={sample?.id}
                      sample={sample}
                      onUpdateSample={handleUpdateAnalysissample}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
    
          {/* État vide (version alternative) */}
          {!isLoading && filteredsamples.length === 0 && searchTerm && (
            <div className="empty-state">
              <h3>Aucun prelevement trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
          
          
          {isModalAddsampleOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <AddNewSampleModal 
                onClose={() => setIsModalAddsampleOpen(false)} 
              />
            </React.Suspense>
          )}
            {isUpdateModalOpen && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <EditSampleModal 
              selectedsampleId={selectedsampleId}
              sample={sample}
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


export default Samples
