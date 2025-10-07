import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ProfilePage() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary', mb: 3 }}>
                Tài khoản của tôi
            </Typography>
            <Paper sx={(theme) => ({ ...theme.glass })}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                    <Tab icon={<PersonIcon />} iconPosition="start" label="Thông tin cá nhân" />
                    <Tab icon={<LockIcon />} iconPosition="start" label="Đổi mật khẩu" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <UpdateProfileForm />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ChangePasswordForm />
                </TabPanel>
            </Paper>
        </Container>
    );
}