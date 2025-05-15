import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface Props {
    open: boolean;
    sourceLabel: string;
    copyOrderType: string;
    copyOrderNum: string;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onConfirm: () => void;
    onTypeChange: (e: SelectChangeEvent) => void;
    onNumChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CopyScansDialog: React.FC<Props> = ({
    open,
    sourceLabel,
    copyOrderType,
    copyOrderNum,
    loading,
    error,
    onClose,
    onConfirm,
    onTypeChange,
    onNumChange
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Duplicate Scans</DialogTitle>
        <DialogContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pt: 2,
                minWidth: 360
            }}
        >
            <Typography variant="subtitle1">
                Copying scans from <strong>{sourceLabel}</strong> to:
            </Typography>

            <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select label="Order Type" value={copyOrderType} onChange={onTypeChange}>
                    {['SO', 'PO', 'RMA', 'RTV/C'].map(opt => (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Order No"
                value={copyOrderNum}
                onChange={onNumChange}
                error={!!error}
                helperText={error || ''}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
                onClick={onConfirm}
                disabled={!copyOrderType || !copyOrderNum || loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Copy'}
            </Button>
        </DialogActions>
    </Dialog>
);

export default CopyScansDialog;
