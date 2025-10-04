import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Sử dụng các hook này trong toàn bộ ứng dụng thay vì `useDispatch` và `useSelector` gốc
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();