import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    removeMultipleItemsFromCart, // Import action mới
    applyCoupon
} from './actions';
import type { CartState, CartItem } from './types';
import type { Coupon } from '../coupon';
import { createOrder } from '../order';

const initialState: CartState = {
    items: [],
    loading: 'idle',
    error: null,
    appliedCoupon: null,
};

// Hàm helper để tránh lặp code
const handlePending = (state: CartState) => {
    state.loading = 'pending';
    state.error = null;
};
const handleRejected = (state: CartState, action: any) => {
    state.loading = 'idle';
    state.error = action.error.message || 'An error occurred';
};
const handleFulfilled = (state: CartState, action: PayloadAction<CartItem[]>) => {
    state.loading = 'idle';
    state.items = action.payload;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Action để xóa thông báo lỗi khỏi state.
         * Được gọi khi người dùng bắt đầu một hành động mới.
         */
        clearCartError: (state) => {
            state.error = null;
        },

        /**
         * Action để gỡ bỏ mã giảm giá đã áp dụng.
         */
        removeCoupon: (state) => {
            state.appliedCoupon = null;
            state.error = null; // Cũng xóa lỗi liên quan đến coupon
        },

        clearClientCart: (state) => {
            state.items = [];
            state.appliedCoupon = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, handlePending)
            .addCase(fetchCart.rejected, handleRejected)
            .addCase(fetchCart.fulfilled, handleFulfilled)
            .addCase(addToCart.pending, handlePending)
            .addCase(addToCart.rejected, handleRejected)
            .addCase(addToCart.fulfilled, handleFulfilled)
            .addCase(updateCartItemQuantity.pending, handlePending)
            .addCase(updateCartItemQuantity.rejected, handleRejected)
            .addCase(updateCartItemQuantity.fulfilled, handleFulfilled)
            .addCase(removeItemFromCart.pending, handlePending)
            .addCase(removeItemFromCart.rejected, handleRejected)
            .addCase(removeItemFromCart.fulfilled, handleFulfilled)
            .addCase(removeMultipleItemsFromCart.pending, handlePending)
            .addCase(removeMultipleItemsFromCart.rejected, handleRejected)
            .addCase(removeMultipleItemsFromCart.fulfilled, handleFulfilled)
            .addCase(createOrder.fulfilled, (state) => {
                state.items = [];
                state.appliedCoupon = null; // TypeScript bây giờ đã hiểu thuộc tính này
            })
            .addCase(applyCoupon.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = 'idle';
                state.appliedCoupon = action.payload;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
                state.appliedCoupon = null;
            });
    },
});

export const { removeCoupon, clearCartError, clearClientCart } = cartSlice.actions;

export default cartSlice.reducer;