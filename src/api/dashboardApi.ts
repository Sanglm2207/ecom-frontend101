import type { DashboardStats } from '../store/dashboard';
import type { ApiResponse } from '../types';
import axiosClient from './axiosClient';

const dashboardApi = {
    getStats: (params: { startDate?: string; endDate?: string }): Promise<{ data: ApiResponse<DashboardStats> }> => {
        const searchParams = new URLSearchParams(params as any);
        return axiosClient.get(`/dashboard/stats?${searchParams.toString()}`);
    },
};

export default dashboardApi;