import { useMemo, useState } from "react";

export const useSearchFilter = (data,accessorFn)=>{
        const [searchTerm, setSearchTerm] = useState("");
    const searchFilter= useMemo(()=>{
        if(!data.length ) return [];
        return data.filter((item) => {
      const value = accessorFn(item).toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, accessorFn]);
    return {
        searchTerm,setSearchTerm,
        searchFilter,
    }
}
export const useFilterStatus = (data,statusKey = "status")=>{
    const [selectedFilter,setSelectedFilter]=useState('');
    const filteredData= useMemo(()=> {
        if (!data.length) return [];
        if (!selectedFilter) return data;

    return data.filter((item) => item[statusKey] === selectedFilter);
  }, [data, selectedFilter, statusKey]);

  return {
    selectedFilter,
    setSelectedFilter,
    filteredData,
  };

    
}