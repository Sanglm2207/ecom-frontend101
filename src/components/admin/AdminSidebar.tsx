import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const drawerWidth = 240;

const menuItems = [
    { text: 'Tổng quan', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Đơn hàng', icon: <ShoppingBagIcon />, path: '/admin/orders' },
    { text: 'Sản phẩm', icon: <CategoryIcon />, path: '/admin/products' },
    { text: 'Khuyến mại', icon: <ConfirmationNumberIcon />, path: '/admin/coupons' },
    { text: 'Khách hàng', icon: <PeopleIcon />, path: '/admin/users' },
];

export default function AdminSidebar() {
    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' } }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    KAIDEV ADMIN
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            end={item.path === '/admin'}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                '&.active': { // Style này sẽ được áp dụng khi route active
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    }
                                }
                            }
                            }
                        >
                            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: '40px' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer >
    );
}