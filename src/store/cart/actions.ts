import { createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';
import type { CartItem } from './types';
import type { AppDispatch } from '..';
import type { Coupon } from '../coupon';
import couponApi from '../../api/couponApi';

export const fetchCart = createAsyncThunk<CartItem[]>('cart/fetchCart', async () => {
    const response = await cartApi.getCart();
    return response.data.data;
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }: { productId: number; quantity: number }) => {
        await cartApi.addItem({ productId, quantity });
        // Sau khi thêm thành công, gọi lại fetchCart để cập nhật state
        const response = await cartApi.getCart();
        return response.data.data;
    }
);

// Thunk để thay đổi số lượng (tăng, giảm, hoặc xóa nếu về 0)
export const updateCartItemQuantity = createAsyncThunk<CartItem[], { productId: number; quantity: number }, { dispatch: AppDispatch }>(
    'cart/updateQuantity',
    async ({ productId, quantity }, { dispatch }) => {
        if (quantity > 0) {
            await cartApi.updateItem({ productId, quantity });
        } else {
            // Nếu số lượng là 0, gọi API xóa
            await cartApi.removeItem(productId);
        }
        // Sau khi cập nhật, fetch lại toàn bộ giỏ hàng để đảm bảo đồng bộ
        const action = await dispatch(fetchCart());
        return action.payload as CartItem[];
    }
);

export const removeMultipleItemsFromCart = createAsyncThunk<CartItem[], { productIds: number[] }, { dispatch: AppDispatch }>(
    'cart/removeMultipleItems',
    async ({ productIds }, { dispatch }) => {
        // Gọi API xóa nhiều item MỘT LẦN DUY NHẤT
        await cartApi.removeMultipleItems(productIds);

        // Fetch lại giỏ hàng sau khi xóa xong
        const action = await dispatch(fetchCart());
        return action.payload as CartItem[];
    }
);

// Thunk xóa 1 item (vẫn giữ nguyên cho CartItemCard)
export const removeItemFromCart = createAsyncThunk<CartItem[], { productId: number }, { dispatch: AppDispatch }>(
    'cart/removeItem',
    async ({ productId }, { dispatch }) => {
        await cartApi.removeItem(productId);
        const action = await dispatch(fetchCart());
        return action.payload as CartItem[];
    }
);

export const applyCoupon = createAsyncThunk<Coupon, { code: string }, { rejectValue: string }>(
    'cart/applyCoupon',
    async ({ code }, { rejectWithValue }) => {
        try {
            const response = await couponApi.validateCoupon(code);
            return response.data.data; // Trả về coupon object nếu thành công
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
        }
    }
);