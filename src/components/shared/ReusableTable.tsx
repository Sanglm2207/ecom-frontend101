import React, { useState, useEffect, type ReactNode } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, CircularProgress, Typography, Box, TextField, InputAdornment, TableSortLabel,
    IconButton, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDebounce } from '../../hooks/useDebounce';
import type { Page } from '../../types';

// --- Định nghĩa Types ---
export interface ColumnConfig<T> {
    id: string;
    label: string;
    align?: 'right' | 'left' | 'center';
    render?: (item: T) => ReactNode;
    sortable?: boolean;
}

export interface ActionItem<T> {
    label: string;
    icon?: React.ReactElement;
    onClick: (item: T) => void;
    color?: string;
    disabled?: (item: T) => boolean;
}

interface ReusableTableProps<T> {
    columns: ColumnConfig<T>[];
    fetchData: (params: { page: number; size: number; sort?: string; filter?: string }) => Promise<Page<T>>;
    title: string;
    searchPlaceholder: string;
    searchFields: string[];
    rowActions?: ActionItem<T>[];
    mainAction?: ReactNode;
    refreshKey?: number;
    onRowClick?: (item: T) => void;
}

function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
// -----------------------

export default function ReusableTable<T extends { id: any }>({
    columns,
    fetchData,
    title,
    searchPlaceholder,
    searchFields,
    rowActions,
    refreshKey = 0,
    mainAction,
    onRowClick,
}: ReusableTableProps<T>) {
    // --- States ---
    const [data, setData] = useState<Page<T> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'id', direction: 'desc' });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const sortParam = `${sort.field},${sort.direction}`;

        let filterParam;
        if (debouncedSearchTerm.trim() && searchFields.length > 0) {
            filterParam = searchFields
                .map(field => `${field}:'${debouncedSearchTerm}'`)
                .join(' or ');
        }

        const params: { page: number; size: number; sort?: string; filter?: string } = {
            page,
            size: rowsPerPage,
            sort: sortParam,
        };

        if (filterParam) {
            params.filter = filterParam;
        }

        fetchData(params)
            .then(setData)
            .catch((err) => {
                setError("Không thể tải dữ liệu.");
            })
            .finally(() => setLoading(false));

    }, [page, rowsPerPage, debouncedSearchTerm, sort, fetchData, refreshKey, searchFields]);


    const handleSortRequest = (field: string) => {
        const isAsc = sort.field === field && sort.direction === 'asc';
        setSort({ field, direction: isAsc ? 'desc' : 'asc' });
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: T) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };
    const handleMenuClose = () => setAnchorEl(null);
    const handleMenuExited = () => setSelectedItem(null);

    return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
            <Box sx={{ p: 2, px: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">{title}</Typography>
                    {mainAction}
                </Box>
                <TextField
                    label={searchPlaceholder} variant="outlined" size="small" fullWidth
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                />
            </Box>
            <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id} align={col.align} sx={{ fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sort.field === col.id} direction={sort.field === col.id ? sort.direction : 'asc'}
                                        onClick={() => col.sortable && handleSortRequest(col.id)} hideSortIcon={!col.sortable}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {rowActions && <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (<TableRow><TableCell colSpan={columns.length + 1} align="center" sx={{ py: 10, border: 'none' }}><CircularProgress /></TableCell></TableRow>)
                            : !data || data.content.length === 0 ? (<TableRow><TableCell colSpan={columns.length + 1} align="center" sx={{ py: 10, border: 'none' }}><Typography>{error || 'Không tìm thấy dữ liệu.'}</Typography></TableCell></TableRow>)
                                : (
                                    data.content.map((item) => (
                                        <TableRow
                                            key={item.id} onClick={() => onRowClick && onRowClick(item)}
                                            sx={{ cursor: onRowClick ? 'pointer' : 'default' }} hover
                                        >
                                            {columns.map((col) => (
                                                <TableCell key={col.id} align={col.align}>
                                                    {col.render ? col.render(item) : getNestedValue(item, col.id) as ReactNode}
                                                </TableCell>
                                            ))}
                                            {rowActions && (
                                                <TableCell align="right" sx={{ pr: 2 }}>
                                                    <IconButton size="small" onClick={(e) => handleMenuClick(e, item)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]} component="div"
                count={data?.totalElements || 0} rowsPerPage={rowsPerPage} page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />

            <Menu
                anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                TransitionProps={{ onExited: handleMenuExited }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {selectedItem && rowActions?.map((action, index) => (
                    <MenuItem
                        key={action.label + index}
                        onClick={() => { action.onClick(selectedItem); handleMenuClose(); }}
                        disabled={action.disabled ? action.disabled(selectedItem) : false}
                        sx={{ color: action.color }}
                    >
                        {action.icon && <ListItemIcon>{React.cloneElement(action.icon, { sx: { color: action.color }, fontSize: 'small' })}</ListItemIcon>}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Paper>
    );
}