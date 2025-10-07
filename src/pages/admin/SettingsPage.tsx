import { useState, type SyntheticEvent } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';

import UpdateProfileForm from '../../components/profile/UpdateProfileForm';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

// Component TabPanel để hiển thị nội dung của tab tương ứng
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`setting-tabpanel-${index}`} aria-labelledby={`setting-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// Mảng cấu hình cho các Tab
const TABS = [
    { label: 'Hồ sơ', icon: <PersonIcon />, component: <UpdateProfileForm /> },
    { label: 'Đổi mật khẩu', icon: <LockIcon />, component: <ChangePasswordForm /> },
    { label: 'Thanh toán', icon: <CreditCardIcon />, component: <Typography>Tính năng đang phát triển...</Typography> },
    { label: 'Thông báo', icon: <NotificationsIcon />, component: <Typography>Tính năng đang phát triển...</Typography> },
    { label: 'Bảo mật', icon: <SecurityIcon />, component: <Typography>Tính năng đang phát triển...</Typography> },
];

export default function SettingsPage() {
    const [currentTab, setCurrentTab] = useState(0);

    const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Cài đặt tài khoản
            </Typography>

            {/* Paper chính bao bọc toàn bộ nội dung */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>

                {/* Thanh Tabs ngang */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleChangeTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="setting tabs"
                    >
                        {TABS.map((tab, index) => (
                            <Tab
                                key={tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                                label={tab.label}
                                id={`setting-tab-${index}`}
                                aria-controls={`setting-tabpanel-${index}`}
                                sx={{ minHeight: 64, textTransform: 'none', fontSize: '1rem', px: 3 }}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Nội dung của các Tab, nằm ngay bên dưới thanh Tabs */}
                {/* minHeight để đảm bảo nó chiếm hết không gian còn lại nếu nội dung ngắn */}
                <Box sx={{ minHeight: 'calc(100vh - 400px)' }}>
                    {TABS.map((tab, index) => (
                        <TabPanel key={tab.label} value={currentTab} index={index}>
                            {tab.component}
                        </TabPanel>
                    ))}
                </Box>

            </Paper>
        </Box>
    );
}