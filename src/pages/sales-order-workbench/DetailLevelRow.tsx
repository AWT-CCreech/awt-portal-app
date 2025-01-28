import React, { useState } from 'react';
import { TableCell, TextField } from '@mui/material';
import { formatAmount } from '../../shared/utils/dataManipulation';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';
import { DetailLevelUpdateDto } from '../../models/SOWorkbench/DetailLevelUpdateDto';

interface DetailLevelRowProps {
    row: DetailLevelRowData;
    onUpdate: (updateData: DetailLevelUpdateDto) => void;
}

const DetailLevelRow: React.FC<DetailLevelRowProps> = ({ row, onUpdate }) => {
    const [salesOrderNum, setSalesOrderNum] = useState<string>(row.salesOrderNum || '');

    const handleFieldChange = (field: keyof DetailLevelRowData, value: any) => {
        // (Optional) Validate salesOrderNum if needed; 
        // Otherwise, simply store new value and pass upward for parent-level handling.

        if (field === 'salesOrderNum') {
            setSalesOrderNum(value);
        }

        onUpdate({
            EventId: row.eventId,
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
            <TableCell align="left">{row.rwsalesOrderNum}</TableCell>
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
        </>
    );
};

export default DetailLevelRow;
