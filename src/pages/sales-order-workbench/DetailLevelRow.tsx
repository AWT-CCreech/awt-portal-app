import React, { useState } from 'react';
import { TableCell, TextField, Checkbox, Snackbar, Alert } from '@mui/material';
import { formatAmount } from '../../shared/utils/dataManipulation';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';
import { EquipmentRequestUpdateDto } from '../../models/Utility/EquipmentRequestUpdateDto';

interface DetailLevelRowProps {
    row: DetailLevelRowData;
    onUpdate: (updateData: EquipmentRequestUpdateDto) => void;
}

const DetailLevelRow: React.FC<DetailLevelRowProps> = ({ row, onUpdate }) => {
    const [salesOrderNum, setSalesOrderNum] = useState<string>(row.salesOrderNum || '');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    const handleSnackbarClose = () => setSnackbar({ open: false, message: '' });

    const handleFieldChange = (field: keyof DetailLevelRowData, value: any) => {
        if (field === 'salesOrderNum' && !/^\d{6}$/.test(value)) {
            setSnackbar({ open: true, message: 'Sales Order Number must be exactly 6 digits.' });
            setSalesOrderNum(row.salesOrderNum || '');
            return;
        }

        if (field === 'salesOrderNum') setSalesOrderNum(value);

        onUpdate({
            RequestId: row.requestId,
            SalesOrderNum: field === 'salesOrderNum' ? value : salesOrderNum,
            Username: localStorage.getItem('username') ?? '',
            Password: localStorage.getItem('password') ?? '',
            Subject: `Equipment Request Updated: ${salesOrderNum}`,
            HtmlBody: `The equipment request ${salesOrderNum} has been updated.`,
        });
    };

    return (
        <>
            <TableCell align="left">
                <TextField
                    size="small"
                    value={salesOrderNum}
                    onChange={(e) => handleFieldChange('salesOrderNum', e.target.value)}
                />
            </TableCell>
            <TableCell align="left">{row.qtySold}</TableCell>
            <TableCell align="left">{row.unitMeasure}</TableCell>
            <TableCell align="left">{row.partNum}</TableCell>
            <TableCell align="left">{row.partDesc}</TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', color: '#1E88E5' }}>
                {formatAmount(row.unitPrice)}
            </TableCell>
            <TableCell align="left">{row.salesRep}</TableCell>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="warning">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DetailLevelRow;
