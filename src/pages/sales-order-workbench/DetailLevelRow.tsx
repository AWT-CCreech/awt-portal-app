import React, { useState } from 'react';
import { TableCell, TextField } from '@mui/material';
import { formatAmount } from '../../utils/dataManipulation';

interface DetailLevelRowProps {
    row: any;
    onUpdate: (updateData: any) => void;
}

const DetailLevelRow: React.FC<DetailLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');

    const handleBlur = () => {
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                id: row.id, // Ensure 'id' is part of the flatRow
                field: 'rwsalesOrderNum',
                value: rwsalesOrderNum,
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
                });
            }
        }
    };

    return (
        <>
            <TableCell>
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
        </>
    );
};

export default DetailLevelRow;