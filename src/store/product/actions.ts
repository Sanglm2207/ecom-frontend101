import { createAsyncThunk } from '@reduxjs/toolkit';
import productApi, { type ProductImportResult, type ProductPayload } from '../../api/productApi';
import type { Product, ProductDetail } from './types';
import type { Page } from '../../types';
import reportApi, { type ReportPayload } from '../../api/reportApi';

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

/**
 * Action để xóa một sản phẩm.
 * Trả về ID của sản phẩm đã bị xóa để reducer có thể cập nhật state.
 */
export const deleteProduct = createAsyncThunk<number, { productId: number }, { rejectValue: string }>(
    'product/deleteProduct',
    async ({ productId }, { rejectWithValue }) => {
        try {
            await productApi.deleteProduct(productId);
            return productId; // Trả về ID khi thành công
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

/**
 * Action để tạo một sản phẩm mới.
 * Trả về đối tượng sản phẩm mới đã được tạo.
 */
export const createProduct = createAsyncThunk<Product, { payload: ProductPayload }, { rejectValue: string }>(
    'product/createProduct',
    async ({ payload }, { rejectWithValue }) => {
        try {
            const response = await productApi.createProduct(payload);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);

/**
 * Action để cập nhật một sản phẩm.
 * Trả về đối tượng sản phẩm đã được cập nhật.
 */
export const updateProduct = createAsyncThunk<Product, { productId: number; payload: ProductPayload }, { rejectValue: string }>(
    'product/updateProduct',
    async ({ productId, payload }, { rejectWithValue }) => {
        try {
            const response = await productApi.updateProduct(productId, payload);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

export const importProductsFromFile = createAsyncThunk<ProductImportResult, File, { rejectValue: string }>(
    'product/importFromFile',
    async (file, { rejectWithValue }) => {
        try {
            const response = await productApi.uploadProductsFile(file);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Import failed');
        }
    }
);

/**
 * Action để gọi API tạo báo cáo PDF.
 * Nó không trả về dữ liệu vào Redux store, chỉ xử lý file download.
 */
export const exportProductReport = createAsyncThunk<void, { payload: ReportPayload }, { rejectValue: string }>(
    'product/exportReport',
    async ({ payload }, { rejectWithValue }) => {
        try {
            const response = await reportApi.exportPdfReport(payload);

            // Xử lý file download ở phía client
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Tạo tên file động
            const filename = `BaoCao_${payload.reportType}_${payload.startDate}_den_${payload.endDate}.pdf`;
            link.download = filename;

            link.click(); // Tự động click vào link để tải file
            window.URL.revokeObjectURL(link.href); // Giải phóng bộ nhớ

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to export report');
        }
    }
);