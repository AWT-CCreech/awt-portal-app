import React, { useState } from 'react';
import { TableCell, TextField, Checkbox } from '@mui/material';
import { formatAmount } from '../../utils/dataManipulation';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';

interface DetailLevelRowProps {
    row: DetailLevelRowData;
    onUpdate: (updateData: any) => void;
}

const DetailLevelRow: React.FC<DetailLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);

    const handleBlur = () => {
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                type: 'detail',
                id: row.id,
                field: 'RWSalesOrderNum',
                value: rwsalesOrderNum,
                dropShipment,
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (rwsalesOrderNum !== row.rwsalesOrderNum) {
                onUpdate({
                    type: 'detail',
                    id: row.id,
                    field: 'RWSalesOrderNum',
                    value: rwsalesOrderNum,
                    dropShipment,
                });
            }
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setDropShipment(isChecked);
        onUpdate({
            type: 'detail',
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
                    onBlur={() => {
                        if (!/^\d{6}$/.test(rwsalesOrderNum)) {
                            alert('Sales Order Number must be exactly 6 digits.');
                            setRwsalesOrderNum(row.rwsalesOrderNum || '');
                            return;
                        }
                        handleBlur();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlur();
                    }}
                />
            </TableCell>
            <TableCell align="left">{row.qtySold}</TableCell>
            <TableCell align="left">{row.unitMeasure}</TableCell>
            <TableCell align="left">{row.partNum}</TableCell>
            <TableCell align="left">{row.partDesc}</TableCell>
            <TableCell
                align="left"
                sx={{ fontWeight: 'bold', color: '#1E88E5' }}
            >
                {formatAmount(row.unitPrice)}
            </TableCell>
            <TableCell align="left">{row.salesRep}</TableCell>
            <TableCell align="left">
                <Checkbox
                    checked={dropShipment}
                    onChange={handleDropShipmentChange}
                />
            </TableCell>
        </>
    );
};

export default DetailLevelRow;
