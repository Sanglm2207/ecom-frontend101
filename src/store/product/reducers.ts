import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchLatestProducts, fetchProductDetail, fetchProducts } from './actions';
import type { Page } from '../../api/productApi';
import type { ProductState, Product } from './types';

const initialState: ProductState = {
    products: [],
    loading: 'idle',
    error: null,
    selectedProduct: null,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý luồng fetchProducts (cho trang danh sách sản phẩm)
            .addCase(fetchProducts.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Page<Product>>) => {
                state.loading = 'idle';
                state.products = action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload ?? 'Failed to fetch products';
            })

            // Xử lý luồng fetchLatestProducts (cho trang chủ)
            .addCase(fetchLatestProducts.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchLatestProducts.fulfilled, (state, action: PayloadAction<Page<Product>>) => {
                state.loading = 'idle';
                // Chỉ cập nhật danh sách sản phẩm, không cần thông tin phân trang phức tạp cho trang chủ
                state.products = action.payload.content;
            })
            .addCase(fetchLatestProducts.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload ?? 'Failed to fetch latest products';
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = 'pending';
                state.selectedProduct = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload ?? 'Failed';
            });
    },
});

export default productSlice.reducer;