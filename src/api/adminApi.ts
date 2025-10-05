import type { User } from '../store/auth';
import type { ApiResponse, Page } from '../types';
import axiosClient from './axiosClient';

const adminApi = {
    getUsers: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<User>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/users?${searchParams.toString()}`);
    },
    updateUserRole: (userId: number, role: string): Promise<{ data: ApiResponse<User> }> => {
        return axiosClient.put(`/users/${userId}/role`, { role });
    },
    deleteUser: (userId: number): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.delete(`/users/${userId}`);
    },
};

export default adminApi;