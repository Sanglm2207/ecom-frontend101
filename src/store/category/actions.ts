import { createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';
import type { Category } from '../product';

export const fetchCategories = createAsyncThunk<Category[]>(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryApi.getAllCategories();
            // API /categories trả về Page, chúng ta cần lấy content
            return (response.data.data as any).content || response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch categories');
        }
    }
);