import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi, { type Page } from '../../api/productApi';
import type { Product, ProductDetail } from './types';

interface FetchProductsParams {
    filter?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export const fetchProducts = createAsyncThunk<Page<Product>, FetchProductsParams, { rejectValue: string }>(
    'product/fetchProducts',
    async (params = {}, { rejectWithValue }) => { // Thêm giá trị mặc định
        try {
            const response = await productApi.getProducts(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchLatestProducts = createAsyncThunk<Page<Product>, number, { rejectValue: string }>(
    'product/fetchLatestProducts',
    async (limit = 8, { rejectWithValue }) => {
        try {
            const response = await productApi.getLatestProducts(limit);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch latest products');
        }
    }
);

export const fetchProductDetail = createAsyncThunk<ProductDetail, string, { rejectValue: string }>(
    'product/fetchProductDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productApi.getProductDetail(id);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product detail');
        }
    }
);