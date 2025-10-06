import type { ApiResponse } from '../types';
import axiosClient from './axiosClient';

const notificationApi = {
    getMyUnreadNotifications: (): Promise<{ data: ApiResponse<Notification[]> }> => {
        return axiosClient.get('/notifications');
    },
    markAsRead: (notificationId: number): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.post(`/notifications/${notificationId}/mark-as-read`);
    },
    markAllAsRead: (): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.post('/notifications/mark-all-as-read'); // Cần thêm API này ở backend
    },
};
export default notificationApi;