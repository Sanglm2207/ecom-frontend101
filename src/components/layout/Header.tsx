import { useState, useEffect, useRef, type MouseEvent, type ChangeEvent } from 'react';
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
    Popper,
    ClickAwayListener,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { useDebounce } from '../../hooks/useDebounce';
import { fetchSearchSuggestions, clearSuggestions } from '../../store/search';
import SearchSuggestions from '../SearchSuggestions';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../../store/auth';
import { selectTotalCartItems } from '../../store/cart';
import authApi from '../../api/authApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { wsDisconnect } from '../../store/socket';
import { selectUserUnreadNotificationCount } from '../../store/notification';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationPopover from '../NotificationPopover';

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

    // --- Lấy State từ Redux ---
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const totalCartItems = useAppSelector(selectTotalCartItems);

    // --- State cho UI ---
    // Menu người dùng
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    // Tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchAnchorRef = useRef<HTMLDivElement>(null);

    // Debounce cho việc tìm kiếm
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            dispatch(fetchSearchSuggestions({ keyword: debouncedSearchTerm, limit: 5 }));
        } else {
            dispatch(clearSuggestions());
        }
    }, [debouncedSearchTerm, dispatch]);

    // --- Handlers ---
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = async () => {
        handleCloseUserMenu();
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed on server:", error);
        } finally {
            dispatch(wsDisconnect()); // Dispatch action để ngắt kết nối
            dispatch(logout());
            navigate('/auth/login');
        }
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        if (newSearchTerm) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleCloseSuggestions = () => {
        setShowSuggestions(false);
        setSearchTerm(''); // Xóa searchTerm khi click ra ngoài
    };

    const unreadNotificationCount = useAppSelector(selectUserUnreadNotificationCount);
    const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);
    const handleOpenNotifMenu = (event: MouseEvent<HTMLElement>) => setAnchorElNotif(event.currentTarget);
    const handleCloseNotifMenu = () => setAnchorElNotif(null);


    return (
        <AppBar position="sticky" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography variant="h6" noWrap component={Link} to="/"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 700, color: 'inherit', textDecoration: 'none' }}
                    >
                        KAIDEV SHOP
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Search Component Wrapper */}
                    <ClickAwayListener onClickAway={handleCloseSuggestions}>
                        <Box sx={{ position: 'relative' }}>
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
                            <Popper
                                open={showSuggestions && searchTerm.length > 0}
                                anchorEl={searchAnchorRef.current}
                                placement="bottom-start"
                                disablePortal
                                sx={{ width: searchAnchorRef.current?.clientWidth, zIndex: (theme) => theme.zIndex.modal, pt: 1 }}
                            >
                                <SearchSuggestions onClose={handleCloseSuggestions} />
                            </Popper>
                        </Box>
                    </ClickAwayListener>

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

                        {isAuthenticated && (
                            <>
                                <Tooltip title="Thông báo">
                                    <IconButton onClick={handleOpenNotifMenu} size="large" color="inherit">
                                        <Badge badgeContent={unreadNotificationCount} color="error">
                                            <NotificationsOutlinedIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <NotificationPopover
                                    anchorEl={anchorElNotif}
                                    onClose={handleCloseNotifMenu}
                                    notificationsSource="user" // Chỉ định nguồn là "user"
                                />
                            </>
                        )}

                        {isAuthenticated && user ? (
                            // Giao diện khi đã đăng nhập
                            <Box>
                                <Tooltip title="Mở cài đặt">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user.username.toUpperCase()}>{user.username.charAt(0).toUpperCase()}</Avatar>
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
                                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>Tài khoản</MenuItem>
                                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile/orders'); }}>
                                        <Typography textAlign="center">Đơn hàng của tôi</Typography>
                                    </MenuItem>
                                    {user.role === 'ADMIN' && (
                                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin'); }}>Trang quản trị</MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            // Giao diện khi chưa đăng nhập
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button component={Link} to="/auth/login" color="inherit">Đăng nhập</Button>
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