import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import type { AppDispatch } from '..';
import type { ApiResponse } from '../../types';
import type { AuthRequestDTO, User } from './types';
import { wsConnect } from '../socket';

// Định nghĩa lại kiểu dữ liệu của API calls để TypeScript hiểu rõ
const authApi = {
    login: (credentials: AuthRequestDTO): Promise<{ data: ApiResponse<string> }> => axiosClient.post('/auth/login', credentials),
    logout: (): Promise<{ data: ApiResponse<string> }> => axiosClient.post('/auth/logout'),
    fetchCurrentUser: (): Promise<{ data: ApiResponse<User> }> => axiosClient.get('/users/me'),
    register: (credentials: AuthRequestDTO): Promise<{ data: ApiResponse<string> }> => axiosClient.post('/auth/register', credentials),
};

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.fetchCurrentUser();
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Not authenticated');
        }
    }
);

export const loginUser = createAsyncThunk<User, AuthRequestDTO, { dispatch: AppDispatch; rejectValue: string }>(
    'auth/login',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            await authApi.login(credentials);
            const userAction = await dispatch(fetchCurrentUser());
            if (fetchCurrentUser.fulfilled.match(userAction)) {
                // Dispatch action để middleware bắt và kết nối WebSocket
                dispatch(wsConnect());
                return userAction.payload;
            } else {
                throw new Error('Failed to fetch user after login.');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
        }
    }
);

export const registerUser = createAsyncThunk<void, AuthRequestDTO, { rejectValue: string }>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            // Destructure để đảm bảo chỉ gửi username và password
            const { username, password } = credentials;
            await axiosClient.post('/auth/register', { username, password });
            // Đăng ký thành công không trả về dữ liệu gì, chỉ là trạng thái fulfilled
        } catch (error: any) {
            // Trả về message lỗi từ backend (ví dụ: "Username is already taken!")
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);