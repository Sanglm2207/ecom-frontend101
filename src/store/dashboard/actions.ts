import { createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../../api/dashboardApi';
import type { DashboardStats } from './types';

interface FetchDashboardStatsParams {
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD
}

export const fetchDashboardStats = createAsyncThunk<DashboardStats, FetchDashboardStatsParams>(
    'dashboard/fetchStats',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await dashboardApi.getStats(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);