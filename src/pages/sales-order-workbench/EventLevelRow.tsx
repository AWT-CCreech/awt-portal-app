import React, { useState } from 'react';
import { TableCell, TextField, Checkbox, Link } from '@mui/material';
import { formatAmount } from '../../utils/dataManipulation';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';

interface EventLevelRowProps {
    row: EventLevelRowData;
    onUpdate: (updateData: any) => void;
}

const EventLevelRow: React.FC<EventLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);

    const handleRwsalesOrderNumBlur = () => {
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                type: 'event',
                id: row.saleId,
                field: 'RWSalesOrderNum',
                value: rwsalesOrderNum,
                dropShipment, // Pass current dropShipment state
            });
        }
    };

    const handleRwsalesOrderNumKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (rwsalesOrderNum !== row.rwsalesOrderNum) {
                onUpdate({
                    type: 'event',
                    id: row.saleId,
                    field: 'RWSalesOrderNum',
                    value: rwsalesOrderNum,
                    dropShipment, // Pass current dropShipment state
                });
            }
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setDropShipment(newValue);
        onUpdate({
            type: 'event',
            id: row.saleId,
            field: 'DropShipment',
            value: newValue,
            dropShipment: newValue,
        });
    };

    const saleIdClickHandler = () => {
        window.open(
            `http://10.0.0.8:81/inet/Quotes/qtViewSalesOrder.asp?SaleID=${row.saleId}&EventID=${row.eventId}&QuoteID=${row.quoteId}&UpdFlag=0`
        );
    };

    return (
        <>
            <TableCell
                align="left"
                style={{
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}
                onClick={saleIdClickHandler}
            >
                <Link underline="hover" target="_blank" rel="noopener noreferrer">
                    SO-{row.eventId}-{row.version}
                </Link>
            </TableCell>
            <TableCell align="left">{row.salesRep}</TableCell>
            <TableCell align="left">{row.billToCompanyName}</TableCell>
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
                        handleRwsalesOrderNumBlur();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRwsalesOrderNumBlur();
                    }}
                />
            </TableCell>
            <TableCell align="left">{formatAmount(row.saleTotal)}</TableCell>
            <TableCell align="left">{row.saleDate}</TableCell>
            <TableCell align="left">
                <Checkbox
                    checked={dropShipment}
                    onChange={handleDropShipmentChange}
                />
            </TableCell>
        </>
    );
};

export default EventLevelRow;
