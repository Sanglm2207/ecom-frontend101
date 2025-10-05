import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectSearchLoading, selectSearchSuggestions } from '../store/search';
interface SearchSuggestionsProps {
    onClose: () => void;
}

export default function SearchSuggestions({ onClose }: SearchSuggestionsProps) {
    const suggestions = useAppSelector(selectSearchSuggestions);
    const loading = useAppSelector(selectSearchLoading);

    if (loading === 'pending') {
        return (
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
            </Paper>
        );
    }

    if (suggestions.length === 0) {
        return (
            <Paper sx={{ p: 2 }}>
                <Typography>Không tìm thấy sản phẩm nào.</Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <List>
                {suggestions.map((product) => (
                    <ListItem
                        key={product.id}
                        component={Link}
                        to={`/products/${product.id}`}
                        onClick={onClose} // Đóng suggestions khi click
                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemAvatar>
                            <Avatar variant="square" src={`https://via.placeholder.com/40?text=${product.name.charAt(0)}`} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={product.name}
                            secondary={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}