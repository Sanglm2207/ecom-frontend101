import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '..';

const selectOrderState = (state: RootState) => state.order;

/**
 * Selector để lấy đối tượng Page<Order> từ state.
 */
export const selectOrdersPage = createSelector(
    [selectOrderState],
    (orderState) => orderState.ordersPage
);

/**
 * Selector để lấy ra đơn hàng đang được chọn hoặc vừa được tạo.
 */
export const selectSelectedOrder = createSelector(
    [selectOrderState],
    (orderState) => orderState.selectedOrder
);

/**
 * Selector để lấy trạng thái loading của order slice.
 * SẼ ĐƯỢC DÙNG CHO CẢ ADMIN VÀ USER.
 */
export const selectOrderLoading = createSelector(
    [selectOrderState],
    (orderState) => orderState.loading
);

/**
 * Selector để lấy thông báo lỗi của order slice.
 */
export const selectOrderError = createSelector(
    [selectOrderState],
    (orderState) => orderState.error
);