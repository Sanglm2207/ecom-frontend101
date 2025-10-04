import type { Product, ProductDetail } from '../store/product/types';
import type { ApiResponse, Page } from '../types';
import axiosClient from './axiosClient';


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
};

export default productApi;