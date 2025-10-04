import { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Typography, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CartItemCard from '../components/cart/CartItemCard';
import CartSummary from '../components/cart/CartSummary';
import { selectIsAuthenticated } from '../store/auth';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { selectCartItems, selectCartLoading, fetchCart, removeMultipleItemsFromCart } from '../store/cart';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy state từ Redux
    const items = useAppSelector(selectCartItems);
    const loading = useAppSelector(selectCartLoading);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // State local để quản lý các item được chọn
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // useEffect để fetch giỏ hàng khi component được tải
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart())
                .unwrap()
                .then((cart) => {
                    // Sau khi fetch thành công, mặc định chọn tất cả các sản phẩm
                    setSelectedItems(cart.map(item => item.product.id));
                });
        }
    }, [dispatch, isAuthenticated]);

    /**
     * Xử lý khi người dùng click vào checkbox của một sản phẩm
     */
    const handleSelectItem = (productId: number) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    /**
     * Xử lý khi người dùng click vào checkbox "Chọn tất cả"
     */
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // Chọn tất cả ID sản phẩm trong giỏ hàng
            setSelectedItems(items.map(item => item.product.id));
        } else {
            // Bỏ chọn tất cả
            setSelectedItems([]);
        }
    };

    /**
     * Xử lý khi người dùng click "Xóa các mục đã chọn"
     */
    const handleRemoveSelected = () => {
        if (selectedItems.length > 0) {
            dispatch(removeMultipleItemsFromCart({ productIds: selectedItems }))
                .unwrap()
                .then(() => {
                    setSelectedItems([]); // Reset lại danh sách chọn sau khi xóa thành công
                });
        }
    };

    /**
     * Xử lý khi người dùng click "Tiến hành đặt hàng"
     */
    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            alert('Vui lòng đăng nhập để tiếp tục đặt hàng.');
            navigate('/auth/login');
        }
    };


    // Tính toán tổng tiền chỉ dựa trên các sản phẩm đã được chọn
    const calculatedTotalPrice = items
        .filter(item => selectedItems.includes(item.product.id))
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (!isAuthenticated) {
        return (
            <Container sx={{ textAlign: 'center', my: 10 }}>
                <Typography variant="h5">Giỏ hàng của bạn</Typography>
                <Typography sx={{ my: 2 }}>
                    Vui lòng <MuiLink component={Link} to="/auth/login">đăng nhập</MuiLink> để xem giỏ hàng của bạn.
                </Typography>
            </Container>
        );
    }

    if (loading === 'pending' && items.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary', mb: 4 }}>
                Giỏ hàng
            </Typography>

            {items.length === 0 ? (
                <Box textAlign="center" my={10}>
                    <Typography variant="h6">Giỏ hàng của bạn đang trống.</Typography>
                    <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                        Tiếp tục mua sắm
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        <Box
                            sx={(theme) => ({
                                ...theme.glass,
                                p: 2,
                                borderRadius: theme.spacing(2),
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            })}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedItems.length > 0 && selectedItems.length === items.length}
                                        indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
                                        onChange={handleSelectAll}
                                        disabled={loading === 'pending'}
                                    />
                                }
                                label={`Chọn tất cả (${items.length} sản phẩm)`}
                            />
                            <Button
                                color="error"
                                onClick={handleRemoveSelected}
                                disabled={selectedItems.length === 0 || loading === 'pending'}
                            >
                                Xóa các mục đã chọn ({selectedItems.length})
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {items.map(item => (
                                <Box key={item.product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Checkbox
                                        checked={selectedItems.includes(item.product.id)}
                                        onChange={() => handleSelectItem(item.product.id)}
                                        disabled={loading === 'pending'}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <CartItemCard item={item} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        {/* Truyền hàm handleCheckout vào component con */}
                        <CartSummary totalPrice={calculatedTotalPrice} onCheckout={handleCheckout} />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}