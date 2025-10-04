import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            {/* Không cần CssBaseline ở đây vì chúng ta đã set background cho body */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Toolbar rỗng này để đẩy nội dung xuống dưới Header, tránh bị che khuất */}
                <Toolbar />
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
}