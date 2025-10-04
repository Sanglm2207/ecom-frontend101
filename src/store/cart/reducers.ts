import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCart,
    addToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    removeMultipleItemsFromCart // Import action mới
} from './actions';
import type { CartState, CartItem } from './types';

const initialState: CartState = {
    items: [],
    loading: 'idle',
    error: null,
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
        // Các reducer đồng bộ (nếu có) sẽ được định nghĩa ở đây
    },
    extraReducers: (builder) => {
        // Sử dụng các hàm helper cho các action
        builder
            .addCase(fetchCart.pending, handlePending)
            .addCase(fetchCart.rejected, handleRejected)
            .addCase(fetchCart.fulfilled, handleFulfilled);

        builder
            .addCase(addToCart.pending, handlePending)
            .addCase(addToCart.rejected, handleRejected)
            .addCase(addToCart.fulfilled, handleFulfilled);

        builder
            .addCase(updateCartItemQuantity.pending, handlePending)
            .addCase(updateCartItemQuantity.rejected, handleRejected)
            .addCase(updateCartItemQuantity.fulfilled, handleFulfilled);

        builder
            .addCase(removeItemFromCart.pending, handlePending)
            .addCase(removeItemFromCart.rejected, handleRejected)
            .addCase(removeItemFromCart.fulfilled, handleFulfilled);

        builder
            .addCase(removeMultipleItemsFromCart.pending, handlePending)
            .addCase(removeMultipleItemsFromCart.rejected, handleRejected)
            .addCase(removeMultipleItemsFromCart.fulfilled, handleFulfilled);
    },
});

export default cartSlice.reducer;