import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@/api/endpoint";
import httpClient from "@/api/http-client";
import { NoticeData } from "@/@types/noticeData"; 

export interface NoticeTrackerState {
    notices: NoticeData[];
    loading: boolean;
    error: string | null;
    selectedNotice: NoticeData | null;
}

const initialState: NoticeTrackerState = {
    notices: [],
    loading: false,
    error: null,
    selectedNotice: null,
};

// Fetch all notices
export const fetchNotices = createAsyncThunk(
    'noticeTracker/fetchNotices',
    async () => {
        const { data } = await httpClient.get(endpoints.noticeTracker.list());
        return data;
    }
);

// Create new notice
export const createNotice = createAsyncThunk(
    'noticeTracker/createNotice',
    async (noticeData: Partial<NoticeData>, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post(endpoints.noticeTracker.create(), noticeData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create notice');
        }
    }
);

// Fetch notice by ID
export const fetchNoticeById = createAsyncThunk(
    'noticeTracker/fetchNoticeById',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.get(endpoints.noticeTracker.detail(id));
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notice');
        }
    }
);

// Update notice
export const updateNotice = createAsyncThunk(
    'noticeTracker/updateNotice',
    async ({ id, noticeData }: { id: string; noticeData: Partial<NoticeData> }, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.put(endpoints.noticeTracker.update(id), noticeData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update notice');
        }
    }
);



// Delete notice
export const deleteNotice = createAsyncThunk(
    'noticeTracker/deleteNotice',
    async (id: string, { rejectWithValue }) => {
        try {
            await httpClient.delete(endpoints.noticeTracker.delete(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notice');
        }
    }
);

const noticeTrackerSlice = createSlice({
    name: 'noticeTracker',
    initialState,
    reducers: {
        setSelectedNotice: (state, action) => {
            state.selectedNotice = action.payload;
        },
        clearSelectedNotice: (state) => {
            state.selectedNotice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Notices
            .addCase(fetchNotices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotices.fulfilled, (state, action) => {
                state.loading = false;
                state.notices = action.payload;
            })
            .addCase(fetchNotices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch notices';
            })
            // Create Notice
            .addCase(createNotice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNotice.fulfilled, (state, action) => {
                state.loading = false;
                state.notices = [...state.notices, action.payload];
            })
            .addCase(createNotice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Notice by ID
            .addCase(fetchNoticeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNoticeById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedNotice = action.payload;
            })
            .addCase(fetchNoticeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Notice
            .addCase(updateNotice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNotice.fulfilled, (state, action) => {
                state.loading = false;
                state.notices = state.notices.map(notice => 
                    notice.id === action.payload.id ? action.payload : notice
                );
            })
            .addCase(updateNotice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Notice
            .addCase(deleteNotice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotice.fulfilled, (state, action) => {
                state.loading = false;
                // state.notices = state.notices.filter(notice => notice.id.toString() !== action.payload);
            })
            .addCase(deleteNotice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedNotice, clearSelectedNotice } = noticeTrackerSlice.actions;
export default noticeTrackerSlice.reducer;