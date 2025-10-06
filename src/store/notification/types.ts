export interface Notification {
    id: number;
    type: string;
    message: string;
    link: string;
    timestamp: string;
    createdAt: string;
    isRead?: boolean; // Sẽ dùng sau
}

export interface NotificationState {
    userNotifications: Notification[];
    adminNotifications: Notification[];
}