import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '..';

const selectCouponState = (state: RootState) => state.coupon;

export const selectAdminCouponsPage = createSelector(
    [selectCouponState],
    (couponState) => couponState.couponsPage
);

export const selectAdminCouponsLoading = createSelector(
    [selectCouponState],
    (couponState) => couponState.loading
);