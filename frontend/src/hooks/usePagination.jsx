// usePagination.jsx
import { useMemo, useState } from "react";

export const usePagination = (data = [], itemsPerPage = 10, dataType = "user") => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Filtrer les données basé sur search et filter
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    return data.filter(item => {
      // Filtre de recherche selon le type de donnée
      let matchesSearch = searchTerm === "";
      
      if (searchTerm !== "") {
        if (dataType === "user") {
          matchesSearch = 
            item.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.CIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phoneNumber?.includes(searchTerm);
        } else if (dataType === "request") {
          matchesSearch = 
            item.patient?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patient?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patient?.CIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.patient?.id?.toString().includes(searchTerm) ||
            item.id?.toString().includes(searchTerm);
        }  else if (dataType === "type") {
          matchesSearch = 
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id?.toString().includes(searchTerm);
        }
      }
      
      // Filtre selon le type de données
      let matchesFilter = selectedFilter === "";
      if (selectedFilter !== "") {
        if (dataType === "user") {
          matchesFilter = item.role === selectedFilter;
        } else if (dataType === "request") {
          matchesFilter = item.status === selectedFilter;
        } else if (dataType === "type") {
          matchesFilter = item.status === selectedFilter;
        }
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, selectedFilter, dataType]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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