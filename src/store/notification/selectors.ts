import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from "..";

const selectNotificationState = (state: RootState) => state.notification;

// --- Selectors cho User ---
export const selectUserNotifications = createSelector(
    [selectNotificationState],
    (notificationState) => notificationState.userNotifications
);

export const selectUserUnreadNotificationCount = createSelector(
    [selectUserNotifications],
    (notifications) => notifications.filter(n => !n.isRead).length
);


// --- Selectors cho Admin ---
export const selectAdminNotifications = createSelector(
    [selectNotificationState],
    (notificationState) => notificationState.adminNotifications
);

export const selectAdminUnreadNotificationCount = createSelector(
    [selectAdminNotifications],
    (notifications) => notifications.filter(n => !n.isRead).length
);