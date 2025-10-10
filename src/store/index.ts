import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import productReducer from './product';
import cartReducer from './cart';
import searchReducer from './search';
import orderReducer from './order';
import userReducer from './user';
import couponReducer from './coupon';
import socketReducer from './socket';
import notificationReducer from './notification';
import categoryReducer from './category';
import { socketMiddleware } from './middleware/socketMiddleware';
import dashboardReducer from './dashboard';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        search: searchReducer,
        order: orderReducer,
        user: userReducer,
        coupon: couponReducer,
        socket: socketReducer,
        notification: notificationReducer,
        category: categoryReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),

});

// Định nghĩa các kiểu dữ liệu cho Redux store và dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;