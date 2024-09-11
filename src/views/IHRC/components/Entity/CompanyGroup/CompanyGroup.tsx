import React, { useState, useEffect } from 'react';
import CompanyGroupTool from './components/CompanyGroupTool';
import CompanyTable from './components/CompanyTable';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { EntityData } from '@/views/IHRC/store/dummyEntityData';  // Adjust import path as needed

const CompanyGroup = () => {
  const [entityDataList, setEntityDataList] = useState<EntityData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('entityDataList');
    if (storedData) {
      setEntityDataList(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('entityDataList', JSON.stringify(entityDataList));
  }, [entityDataList]);

  const addCompanyGroup = (newEntityData: EntityData) => {
    setEntityDataList(prevList => [...prevList, newEntityData]);
  };
  const handleDelete = (index: number) => {
    const updatedList = entityDataList.filter((_, i) => i !== index);
    setEntityDataList(updatedList);
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Company Group Name Manager</h3>
        </div>
        <CompanyGroupTool addCompanyGroup={addCompanyGroup} />
      </div>
      <CompanyTable data={entityDataList} onDelete={handleDelete} />
    </AdaptableCard>
  );
};

export default CompanyGroup;