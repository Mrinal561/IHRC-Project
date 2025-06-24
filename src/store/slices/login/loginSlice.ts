

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '@/interface/interface'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface LoginCredentials {
    userName: string
    password: string
}

export type LoginState = {
    type: string
    loading: boolean
    user?: any
    authenticated: boolean
    loginLoading: boolean
    error?: string
}

const initialState: LoginState = {
    type: '',
    loading: true,
    authenticated: false,
    loginLoading: false,
}

export const fetchAuthUser = createAsyncThunk(
    'auth/fetchAuthUser',
    async () => {
        const { data } = await httpClient.get(endpoints.auth.profile())
        return data
    },
)

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post(endpoints.auth.login(), {
                email: credentials.userName,
                password: credentials.password,
            })
            return data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed',
            )
        }
    },
)

const loginSlice = createSlice({
    name: `auth`,
    initialState,
    reducers: {
        setIsAuthenticated: (
            state,
            action: PayloadAction<LoginState['authenticated']>,
        ) => {
            state.authenticated = action.payload
        },

        setLoginUser(
            state,
            action: PayloadAction<LoginState['user'] | undefined>,
        ) {
            state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthUser.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAuthUser.fulfilled, (state, action) => {
                state.loading = false
                if (!action.payload) {
                    return
                }
                state.user = action.payload
                state.type = action.payload.type
            })
            .addCase(fetchAuthUser.rejected, (state) => {
                state.loading = false
                state.user = undefined
                state.type = ''
            })
            .addCase(login.pending, (state) => {
                state.loginLoading = true
                state.error = undefined
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginLoading = false
                state.authenticated = true
                state.user = action.payload
                state.error = undefined
            })
            .addCase(login.rejected, (state, action) => {
                state.loginLoading = false
                state.authenticated = false
                state.error = action.payload as string
            })
    },
})

export const { setLoginUser, setIsAuthenticated } = loginSlice.actions
export default loginSlice.reducer
