import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchDashboardStats } from './actions';
import type { DashboardState, DashboardStats } from './types';

const initialState: DashboardState = {
    stats: null,
    loading: 'idle',
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Các reducer đồng bộ nếu cần
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
                state.loading = 'idle';
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;