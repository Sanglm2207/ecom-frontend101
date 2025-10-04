import { Button, CircularProgress, type ButtonProps } from '@mui/material';

interface AppButtonProps extends ButtonProps {
    loading?: boolean;
}

export default function AppButton({ children, loading, ...props }: AppButtonProps) {
    return (
        <Button {...props} disabled={loading || props.disabled}>
            {loading ? <CircularProgress size={24} color="inherit" /> : children}
        </Button>
    );
}