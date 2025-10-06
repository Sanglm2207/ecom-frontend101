import { AppBar, Toolbar, Avatar, Tooltip, IconButton, Box, Badge } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AdminBreadcrumbs from './AdminBreadcrumbs';
import { useState, type MouseEvent } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAdminUnreadNotificationCount } from '../../store/notification';
import NotificationPopover from '../NotificationPopover';

const drawerWidth = 240;

export default function AdminHeader() {
    const unreadCount = useAppSelector(selectAdminUnreadNotificationCount);

    const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

    const handleOpenNotifMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNotif(event.currentTarget);
    };

    const handleCloseNotifMenu = () => {
        setAnchorElNotif(null);
    };

    return (
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Toolbar>
                <AdminBreadcrumbs />
                <Box sx={{ flexGrow: 1 }} />
                {/* --- ICON CHUÔNG THÔNG BÁO --- */}
                <Tooltip title="Thông báo">
                    <IconButton color="inherit" onClick={handleOpenNotifMenu}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsOutlinedIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* --- POPOVER THÔNG BÁO --- */}
                <NotificationPopover
                    anchorEl={anchorElNotif}
                    onClose={handleCloseNotifMenu}
                    notificationsSource="admin" // Prop mới để chỉ định nguồn dữ liệu
                />
                <Tooltip title="Tài khoản">
                    <IconButton sx={{ p: 0, ml: 2 }}>
                        <Avatar>A</Avatar>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}