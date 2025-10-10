import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import AppRoutes from './routes';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './store/auth';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { useAppDispatch } from './store/hooks';
import { fetchCart } from './store/cart';
import { wsConnect } from './store/socket';
import { fetchUnreadNotifications } from './store/notification';
function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Thử lấy thông tin người dùng
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((user) => { // user được trả về từ payload
        // Nếu lấy user thành công
        dispatch(fetchCart());
        // Truyền role vào action
        dispatch(fetchUnreadNotifications({ role: user.role }));
        dispatch(wsConnect());
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