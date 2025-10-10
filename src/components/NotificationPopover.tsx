import { Popover, List, ListItemText, Typography, Divider, Box, Button, ListItemButton, Avatar, ListItemAvatar, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAdminNotifications, selectUserNotifications, selectAdminUnreadNotificationCount, selectUserUnreadNotificationCount, markNotificationAsRead, type Notification, markAllNotificationsAsRead } from '../store/notification';

// Icon cho từng loại thông báo
const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'NEW_ORDER':
            return <ShoppingBagIcon color="success" />;
        case 'ORDER_STATUS_UPDATED':
            return <LocalShippingIcon color="primary" />;
        case 'NEW_USER':
            return <PersonAddIcon color="info" />;
        case 'NEW_PRODUCT':
            return <AddShoppingCartIcon color="secondary" />;
        default:
            return <NotificationsIcon />;
    }
};


export default function NotificationPopover({ anchorEl, onClose, notificationsSource }: { anchorEl: HTMLElement | null; onClose: () => void; notificationsSource: 'user' | 'admin'; }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const notifications = useAppSelector(notificationsSource === 'admin' ? selectAdminNotifications : selectUserNotifications);
    const unreadCount = useAppSelector(notificationsSource === 'admin' ? selectAdminUnreadNotificationCount : selectUserUnreadNotificationCount);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            dispatch(markNotificationAsRead({ id: notification.id }));
        }
        if (notification.link) {
            navigate(notification.link);
        }
        onClose();
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: {
                    width: 380,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    // Giao diện sẽ tự động đổi màu theo theme admin/user
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Thông báo</Typography>
                {unreadCount > 0 && <Chip label={`${unreadCount} mới`} color="primary" size="small" />}
            </Box>
            <Divider />

            <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <ListItemButton
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            sx={{
                                bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                                alignItems: 'flex-start',
                                py: 1.5
                            }}
                        >
                            <ListItemAvatar sx={{ mt: 0.5 }}>
                                <Avatar sx={{ bgcolor: 'background.default' }}>
                                    {getNotificationIcon(notif.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" component="span" sx={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                                        {notif.message}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    ))
                ) : (
                    <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
                        Bạn không có thông báo nào.
                    </Typography>
                )}
            </List>

            {notifications.length > 0 && (
                <>
                    <Divider />
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Button
                            size="small"
                            startIcon={<MarkChatReadIcon />}
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            Đánh dấu đã đọc tất cả
                        </Button>
                    </Box>
                </>
            )}
        </Popover>
    );
}