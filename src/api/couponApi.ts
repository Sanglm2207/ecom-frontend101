import type { Coupon } from '../store/coupon';
import type { ApiResponse, Page } from '../types';
import axiosClient from './axiosClient';

export interface CouponPayload {
    codePrefix?: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    maxUsage: number;
    expiryDate: string; // "YYYY-MM-DD"
    quantity: number;
}

const couponApi = {
    getCoupons: (params: { [key: string]: any }): Promise<{ data: ApiResponse<Page<Coupon>> }> => {
        const searchParams = new URLSearchParams(params);
        return axiosClient.get(`/coupons?${searchParams.toString()}`);
    },
    createCoupons: (payload: CouponPayload): Promise<{ data: ApiResponse<Coupon[]> }> => {
        return axiosClient.post('/coupons', payload);
    },
    toggleStatus: (couponId: number): Promise<{ data: ApiResponse<Coupon> }> => {
        return axiosClient.patch(`/coupons/${couponId}/toggle-status`);
    },

    validateCoupon: (code: string): Promise<{ data: ApiResponse<Coupon> }> => {
        return axiosClient.post('/coupons/validate', { code });
    },
};


export default couponApi;