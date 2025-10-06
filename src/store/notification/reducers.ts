import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationState, Notification } from './types';
import { fetchUnreadNotifications, markNotificationAsRead } from './actions';

const initialState: NotificationState = {
    userNotifications: [],
    adminNotifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        /**
     * Action được gọi bởi WebSocketService để thêm một thông báo mới.
     * Nó sẽ tự phân loại thông báo dựa trên destination.
     */
        addNotification: (state, action: PayloadAction<{ notification: Notification; destination: 'user' | 'admin' }>) => {
            const { notification, destination } = action.payload;

            if (destination === 'admin') {
                // Tránh thêm thông báo trùng lặp (phòng trường hợp nhận lại message)
                if (!state.adminNotifications.some(n => n.timestamp === notification.timestamp && n.message === notification.message)) {
                    state.adminNotifications.unshift({ ...notification, isRead: false });
                }
            } else { // destination === 'user'
                if (!state.userNotifications.some(n => n.timestamp === notification.timestamp && n.message === notification.message)) {
                    state.userNotifications.unshift({ ...notification, isRead: false });
                }
            }
        },

        /**
         * Action để xóa tất cả thông báo (ví dụ: khi người dùng đăng xuất).
         */
        clearAllNotifications: (state) => {
            state.userNotifications = [];
            state.adminNotifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Xử lý khi fetch thông báo chưa đọc thành công (cho người dùng hiện tại)
            .addCase(fetchUnreadNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                // Gộp thông báo mới từ API với thông báo đã có trong state, tránh trùng lặp
                const existingIds = new Set(state.userNotifications.map(n => n.id));
                const newNotifications = action.payload.filter(n => !existingIds.has(n.id));

                // Giữ lại các thông báo cũ và thêm các thông báo mới vào đầu
                state.userNotifications = [...newNotifications, ...state.userNotifications];
            })
            // Xử lý khi đánh dấu một thông báo là đã đọc
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
                const notificationId = action.payload;

                // Tìm và cập nhật trong cả hai mảng để đảm bảo
                let notification = state.userNotifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.isRead = true;
                }

                notification = state.adminNotifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.isRead = true;
                }
            });
    },
});

export const { addNotification, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;