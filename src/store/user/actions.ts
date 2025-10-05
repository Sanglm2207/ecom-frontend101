import { createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../api/adminApi';
import type { Page } from '../../types';
import type { User } from '../auth';

interface FetchUsersParams {
    page: number;
    size: number;
    sort?: string;
    filter?: string;
}

// Action để lấy danh sách user cho trang quản trị
export const fetchAdminUsers = createAsyncThunk<Page<User>, FetchUsersParams>(
    'user/fetchAdminUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminApi.getUsers(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Action để cập nhật vai trò của user
export const updateUserRole = createAsyncThunk<User, { userId: number; role: string }>(
    'user/updateRole',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            const response = await adminApi.updateUserRole(userId, role);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
        }
    }
);

// Action để xóa user
export const deleteUser = createAsyncThunk<number, { userId: number }>(
    'user/deleteUser',
    async ({ userId }, { rejectWithValue }) => {
        try {
            await adminApi.deleteUser(userId);
            return userId; // Trả về ID của user đã bị xóa
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);