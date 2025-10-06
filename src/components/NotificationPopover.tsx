import { Popover, List, ListItem, ListItemText, Typography, Divider, Box, Button, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { markNotificationAsRead, selectAdminNotifications, selectAdminUnreadNotificationCount, selectUserNotifications, selectUserUnreadNotificationCount } from '../store/notification';
import { type Notification } from '../store/notification';
import theme from '../styles/theme';

interface NotificationPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    notificationsSource: 'user' | 'admin'; // Prop mới
}

export default function NotificationPopover({ anchorEl, onClose, notificationsSource }: NotificationPopoverProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy dữ liệu và số lượng dựa trên prop `notificationsSource`
    const notifications = useAppSelector(
        notificationsSource === 'admin' ? selectAdminNotifications : selectUserNotifications
    );
    const unreadCount = useAppSelector(
        notificationsSource === 'admin' ? selectAdminUnreadNotificationCount : selectUserUnreadNotificationCount
    );

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            dispatch(markNotificationAsRead({ id: notification.id }));
        }
        if (notification.link) {
            navigate(notification.link);
        }
        onClose();
    };
    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { width: 380, ...theme.glass, backdropFilter: 'blur(25px) saturate(200%)' } }}

        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Thông báo</Typography>
                {unreadCount > 0 && <Button size="small">Đánh dấu đã đọc tất cả</Button>}
            </Box>
            <Divider />

            <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <ListItem key={notif.id} disablePadding>
                            <ListItemButton
                                onClick={() => handleNotificationClick(notif)}
                                sx={{
                                    // Làm mờ thông báo đã đọc
                                    opacity: notif.isRead ? 0.6 : 1,
                                    // Thêm một chấm xanh cho thông báo chưa đọc
                                    '&::before': notif.isRead ? {} : {
                                        content: '""',
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        marginRight: 1.5,
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" component="span" sx={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                                            {notif.message}
                                        </Typography>
                                    }
                                    secondary={new Date(notif.timestamp).toLocaleString('vi-VN')}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">
                        Bạn không có thông báo nào.
                    </Typography>
                )}
            </List>
        </Popover>
    );
}