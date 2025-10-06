import type { Product, ProductDetail } from '../store/product/types';
import type { ApiResponse, Page } from '../types';
import axiosClient from './axiosClient';

export interface ProductPayload {
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    isFeatured?: boolean;
    thumbnailUrl?: string,
    imageUrls?: string[],
}


const productApi = {
    // Dùng `URLSearchParams` để xây dựng query string một cách an toàn
    getProducts: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<Product>> }> => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                searchParams.append(key, value.toString());
            }
        });
        return axiosClient.get(`/products?${searchParams.toString()}`);
    },

    getLatestProducts: (limit: number): Promise<{ data: ApiResponse<Page<Product>> }> => {
        return axiosClient.get(`/products/latest?limit=${limit}`);
    },

    getProductDetail: (id: string): Promise<{ data: ApiResponse<ProductDetail> }> => {
        return axiosClient.get(`/products/${id}`);
    },

    /**
   * Tạo một sản phẩm mới
   * @param payload - Dữ liệu của sản phẩm mới
   */
    createProduct: (payload: ProductPayload): Promise<{ data: ApiResponse<Product> }> => {
        return axiosClient.post('/products/', payload);
    },

    /**
     * Cập nhật một sản phẩm đã có
     * @param productId - ID của sản phẩm cần cập nhật
     * @param payload - Dữ liệu cập nhật
     */
    updateProduct: (productId: number, payload: ProductPayload): Promise<{ data: ApiResponse<Product> }> => {
        return axiosClient.put(`/products/${productId}`, payload);
    },

    /**
     * Xóa một sản phẩm
     * @param productId - ID của sản phẩm cần xóa
     */
    deleteProduct: (productId: number): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.delete(`/products/${productId}`);
    },
};

export default productApi;