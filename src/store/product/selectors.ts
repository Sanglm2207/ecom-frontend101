import type { RootState } from "..";

export const selectAllProducts = (state: RootState) => state.product.products;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
export const selectProductPagination = (state: RootState) => ({
    page: state.product.page,
    size: state.product.size,
    totalElements: state.product.totalElements,
    totalPages: state.product.totalPages,
});