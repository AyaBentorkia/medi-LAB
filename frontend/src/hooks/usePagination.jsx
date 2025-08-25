import { useMemo, useState } from "react";

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Filtrer les données basé sur search et filter
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    return data.filter(user => {
      const matchesSearch = searchTerm === "" || 
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.CIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm);
      
      const matchesFilter = selectedFilter === "" || user.role === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, selectedFilter]);

  // calculer la pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // donnees de la page courante
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // changement de page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // renitialiser à la page 1 quand search/filter change
  const setSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const setFilter = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  return {
    data: paginatedData,
    allData: filteredData,
    
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    
    searchTerm,
    setSearch,
    selectedFilter,
    setFilter,
    
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};