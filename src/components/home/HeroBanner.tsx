import { Box, Typography, Button } from '@mui/material';

export default function HeroBanner() {
    return (
        <Box
            sx={(theme) => ({
                ...theme.glass,
                height: '400px',
                borderRadius: theme.spacing(3),
                p: { xs: 2, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            })}
        >
            <Typography variant="h2" component="h1" fontWeight="bold" sx={{ color: 'text.primary', maxWidth: '50%' }}>
                Bộ Sưu Tập Mới
            </Typography>
            <Typography variant="h6" sx={{ my: 2, color: 'text.secondary', maxWidth: '45%' }}>
                Khám phá những sản phẩm công nghệ và thời trang mới nhất, dẫn đầu xu hướng.
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>
                Mua ngay
            </Button>
        </Box>
    );
}