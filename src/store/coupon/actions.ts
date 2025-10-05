import { createAsyncThunk } from '@reduxjs/toolkit';
import couponApi, { type CouponPayload } from '../../api/couponApi';
import type { Page } from '../../types';
import type { Coupon } from './types';

interface FetchCouponsParams {
    page: number;
    size: number;
    sort?: string;
    filter?: string;
}

export const fetchAdminCoupons = createAsyncThunk<Page<Coupon>, FetchCouponsParams>(
    'coupon/fetchAdminCoupons',
    async (params = { page: 0, size: 10 }, { rejectWithValue }) => {
        try {
            const response = await couponApi.getCoupons(params);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to fetch coupons');
        }
    }
);

export const createCoupons = createAsyncThunk<Coupon[], CouponPayload>(
    'coupon/createCoupons',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await couponApi.createCoupons(payload);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to create coupons');
        }
    }
);

export const toggleCouponStatus = createAsyncThunk<Coupon, { couponId: number }>(
    'coupon/toggleStatus',
    async ({ couponId }, { rejectWithValue }) => {
        try {
            const response = await couponApi.toggleStatus(couponId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue('Failed to toggle coupon status');
        }
    }
);