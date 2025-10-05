import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Order } from './types';
import type { Page } from '../../types';
import type { OrderPayload } from '../../api/orderApi';
import type { AppDispatch } from '..';
import orderApi from '../../api/orderApi';

interface FetchOrdersParams {
    filter?: string;
    page?: number;
    size?: number;
    sort?: string;
}

interface FetchMyOrdersParams {
    page?: number;
    size?: number;
    sort?: string;
}


// --- User Actions ---
export const createOrder = createAsyncThunk<Order, OrderPayload, { dispatch: AppDispatch; rejectValue: string }>(
    'order/createOrder',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await orderApi.createOrder(payload);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

export const fetchMyOrders = createAsyncThunk<Page<Order>, FetchMyOrdersParams>(
    'order/fetchMyOrders',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await orderApi.getMyOrders(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch your orders');
        }
    }
);

export const fetchOrderDetail = createAsyncThunk<Order, { orderId: number | string }>(
    'order/fetchOrderDetail',
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const response = await orderApi.getMyOrderDetail(orderId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch order detail');
        }
    }
);

// --- Admin Actions ---
export const fetchAdminOrders = createAsyncThunk<Page<Order>, FetchOrdersParams>(
    'order/fetchAdminOrders',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await orderApi.getAllOrders(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch orders');
        }
    }
);

export const updateOrderStatus = createAsyncThunk<Order, { orderId: number; status: string }>(
    'order/updateStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await orderApi.updateOrderStatus(orderId, status);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to update order status');
        }
    }
);