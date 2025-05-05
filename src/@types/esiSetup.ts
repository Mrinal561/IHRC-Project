export type EsiSetupData = {
    id: number;
    uuid: string;
    record_id: string;
    group_id: number;
    company_id: number;
    code_Type: string;
    code: string;
    district: number;
    location: string;
    esi_user: string;
    password: string;
    signatory_data: {
        signatory_id: number;
    }[]; 
    certificate?: {
        data: string;
        filename: string;
        mimetype: string;
    };
    email:string;
    mobile_number:string;
}

export type EsiSetupResponseData = {
    esisetup: EsiSetupData[];
    Loading: boolean;
    error: string | null;
}
