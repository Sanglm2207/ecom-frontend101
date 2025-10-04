import { Box, Container, Typography, Link, TextField, Button, Grid } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={(theme) => ({
                ...theme.glass,
                py: 3,
                px: 2,
                mt: 'auto',
                borderTop: theme.glass.border, // Thêm viền trên cho rõ ràng
                borderBottom: 'none',
                borderLeft: 'none',
                borderRight: 'none',
            })}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            KAIDEV SHOP
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Nền tảng thương mại điện tử hàng đầu, cung cấp các sản phẩm chất lượng với giá cả tốt nhất.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Liên kết
                        </Typography>
                        <Link href="#" display="block" color="text.secondary">Về chúng tôi</Link>
                        <Link href="#" display="block" color="text.secondary">Chính sách bảo mật</Link>
                        <Link href="#" display="block" color="text.secondary">Điều khoản dịch vụ</Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Đăng ký nhận tin
                        </Typography>
                        <TextField label="Email của bạn" variant="outlined" size="small" fullWidth sx={{ mb: 1 }} />
                        <Button variant="contained" fullWidth>Đăng ký</Button>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="#">KaiDev99</Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}