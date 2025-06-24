import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { AxiosError } from 'axios';

export interface AuditorData {
    id?: number;
    group_id?: number;
    company_id?: number;
    firm_name?: string;
    name?: string;
    email?: string;
    mobile?: string;
    audit_frequency?: string;
    created_at?: string;
    group_name?: string;
    company_name?: string;
}

export interface AuditorState {
    auditors: AuditorData[];
    loading: boolean;
    error: string | null;
    selectedAuditor: AuditorData | null;
}

const initialState: AuditorState = {
    auditors: [],
    loading: false,
    error: null,
    selectedAuditor: null,
};

export const fetchAuditors = createAsyncThunk(
    'auditor/fetchAll',
    async (params: { 
        page: number; 
        page_size: number; 
        search?: string;
    }, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.get(endpoints.auditor.listAuditor(), { 
                params: {
                    page: params.page,
                    page_size: params.page_size,
                    search: params.search || '',
                }
            });
            return data;
        } catch (error: any) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch auditors');
        }
    }
);

export const createAuditor = createAsyncThunk(
    'auditor/create',
    async (auditorData: AuditorData, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post(endpoints.auditor.auditorCreate(), auditorData);
            return data;
        } catch (error: any) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || 'Failed to create auditor');
        }
    }
);

export const updateAuditor = createAsyncThunk(
    'auditor/update',
    async ({ id, data }: { id: string; data: Partial<AuditorData> }, { rejectWithValue }) => {
        try {
            const response = await httpClient.put(endpoints.auditor.auditorUpdate(id), data);
            return response.data;
        } catch (error: any) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || 'Failed to update auditor');
        }
    }
);

export const deleteAuditor = createAsyncThunk(
    'auditor/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.delete(endpoints.auditor.auditorDelete(id));
            return data;
        } catch (error: any) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || 'Failed to delete auditor');
        }
    }
);

export const fetchAuditorById = createAsyncThunk(
    'auditor/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.get(endpoints.auditor.auditorDetail(id));
            return data;
        } catch (error: any) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch auditor');
        }
    }
);

const auditorSlice = createSlice({
    name: 'auditor',
    initialState,
    reducers: {
        setSelectedAuditor: (state, action) => {
            state.selectedAuditor = action.payload;
        },
        clearSelectedAuditor: (state) => {
            state.selectedAuditor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch auditors
            .addCase(fetchAuditors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditors.fulfilled, (state, action) => {
                state.loading = false;
                state.auditors = action.payload.data;
            })
            .addCase(fetchAuditors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create auditor
            .addCase(createAuditor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAuditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createAuditor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update auditor
            .addCase(updateAuditor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAuditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateAuditor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete auditor
            .addCase(deleteAuditor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAuditor.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteAuditor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch auditor by ID
            .addCase(fetchAuditorById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditorById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAuditor = action.payload;
            })
            .addCase(fetchAuditorById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.selectedAuditor = null;
            });
    },
});

export const { setSelectedAuditor, clearSelectedAuditor } = auditorSlice.actions;

export const selectAuditors = (state: { auditor: AuditorState }) => state.auditor.auditors;
export const selectLoading = (state: { auditor: AuditorState }) => state.auditor.loading;
export const selectError = (state: { auditor: AuditorState }) => state.auditor.error;
export const selectSelectedAuditor = (state: { auditor: AuditorState }) => state.auditor.selectedAuditor;

export default auditorSlice.reducer;