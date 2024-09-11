import React, { useState, useEffect } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import CompanyNameTable from './components/CompanyNameTable';
import CompanyNameTool from './components/CompanyNameTool';

interface EntityData {
  Company_Group_Name: string;
  Company_Name: string;
}

const CompanyName = () => {
  const [entityDataList, setEntityDataList] = useState<EntityData[]>(() => {
    const savedData = localStorage.getItem('entityDataList');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('entityDataList', JSON.stringify(entityDataList));
  }, [entityDataList]);

  const updateCompanyName = (companyGroupName: string, newCompanyName: string) => {
    setEntityDataList(prevList => 
      prevList.map(item => 
        item.Company_Group_Name === companyGroupName
          ? { ...item, Company_Name: newCompanyName }
          : item
      )
    );
  };

  const handleDelete = (companyGroupName: string) => {
    const updatedList = entityDataList.filter(item => item.Company_Group_Name !== companyGroupName);
    setEntityDataList(updatedList);
  };

  const companyGroupNames = entityDataList.map(item => item.Company_Group_Name);

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Company Name Manager</h3>
        </div>
        <CompanyNameTool updateCompanyName={updateCompanyName} companyGroupNames={companyGroupNames} />
      </div>
      <CompanyNameTable data={entityDataList} onDelete={handleDelete} />
    </AdaptableCard>
  );
};

export default CompanyName;