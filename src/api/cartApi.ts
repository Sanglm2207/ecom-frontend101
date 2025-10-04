import type { CartItem } from '../store/cart/types';
import type { ApiResponse } from '../types';
import axiosClient from './axiosClient';

interface UpdateCartPayload {
    productId: number;
    quantity: number;
}

const cartApi = {
    getCart: (): Promise<{ data: ApiResponse<CartItem[]> }> => axiosClient.get('/cart'),
    addItem: (payload: UpdateCartPayload): Promise<{ data: ApiResponse<void> }> => axiosClient.post('/cart', payload),
    updateItem: (payload: UpdateCartPayload): Promise<{ data: ApiResponse<void> }> => axiosClient.post('/cart', payload),
    removeItem: (productId: number): Promise<{ data: ApiResponse<void> }> => axiosClient.delete(`/cart/items/${productId}`),
    removeMultipleItems: (productIds: number[]): Promise<{ data: ApiResponse<void> }> => {
        return axiosClient.delete('/cart/items', {
            data: { productIds } // Gửi productIds trong body của request DELETE
        });
    },
};

export default cartApi;