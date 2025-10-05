import { TextField, type TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type CustomTextFieldProps = TextFieldProps & {
    name: string;
};

export default function CustomTextField({ name, ...props }: CustomTextFieldProps) {
    const [field, meta] = useField(name);

    const config = {
        ...field,
        ...props,
        fullWidth: true,
        variant: 'outlined' as 'outlined',
        error: meta.touched && Boolean(meta.error),
        helperText: meta.touched && meta.error,
    };

    return <TextField {...config} />;
}