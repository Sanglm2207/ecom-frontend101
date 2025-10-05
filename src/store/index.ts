import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import productReducer from './product';
import cartReducer from './cart';
import searchReducer from './search';
import orderReducer from './order';
import userReducer from './user';
import couponReducer from './coupon';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        search: searchReducer,
        order: orderReducer,
        user: userReducer,
        coupon: couponReducer,
    },
});

// Định nghĩa các kiểu dữ liệu cho Redux store và dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;