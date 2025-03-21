import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { formatAmount } from '../../shared/utils/dataManipulation';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { EventLevelUpdateDto } from '../../models/SOWorkbench/EventLevelUpdateDto';

interface EventLevelRowProps {
    row: EventLevelRowData;
    onUpdate: (updateData: EventLevelUpdateDto) => void;
}

const EventLevelRow: React.FC<EventLevelRowProps> = ({ row, onUpdate }) => {
    const [salesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);

    const handleRwsalesOrderNumBlur = () => {
        // Split on comma, trim whitespace, remove empty entries if any
        const soItems = salesOrderNum
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        // Check each token for exactly 6 digits
        const allValid = soItems.every(so => /^\d{6}$/.test(so));

        if (!allValid) {
            // Revert to the previous row value
            setRwsalesOrderNum(row.rwsalesOrderNum || '');
            return;
        }

        // If the value changed and is valid, call onUpdate
        if (salesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                SaleId: row.saleId,
                EventId: row.eventId,
                QuoteId: row.quoteId,
                SalesOrderNum: salesOrderNum,
                DropShipment: dropShipment,
                Username: localStorage.getItem('username') ?? '',
                Password: localStorage.getItem('password') ?? '',
                Subject: `Sales Order Updated: ${salesOrderNum}`,
                HtmlBody: `The sales order(s) ${salesOrderNum} has been updated.`,
            });
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        console.log('Drop Shipment changed:', newValue);
        setDropShipment(newValue);
        onUpdate({
            SaleId: row.saleId,
            EventId: row.eventId,
            QuoteId: row.quoteId,
            SalesOrderNum: salesOrderNum,
            DropShipment: newValue,
            Username: localStorage.getItem('username') ?? '',
            Password: localStorage.getItem('password') ?? '',
            Subject: `Sales Order Updated: ${salesOrderNum}`,
            HtmlBody: `The sales order(s) ${salesOrderNum} has been updated.`,
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
                    value={salesOrderNum}
                    onChange={(e) => setRwsalesOrderNum(e.target.value)}
                    onBlur={handleRwsalesOrderNumBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRwsalesOrderNumBlur();
                    }}
                />
            </TableCell>
            <TableCell align="left">{formatAmount(row.saleTotal)}</TableCell>
            <TableCell align="left">{row.saleDate}</TableCell>
            <TableCell align="left">
                <Checkbox checked={dropShipment} onChange={handleDropShipmentChange} />
            </TableCell>
        </>
    );
};

export default EventLevelRow;
