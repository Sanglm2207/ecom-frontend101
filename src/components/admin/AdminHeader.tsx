import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Avatar, Tooltip, IconButton, Menu, MenuItem,
    ListItemIcon, Divider, Box,
    Button
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import { selectCurrentUser, logout } from '../../store/auth';
import authApi from '../../api/authApi';
import { wsDisconnect } from '../../store/socket';
import AdminBreadcrumbs from './AdminBreadcrumbs';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const drawerWidth = 240;

export default function AdminHeader() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = async () => {
        handleCloseUserMenu();
        try {
            await authApi.logout();
        } finally {
            dispatch(wsDisconnect());
            dispatch(logout());
            navigate('/auth/login');
        }
    };

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

                <Tooltip title="Cài đặt tài khoản">
                    <Button
                        onClick={handleOpenUserMenu}
                        sx={{ p: 0.5, ml: 2, borderRadius: '8px', textTransform: 'none', color: 'text.primary' }}
                    >
                        <Avatar
                            alt={currentUser?.username.toUpperCase()}
                            src={currentUser?.avatarUrl}
                            sx={{ width: 32, height: 32, mr: 1 }}
                        >
                            {!currentUser?.avatarUrl && currentUser?.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {currentUser?.fullName || currentUser?.username}
                        </Typography>
                    </Button>
                </Tooltip>

                {/* --- MENU DROPDOWN CỦA USER --- */}
                <Menu
                    sx={{ mt: '45px' }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/settings'); }}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        Cài đặt tài khoản
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/'); }}>
                        <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
                        Trở về trang chủ
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <ListItemIcon><ExitToAppIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    );
}