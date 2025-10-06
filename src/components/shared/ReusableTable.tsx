import { useState, useEffect, type ReactNode } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, CircularProgress, Typography, Box, TextField, InputAdornment, TableSortLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../hooks/useDebounce';
import type { Page } from '../../types';

export interface ColumnConfig<T> {
    id: string;
    label: string;
    align?: 'right' | 'left' | 'center';
    render?: (item: T) => ReactNode;
    sortable?: boolean;
}

interface ReusableTableProps<T> {
    columns: ColumnConfig<T>[];
    fetchData: (params: { page: number, size: number, sort?: string, filter?: string }) => Promise<Page<T>>;
    title: string;
    searchPlaceholder: string;
    searchFields: string[];
    renderActions?: (item: T) => ReactNode;
    refreshKey?: number;
    mainAction?: ReactNode; // Prop mới để nhận nút hành động chính
}

function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export default function ReusableTable<T extends { id: any }>({
    columns,
    fetchData,
    title,
    searchPlaceholder,
    searchFields,
    renderActions,
    refreshKey = 0,
    mainAction, // Nhận nút hành động chính
}: ReusableTableProps<T>) {

    const [data, setData] = useState<Page<T> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState<{ field: string, direction: 'asc' | 'desc' }>({ field: 'id', direction: 'desc' });

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        console.log(">>> ReusableTable useEffect triggered. Reason:");
        console.log({ page, rowsPerPage, debouncedSearchTerm, sort: sort.direction, field: sort.field, refreshKey });

        setLoading(true);
        setError(null);
        const sortParam = `${sort.field},${sort.direction}`;

        let filterParam;
        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '' && searchFields.length > 0) {
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
            .catch(err => {
                setError("Không thể tải dữ liệu.");
            })
            .finally(() => setLoading(false));

    }, [page, rowsPerPage, debouncedSearchTerm, sort, fetchData, refreshKey, searchFields]);

    const handleSortRequest = (field: string) => {
        const isAsc = sort.field === field && sort.direction === 'asc';
        setSort({ field, direction: isAsc ? 'desc' : 'asc' });
    };

    const renderTableContent = () => {
        if (loading) {
            return <TableRow><TableCell colSpan={columns.length + (renderActions ? 1 : 0)} align="center" sx={{ py: 10, border: 'none' }}><CircularProgress /></TableCell></TableRow>;
        }
        if (error) {
            return <TableRow><TableCell colSpan={columns.length + (renderActions ? 1 : 0)} align="center" sx={{ py: 10, color: 'error.main', border: 'none' }}><Typography>{error}</Typography></TableCell></TableRow>;
        }
        if (!data || data.content.length === 0) {
            return <TableRow><TableCell colSpan={columns.length + (renderActions ? 1 : 0)} align="center" sx={{ py: 10, border: 'none' }}><Typography>Không tìm thấy dữ liệu.</Typography></TableCell></TableRow>;
        }
        return data.content.map((item) => (
            <TableRow key={item.id} hover>
                {columns.map((col) => (
                    <TableCell key={col.id} align={col.align}>
                        {col.render ? col.render(item) : getNestedValue(item, col.id) as ReactNode}
                    </TableCell>
                ))}
                {renderActions && <TableCell align="right" sx={{ pr: 2 }}>{renderActions(item)}</TableCell>}
            </TableRow>
        ));
    };

    return (
        <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
            <Box sx={{ p: 2, px: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        {title}
                    </Typography>
                    {mainAction}
                </Box>
                <TextField
                    label={searchPlaceholder}
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                    }}
                />
            </Box>

            <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id} align={col.align} sx={{ fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sort.field === col.id}
                                        direction={sort.field === col.id ? sort.direction : 'asc'}
                                        onClick={() => col.sortable && handleSortRequest(col.id)}
                                        hideSortIcon={!col.sortable}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {renderActions && <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderTableContent()}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={data?.totalElements || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
        </Paper>
    );
}