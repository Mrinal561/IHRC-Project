export interface RegisterSetupData {
  id?: number;
  company_id: number;
  name_of_industry: string;
  address: string;
  name_of_employer: string;
  Company?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface RegisterSetupTableProps {
  data: RegisterSetupData[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newData: RegisterSetupData) => void;
  isLoading: boolean;
  onRefresh: () => void;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}