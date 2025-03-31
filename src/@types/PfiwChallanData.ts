export type PfiwChallanData = {
    id: number;
  PfSetup: {
    pf_code: string;
    CompanyGroup: {
      name: string;
    };
    Company: {
      name: string;
    };
    Location: {
      name: string;
    };
  };
  payroll_month: string;
  payment_due_date: string;
  payment_date: string;
  delay_in_days: number;
  delay_reason: string;
  challan_document: string;
  status: string;
  uploaded_by: number;
  is_requested?: boolean;
  iseditable?: boolean;
  created_at: string; // or Date if parsed
    updated_at: string;
    UploadBy: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      mobile: string | null;
  };
}