import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link, useParams } from 'react-router-dom';

export default function OrderSuccessPage() {
    const { id } = useParams<{ id: string }>(); // Lấy ID đơn hàng từ URL

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <Paper sx={(theme) => ({ ...theme.glass, p: 4, textAlign: 'center' })}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    Đặt hàng thành công!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Cảm ơn bạn đã mua sắm. Đơn hàng #{id} của bạn đang được xử lý. Chúng tôi sẽ thông báo cho bạn khi đơn hàng được vận chuyển.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button component={Link} to="/profile/orders" variant="outlined">
                        Xem đơn hàng
                    </Button>
                    <Button component={Link} to="/" variant="contained">
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}