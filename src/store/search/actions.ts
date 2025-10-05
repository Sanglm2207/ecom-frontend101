import { createAsyncThunk } from '@reduxjs/toolkit';
import searchApi from '../../api/searchApi';
import type { ProductSuggestion } from './types';

export const fetchSearchSuggestions = createAsyncThunk<ProductSuggestion[], { keyword: string; limit: number }>(
    'search/fetchSuggestions',
    async ({ keyword, limit }, { rejectWithValue }) => {
        if (!keyword.trim()) {
            return []; // Trả về mảng rỗng nếu keyword rỗng
        }
        try {
            const response = await searchApi.getSuggestions(keyword, limit);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch suggestions');
        }
    }
);