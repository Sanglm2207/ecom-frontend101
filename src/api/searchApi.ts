import type { ProductSuggestion } from '../store/order';
import type { ApiResponse } from '../types';
import axiosClient from './axiosClient';

const searchApi = {
    getSuggestions: (keyword: string, limit: number): Promise<{ data: ApiResponse<ProductSuggestion[]> }> => {
        return axiosClient.get(`/products/suggestions?keyword=${keyword}&limit=${limit}`);
    },
};

export default searchApi;