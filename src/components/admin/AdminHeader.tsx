import { AppBar, Toolbar, Avatar, Tooltip, IconButton, Box } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AdminBreadcrumbs from './AdminBreadcrumbs';

const drawerWidth = 240;

export default function AdminHeader() {
    return (
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Toolbar>
                <AdminBreadcrumbs />
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Thông báo">
                    <IconButton color="inherit">
                        <NotificationsOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Tài khoản">
                    <IconButton sx={{ p: 0, ml: 2 }}>
                        <Avatar>A</Avatar>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}