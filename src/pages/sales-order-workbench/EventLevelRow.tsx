import React, { useState } from 'react';
import { TableCell, TextField, Checkbox } from '@mui/material';
import { formatAmount } from '../../utils/dataManipulation';

interface EventLevelRowProps {
    row: any;
    onUpdate: (updateData: any) => void;
}

const EventLevelRow: React.FC<EventLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);

    const handleRwsalesOrderNumBlur = () => {
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                id: row.saleId, // Ensure 'id' is part of the flatRow
                field: 'rwsalesOrderNum',
                value: rwsalesOrderNum,
            });
        }
    };

    const handleRwsalesOrderNumKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (rwsalesOrderNum !== row.rwsalesOrderNum) {
                onUpdate({
                    id: row.saleId, // Ensure 'id' is part of the flatRow
                    field: 'rwsalesOrderNum',
                    value: rwsalesOrderNum,
                });
            }
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setDropShipment(newValue);
        onUpdate({
            id: row.saleId, // Ensure 'id' is part of the flatRow
            field: 'dropShipment',
            value: newValue,
        });
    };

    return (
        <>
            <TableCell>
                <TextField
                    size="small"
                    value={rwsalesOrderNum}
                    onChange={(e) => setRwsalesOrderNum(e.target.value)}
                    onBlur={handleRwsalesOrderNumBlur}
                    onKeyDown={handleRwsalesOrderNumKeyDown}
                />
            </TableCell>
            <TableCell align="left">
                {row.qtySold}
            </TableCell>
            <TableCell align="left">
                {row.unitMeasure}
            </TableCell>
            <TableCell>
                {row.partNum}
            </TableCell>
            <TableCell>
                {row.partDesc}
            </TableCell>
            <TableCell
                align="left"
                sx={{ fontWeight: 'bold', color: '#1E88E5' }}
            >
                {formatAmount(row.unitPrice)}
            </TableCell>
            <TableCell align="left">
                {row.salesRep}
            </TableCell>
            <TableCell align="center">
                <Checkbox
                    checked={dropShipment}
                    onChange={handleDropShipmentChange}
                />
            </TableCell>
        </>
    );
};

export default EventLevelRow;