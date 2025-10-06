import type { Middleware } from '@reduxjs/toolkit';
import { webSocketService } from '../../services/WebSocketService';
import { wsConnect, wsDisconnect } from '../socket';

export const socketMiddleware: Middleware = () => (next) => (action) => {
    if (wsConnect.match(action)) {
        // Khi action wsConnect được dispatch, gọi service để kết nối
        webSocketService.connect();
    }

    if (wsDisconnect.match(action)) {
        // Khi action wsDisconnect được dispatch, gọi service để ngắt kết nối
        webSocketService.disconnect();
    }

    return next(action);
};