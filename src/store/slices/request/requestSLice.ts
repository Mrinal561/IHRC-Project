import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the interface for the request payload
interface CompanyAdminRequestPayload {
  type: string;
  reason_for_request: string;
}

// Define the initial state type
interface CompanyAdminRequestState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

// Initial state
const initialState: CompanyAdminRequestState = {
  loading: false,
  success: false,
  error: null
};

// Create the async thunk for the admin request
export const requestCompanyEdit = createAsyncThunk(
  'companyAdminRequest/requestEdit',
  async (
    { 
      id, 
      payload 
    }: { 
      id: any, 
      payload: CompanyAdminRequestPayload 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await httpClient.post(
        endpoints.request.requestEditApproval(), 
        { ...payload, tracker_id: id }
      );
      return response.data;
    } catch (error: any) {
      // Handle error responses
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while requesting admin edit'
      );
    }
  }
);

// Create the slice
const companyAdminRequestSlice = createSlice({
  name: 'companyAdminRequest',
  initialState,
  reducers: {
    // Reset the state to initial conditions
    resetCompanyAdminRequest: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestCompanyEdit.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(requestCompanyEdit.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(requestCompanyEdit.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { resetCompanyAdminRequest } = companyAdminRequestSlice.actions;
export default companyAdminRequestSlice.reducer;