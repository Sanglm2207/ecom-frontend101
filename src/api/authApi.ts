import type { AuthRequestDTO, User } from '../store/auth/types';
import type { ApiResponse } from '../types';
import axiosClient from './axiosClient';

const authApi = {
    login: (credentials: AuthRequestDTO): Promise<ApiResponse<string>> => {
        return axiosClient.post('/auth/login', credentials);
    },

    register: (credentials: AuthRequestDTO): Promise<ApiResponse<string>> => {
        return axiosClient.post('/auth/register', credentials);
    },

    logout: (): Promise<ApiResponse<string>> => {
        return axiosClient.post('/auth/logout');
    },

    fetchCurrentUser: (): Promise<ApiResponse<User>> => {
        return axiosClient.get('/users/me');
    },
};

export default authApi;