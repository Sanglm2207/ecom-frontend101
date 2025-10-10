import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createProduct, deleteProduct, exportProductReport, fetchLatestProducts, fetchProductDetail, fetchProducts, importProductsFromFile, updateProduct } from './actions';
import type { ProductState, Product } from './types';
import type { Page } from '../../types';

const initialState: ProductState = {
    products: [],
    loading: 'idle',
    error: null,
    selectedProduct: null,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,

    importResult: null,
    importLoading: 'idle',
    importError: null,

    reportLoading: 'idle',
    reportError: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // Action để reset trạng thái import khi rời khỏi trang
        clearImportResult: (state) => {
            state.importResult = null;
            state.importError = null;
            state.importLoading = 'idle';
        }
    },
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
            })
            // Xử lý khi xóa sản phẩm thành công
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                // Xóa sản phẩm khỏi danh sách hiện tại
                state.products = state.products.filter(p => p.id !== action.payload);
                if (state.totalElements > 0) {
                    state.totalElements -= 1;
                }
            })

            // Xử lý khi tạo sản phẩm thành công
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                // Thêm sản phẩm mới vào đầu danh sách
                state.products.unshift(action.payload);
                state.totalElements += 1;
            })

            // Xử lý khi cập nhật sản phẩm thành công
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                // Tìm và thay thế sản phẩm đã được cập nhật trong danh sách
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })

            .addCase(importProductsFromFile.pending, (state) => {
                state.importLoading = 'pending';
                state.importResult = null;
                state.importError = null;
            })
            .addCase(importProductsFromFile.fulfilled, (state, action) => {
                state.importLoading = 'idle';
                state.importResult = action.payload;
            })
            .addCase(importProductsFromFile.rejected, (state, action) => {
                state.importLoading = 'idle';
                state.importError = action.payload as string;
            })
            .addCase(exportProductReport.pending, (state) => {
                state.reportLoading = 'pending';
                state.reportError = null;
            })
            .addCase(exportProductReport.fulfilled, (state) => {
                state.reportLoading = 'idle';
            })
            .addCase(exportProductReport.rejected, (state, action) => {
                state.reportLoading = 'idle';
                state.reportError = action.payload as string;
            })

            // Bạn cũng có thể thêm các case .pending và .rejected cho các action CUD
            // để quản lý trạng thái loading/error một cách chi tiết hơn.
            .addMatcher(
                (action) => action.type.endsWith('/pending') && action.type.startsWith('product/'),
                (state) => {
                    state.loading = 'pending';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && action.type.startsWith('product/'),
                (state, action) => {
                    state.loading = 'idle';
                    state.error = action.payload ?? 'An error occurred';
                }
            );
    },
});

export const { clearImportResult } = productSlice.actions;

export default productSlice.reducer;