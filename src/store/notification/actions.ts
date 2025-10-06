import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from '../../api/notificationApi';
import type { Notification } from './types';

export const fetchUnreadNotifications = createAsyncThunk<Notification[]>(
    'notification/fetchUnread',
    async () => {
        const response = await notificationApi.getMyUnreadNotifications();
        return response.data.data;
    }
);


export const markNotificationAsRead = createAsyncThunk<number, { id: number }>(
    'notification/markAsRead',
    async ({ id }) => {
        await notificationApi.markAsRead(id);
        return id; // Trả về ID để reducer xử lý
    }
);