import { TextField, MenuItem } from '@mui/material';
import { useField } from 'formik';

interface Option {
    id: number | string;
    name: string;
}

interface CustomSelectProps {
    name: string;
    label: string;
    options: Option[];
}

export default function CustomSelect({ name, label, options }: CustomSelectProps) {
    const [field, meta] = useField(name);

    const config = {
        ...field,
        select: true,
        label: label,
        fullWidth: true,
        variant: 'outlined',
        error: meta.touched && Boolean(meta.error),
        helperText: meta.touched && meta.error,
    };

    return (
        <TextField {...config}>
            <MenuItem value={0} disabled><em>Chọn...</em></MenuItem>
            {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                    {option.name}
                </MenuItem>
            ))}
        </TextField>
    );
}