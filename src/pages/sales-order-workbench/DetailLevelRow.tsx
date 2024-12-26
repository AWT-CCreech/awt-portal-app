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
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    const handleSnackbarClose = () => setSnackbar({ open: false, message: '' });

    const handleFieldChange = (field: keyof DetailLevelRowData, value: any) => {
        if (field === 'rwsalesOrderNum' && !/^\d{6}$/.test(value)) {
            setSnackbar({ open: true, message: 'Sales Order Number must be exactly 6 digits.' });
            setRwsalesOrderNum(row.rwsalesOrderNum || '');
            return;
        }

        if (field === 'rwsalesOrderNum') setRwsalesOrderNum(value);
        if (field === 'dropShipment') setDropShipment(value);

        onUpdate({
            RequestId: row.requestId,
            RWSalesOrderNum: field === 'rwsalesOrderNum' ? value : rwsalesOrderNum,
            DropShipment: field === 'dropShipment' ? value : dropShipment,
            Username: localStorage.getItem('username') ?? '',
            Password: localStorage.getItem('password') ?? '',
            Subject: `Equipment Request Updated: ${rwsalesOrderNum}`,
            HtmlBody: `The equipment request ${rwsalesOrderNum} has been updated.`,
        });
    };

    return (
        <>
            <TableCell align="left">
                <TextField
                    size="small"
                    value={rwsalesOrderNum}
                    onChange={(e) => handleFieldChange('rwsalesOrderNum', e.target.value)}
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
            <TableCell align="left">
                <Checkbox
                    checked={dropShipment}
                    onChange={(e) => handleFieldChange('dropShipment', e.target.checked)}
                />
            </TableCell>
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
