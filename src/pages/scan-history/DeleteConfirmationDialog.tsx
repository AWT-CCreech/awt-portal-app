import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { ScanHistory } from '../../models/ScanHistory';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    items: ScanHistory[];
    computeOrderNo: (r: ScanHistory) => string;
}

const DeleteConfirmationDialog: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    items,
    computeOrderNo
}) => {
    // group by orderType
    const grouped = items.reduce<Record<string, ScanHistory[]>>((acc, r) => {
        const key = r.orderType || 'Unknown';
        acc[key] = acc[key] ?? [];
        acc[key].push(r);
        return acc;
    }, {});

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Please double-check the scans you’re about to delete:
                </Typography>
                {Object.entries(grouped).map(([orderType, rows]) => (
                    <Box
                        key={orderType}
                        sx={{
                            mb: 2,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            {orderType}
                        </Typography>
                        <List dense disablePadding>
                            {rows.map(r => (
                                <ListItem key={r.rowId} disableGutters>
                                    <ListItemText
                                        primary={`Order No: ${computeOrderNo(r)}`}
                                        secondary={`Serial No: ${r.serialNo}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
