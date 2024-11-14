import React, { useState } from 'react';
import { TableCell, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { formatAmount } from '../../utils/dataManipulation';

interface DetailLevelRowProps {
    row: any;
    onUpdate: (updateData: any) => void;
}

const DetailLevelRow: React.FC<DetailLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);

    const handleBlur = () => {
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                id: row.id, // Ensure 'id' is part of the flatRow
                field: 'rwsalesOrderNum',
                value: rwsalesOrderNum,
                dropShipment, // Pass current dropShipment state
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (rwsalesOrderNum !== row.rwsalesOrderNum) {
                onUpdate({
                    id: row.id, // Ensure 'id' is part of the flatRow
                    field: 'rwsalesOrderNum',
                    value: rwsalesOrderNum,
                    dropShipment, // Pass current dropShipment state
                });
            }
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setDropShipment(isChecked);
        onUpdate({
            id: row.id,
            field: 'DropShipment',
            value: isChecked,
            dropShipment: isChecked,
        });
    };

    return (
        <>
            <TableCell align="left">
                <TextField
                    size="small"
                    value={rwsalesOrderNum}
                    onChange={(e) => setRwsalesOrderNum(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </TableCell>
            <TableCell align="left">
                {row.qtySold}
            </TableCell>
            <TableCell align="left">
                {row.unitMeasure}
            </TableCell>
            <TableCell align="left">
                {row.partNum}
            </TableCell>
            <TableCell align="left">
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
            <TableCell align="left">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dropShipment}
                            onChange={handleDropShipmentChange}
                            color="primary"
                        />
                    }
                    label=""
                />
            </TableCell>
        </>
    );
};

export default DetailLevelRow;