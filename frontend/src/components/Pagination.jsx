import React from 'react'
import "./Pagination.css"
const Pagination = ({hasPrevPage,currentPage,goToPage,totalPages,hasNextPage}) => {
  return (
    <div className="pagination">
          <button 
            disabled={!hasPrevPage} 
            onClick={() => goToPage(currentPage - 1)}
          >
            ⬅ Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={!hasNextPage} 
            onClick={() => goToPage(currentPage + 1)}
          >
            Suivant ➡
          </button>
        </div>
  )
}

export default Pagination
