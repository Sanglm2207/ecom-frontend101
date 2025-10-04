import { Paper, Typography, List, ListItem, ListItemText, Checkbox, TextField, Button, Box } from '@mui/material';

export default function FilterSidebar() {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Bộ lọc</Typography>

            {/* Lọc theo danh mục */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Danh mục</Typography>
            <List dense>
                {['Áo Sơ Mi & Polo', 'Quần Jean & Kaki', 'Giày Sneakers'].map(cat => (
                    <ListItem key={cat} disablePadding>
                        <Checkbox edge="start" />
                        <ListItemText primary={cat} />
                    </ListItem>
                ))}
            </List>

            {/* Lọc theo khoảng giá */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Khoảng giá</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField label="Từ" size="small" variant="outlined" />
                -
                <TextField label="Đến" size="small" variant="outlined" />
            </Box>

            <Button variant="contained" fullWidth sx={{ mt: 2 }}>Áp dụng</Button>
        </Paper>
    );
}