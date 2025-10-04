import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Box,
    IconButton,
    Badge,
    Button,
    Container,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    ClickAwayListener,
    Popper,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { selectIsAuthenticated, selectCurrentUser } from '../../store/auth/selectors';
import { logout } from '../../store/auth/reducers';
import authApi from '../../api/authApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTotalCartItems } from '../../store/cart';
import SearchSuggestions from '../SearchSuggestions';
import { clearSuggestions, fetchSearchSuggestions } from '../../store/order';
import { useDebounce } from '../../hooks/useDebounce';

// --- Styled Components for Search Bar ---
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));
// ------------------------------------------

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy state từ Redux
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const totalCartItems = useAppSelector(selectTotalCartItems);

    // State để quản lý menu người dùng
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchAnchorRef = useRef<HTMLDivElement>(null); // Ref cho vị trí của Popper

    // Sử dụng debounce hook
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

    useEffect(() => {
        if (debouncedSearchTerm) {
            dispatch(fetchSearchSuggestions({ keyword: debouncedSearchTerm, limit: 5 }));
        } else {
            dispatch(clearSuggestions());
        }
    }, [debouncedSearchTerm, dispatch]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        // Luôn hiển thị dropdown khi đang gõ
        if (event.target.value) {
            setShowSuggestions(true);
        }
    };

    const handleCloseSuggestions = () => {
        setShowSuggestions(false);
    };

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();
        try {
            await authApi.logout(); // Gọi API backend để xóa refresh token cookie
        } catch (error) {
            console.error("Logout failed on server:", error);
            // Vẫn tiếp tục logout ở phía client dù server có lỗi
        } finally {
            dispatch(logout()); // Cập nhật Redux state: isAuthenticated = false, user = null
            navigate('/auth/login'); // Chuyển hướng về trang đăng nhập
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={(theme) => ({
                ...theme.glass,
                position: 'sticky',
                top: 0,
                zIndex: theme.zIndex.appBar,
            })}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link} // Dùng Link của react-router-dom
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        KAIDEV SHOP
                    </Typography>

                    {/* Spacer - đẩy các mục về 2 phía */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Thanh tìm kiếm */}
                    <ClickAwayListener onClickAway={handleCloseSuggestions}>
                        <Box sx={{ position: 'relative' }}>
                            {/* Thanh tìm kiếm */}
                            <Search ref={searchAnchorRef}>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => { if (searchTerm) setShowSuggestions(true); }}
                                />
                            </Search>

                            {/* Dropdown gợi ý */}
                            <Popper
                                open={showSuggestions && searchTerm.length > 0}
                                anchorEl={searchAnchorRef.current}
                                placement="bottom-start"
                                disablePortal
                                sx={{ width: searchAnchorRef.current?.clientWidth, zIndex: 1200, pt: 1 }}
                            >
                                <SearchSuggestions onClose={handleCloseSuggestions} />
                            </Popper>
                        </Box>
                    </ClickAwayListener>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Các nút action bên phải */}
                    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Giỏ hàng">
                            <IconButton component={Link} to="/cart" size="large" color="inherit">
                                <Badge badgeContent={isAuthenticated ? totalCartItems : 0} color="error">
                                    <ShoppingCartOutlinedIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {isAuthenticated && user ? (
                            // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
                            <Box>
                                <Tooltip title="Mở cài đặt">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user.username.toUpperCase()}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                                        <Typography textAlign="center">Tài khoản</Typography>
                                    </MenuItem>
                                    {user.role === 'ADMIN' && (
                                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin'); }}>
                                            <Typography textAlign="center">Trang quản trị</Typography>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Đăng xuất</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ---
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button component={Link} to="/auth/login" color="inherit">
                                    Đăng nhập
                                </Button>
                                <Button
                                    component={Link}
                                    to="/auth/register"
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                                >
                                    Đăng ký
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}