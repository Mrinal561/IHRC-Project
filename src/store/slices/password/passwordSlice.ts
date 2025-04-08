import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "@/api/http-client";
import { endpoints } from "@/api/endpoint";

// Types
export type ForgotPasswordRequest = {
    email: string;
};

export type ResetPasswordRequest = {
    token: string;
    password: string;
    // confirmPassword: string;
};

export interface PasswordRecoveryState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: PasswordRecoveryState = {
    loading: false,
    success: false,
    error: null,
};

// Async thunks
export const forgotPassword = createAsyncThunk(
    'passwordRecovery/forgotPassword',
    async (data: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await httpClient.post(endpoints.forgotpassword.forgot(), data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to process forgot password request');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'passwordRecovery/resetPassword',
    async (data: ResetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await httpClient.post(endpoints.forgotpassword.reset(), data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

const passwordRecoverySlice = createSlice({
    name: 'passwordRecovery',
    initialState,
    reducers: {
        clearState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Forgot Password cases
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // Reset Password cases
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearState } = passwordRecoverySlice.actions;
export default passwordRecoverySlice.reducer;