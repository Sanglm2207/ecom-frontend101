import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import AppRoutes from './routes';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './store/auth';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { useAppDispatch } from './store/hooks';
import { fetchCart } from './store/cart';

function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Thử lấy thông tin người dùng
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => {
        // Nếu lấy user thành công (đã đăng nhập), thì fetch giỏ hàng
        dispatch(fetchCart());
      })
      .catch(() => {
        // Không làm gì nếu chưa đăng nhập
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        {isInitializing ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <AppRoutes />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;