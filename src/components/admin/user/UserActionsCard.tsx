import { Card, CardHeader, Divider, CardContent, Button, Box, Typography } from '@mui/material';
import type { User } from '../../../store/auth';

interface UserActionsCardProps {
    user: User;
    onDelete: () => void;
    onResetPassword: () => void;
}

export default function UserActionsCard({ user, onDelete, onResetPassword }: UserActionsCardProps) {
    return (
        <Card>
            <CardHeader title="Hành động" />
            <Divider />
            <CardContent>
                <Box mb={2}>
                    <Button variant="outlined" onClick={onResetPassword}>
                        Gửi email reset mật khẩu
                    </Button>
                    <Typography variant="caption" display="block" mt={1}>
                        Một link reset mật khẩu sẽ được gửi đến email của người dùng.
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Xóa người dùng này
                    </Button>
                    <Typography variant="caption" display="block" mt={1}>
                        Hành động này không thể hoàn tác.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}