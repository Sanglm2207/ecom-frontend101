import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        glass: {
            backdropFilter: string;
            backgroundColor: string;
            border: string;
            boxShadow: string;
        };
    }
    interface ThemeOptions {
        glass?: {
            backdropFilter?: string;
            backgroundColor?: string;
            border?: string;
            boxShadow?: string;
        };
    }
}

const theme = createTheme({
    palette: {
        mode: 'dark', // Phong cách Apple thường dùng nền tối để hiệu ứng kính nổi bật
        primary: {
            main: '#0A84FF', // Màu xanh dương sáng của Apple
        },
        background: {
            paper: 'rgba(29, 29, 31, 0.75)',
            default: '#000000',
        },
        text: {
            primary: '#F5F5F7',
            secondary: '#A1A1A6',
        },
    },
    typography: {
        fontFamily: '"SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    // Định nghĩa style "glass"
    glass: {
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(29, 29, 31, 0.75)', // Màu nền tối có độ trong suốt
        border: '1px solid rgba(80, 80, 80, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(29, 29, 31, 0.75)', // Màu nền cho AppBar
                    backdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(80, 80, 80, 0.5)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(40, 40, 42, 0.75)',
                    backdropFilter: 'blur(15px) saturate(150%)',
                    border: '1px solid rgba(80, 80, 80, 0.5)',
                    borderRadius: '16px',
                },
            },
        },
    }
});

export default theme;