import type { Order } from "../store/order";
import type { ApiResponse, Page } from "../types";
import axiosClient from "./axiosClient";

// Thêm OrderPayload vào src/types/index.ts
export interface OrderPayload {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    couponCode?: string;
}


const orderApi = {
    // --- User APIs ---
    createOrder: (payload: OrderPayload): Promise<{ data: ApiResponse<Order> }> => {
        return axiosClient.post('/orders', payload);
    },
    getMyOrders: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<Order>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/orders/my-orders?${searchParams.toString()}`);
    },
    getMyOrderDetail: (orderId: number | string): Promise<{ data: ApiResponse<Order> }> => {
        return axiosClient.get(`/orders/${orderId}`);
    },

    // --- Admin APIs ---
    getAllOrders: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<Order>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/orders?${searchParams.toString()}`);
    },
    getOrderDetailForAdmin: (orderId: number): Promise<{ data: ApiResponse<Order> }> => {
        return axiosClient.get(`/orders/${orderId}`);
    },
    updateOrderStatus: (orderId: number, status: string): Promise<{ data: ApiResponse<Order> }> => {
        return axiosClient.patch(`/orders/${orderId}/status`, { status });
    },
};

export default orderApi;