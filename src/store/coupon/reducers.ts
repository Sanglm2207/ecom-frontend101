import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Page } from '../../types';
import { fetchAdminCoupons, createCoupons, toggleCouponStatus } from './actions';
import type { CouponState, Coupon } from './types';

const initialState: CouponState = {
    couponsPage: null,
    loading: 'idle',
    error: null,
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAdminCoupons.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchAdminCoupons.fulfilled, (state, action: PayloadAction<Page<Coupon>>) => {
                state.loading = 'idle';
                state.couponsPage = action.payload;
            })
            .addCase(fetchAdminCoupons.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })
            // Create (không cần cập nhật list vì table sẽ tự refresh)
            .addCase(createCoupons.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(createCoupons.fulfilled, (state) => {
                state.loading = 'idle';
            })
            .addCase(createCoupons.rejected, (state, action) => {
                state.loading = 'idle';
                state.error = action.payload as string;
            })
            // Toggle Status (cập nhật optimistic)
            .addCase(toggleCouponStatus.fulfilled, (state, action: PayloadAction<Coupon>) => {
                if (state.couponsPage) {
                    const index = state.couponsPage.content.findIndex(c => c.id === action.payload.id);
                    if (index !== -1) {
                        state.couponsPage.content[index] = action.payload;
                    }
                }
            });
    },
});

export default couponSlice.reducer;