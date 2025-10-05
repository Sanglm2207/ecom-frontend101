import { Box, Toolbar, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import adminTheme from '../styles/adminTheme';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
    return (
        <ThemeProvider theme={adminTheme}>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                    <AdminHeader />
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
}