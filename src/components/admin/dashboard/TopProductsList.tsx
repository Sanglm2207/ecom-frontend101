import {
    Card, CardContent, CardHeader, Divider, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, Typography, Box, LinearProgress
} from '@mui/material';
import type { TopProductDTO } from '../../../store/dashboard';

interface TopProductsListProps {
    products: TopProductDTO[];
}

export default function TopProductsList({ products = [] }: TopProductsListProps) {
    const maxSold = products.length > 0 ? products[0].totalSold : 0;

    return (
        <Card>
            <CardHeader title="Top 5 Sản phẩm Bán chạy" />
            <Divider />
            <CardContent>
                <List disablePadding>
                    {products.map((product, index) => (
                        <ListItem key={product.productId} divider={index < products.length - 1}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography noWrap variant="subtitle1" fontWeight="medium">
                                        {product.productName}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(product.totalSold / maxSold) * 100}
                                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {product.totalSold}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}