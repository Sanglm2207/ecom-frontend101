import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createOrder, fetchAdminOrders, fetchMyOrders, fetchOrderDetail, updateOrderStatus } from './actions';
import { type Page } from '../../types';
import type { OrderState, Order } from './types';

const initialState: OrderState = {
    ordersPage: null,
    selectedOrder: null,
    loading: 'idle',
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Create Order (User)
            .addCase(createOrder.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = 'idle';
                state.selectedOrder = action.payload; // Lưu đơn hàng vừa tạo
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })
            // Fetch danh sách đơn hàng của tôi
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.ordersPage = action.payload; // Tái sử dụng state ordersPage
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })

            // Fetch chi tiết một đơn hàng
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.selectedOrder = action.payload; // Lưu vào selectedOrder
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })

            // Fetch Orders (Admin)
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action: PayloadAction<Page<Order>>) => {
                state.loading = 'idle';
                state.ordersPage = action.payload;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })

            // Update Status (Admin)
            .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
                if (state.ordersPage) {
                    const index = state.ordersPage.content.findIndex(order => order.id === action.payload.id);
                    if (index !== -1) {
                        state.ordersPage.content[index] = action.payload;
                    }
                }
                if (state.selectedOrder?.id === action.payload.id) {
                    state.selectedOrder = action.payload;
                }
            });
    },
});

export default orderSlice.reducer;