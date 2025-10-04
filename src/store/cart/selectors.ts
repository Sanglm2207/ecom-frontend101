import type { RootState } from "..";

// Selector để lấy toàn bộ các item trong giỏ hàng
export const selectCartItems = (state: RootState) => state.cart.items;

// Selector để lấy trạng thái loading của giỏ hàng
export const selectCartLoading = (state: RootState) => state.cart.loading;

// Selector để lấy thông báo lỗi (nếu có)
export const selectCartError = (state: RootState) => state.cart.error;

// Selector để tính tổng số lượng sản phẩm trong giỏ (hiển thị trên icon Badge)
export const selectTotalCartItems = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Selector để tính tổng giá trị giỏ hàng
export const selectCartTotalPrice = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);