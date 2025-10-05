import type { Category } from '../store/product';
import type { ApiResponse, Page } from '../types';
import axiosClient from './axiosClient';

// Kiểu dữ liệu cho việc tạo/cập nhật Category, tương ứng với CategoryDTO
export interface CategoryPayload {
    name: string;
}

const categoryApi = {
    /**
     * Lấy danh sách tất cả các danh mục (không phân trang).
     * Dùng cho các dropdown lựa chọn.
     */
    getAllCategories: (): Promise<{ data: ApiResponse<Category[]> }> => {
        return axiosClient.get('/categories');
    },

    /**
     * Lấy danh sách danh mục có phân trang (dành cho trang quản lý category nếu cần).
     */
    getCategoriesPaginated: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<Category>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/categories?${searchParams.toString()}`);
    },

    /**
     * Lấy chi tiết một danh mục.
     */
    getCategoryById: (categoryId: number): Promise<{ data: ApiResponse<Category> }> => {
        return axiosClient.get(`/categories/${categoryId}`);
    },

    /**
     * Tạo một danh mục mới.
     */
    createCategory: (payload: CategoryPayload): Promise<{ data: ApiResponse<Category> }> => {
        return axiosClient.post('/categories', payload);
    },

    /**
     * Cập nhật một danh mục.
     */
    updateCategory: (categoryId: number, payload: CategoryPayload): Promise<{ data: ApiResponse<Category> }> => {
        return axiosClient.put(`/categories/${categoryId}`, payload);
    },

    /**
     * Xóa một danh mục.
     */
    deleteCategory: (categoryId: number): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.delete(`/categories/${categoryId}`);
    },
};

export default categoryApi;