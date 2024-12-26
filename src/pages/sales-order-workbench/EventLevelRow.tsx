import React, { useState } from 'react';
import { TableCell, TextField, Checkbox, Link, Snackbar, Alert } from '@mui/material';
import { formatAmount } from '../../shared/utils/dataManipulation';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { SalesOrderUpdateDto } from '../../models/Utility/SalesOrderUpdateDto';

interface EventLevelRowProps {
    row: EventLevelRowData;
    onUpdate: (updateData: SalesOrderUpdateDto) => void;
}

const EventLevelRow: React.FC<EventLevelRowProps> = ({ row, onUpdate }) => {
    const [rwsalesOrderNum, setRwsalesOrderNum] = useState<string>(row.rwsalesOrderNum || '');
    const [dropShipment, setDropShipment] = useState<boolean>(row.dropShipment || false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    const handleSnackbarClose = () => setSnackbar({ open: false, message: '' });

    const handleRwsalesOrderNumBlur = () => {
        if (!/^\d{6}$/.test(rwsalesOrderNum)) {
            setSnackbar({ open: true, message: 'Sales Order Number must be exactly 6 digits.' });
            setRwsalesOrderNum(row.rwsalesOrderNum || '');
            return;
        }
        if (rwsalesOrderNum !== row.rwsalesOrderNum) {
            onUpdate({
                SaleId: row.saleId,
                EventId: row.eventId,
                QuoteId: row.quoteId,
                RWSalesOrderNum: rwsalesOrderNum,
                DropShipment: dropShipment,
                Username: localStorage.getItem('username') ?? '',
                Password: localStorage.getItem('password') ?? '',
                Subject: `Sales Order Updated: ${rwsalesOrderNum}`,
                HtmlBody: `The sales order ${rwsalesOrderNum} has been updated.`,
            });
        }
    };

    const handleDropShipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setDropShipment(newValue);
        onUpdate({
            SaleId: row.saleId,
            EventId: row.eventId,
            QuoteId: row.quoteId,
            RWSalesOrderNum: rwsalesOrderNum,
            DropShipment: newValue,
            Username: localStorage.getItem('username') ?? '',
            Password: localStorage.getItem('password') ?? '',
            Subject: `Sales Order Updated: ${rwsalesOrderNum}`,
            HtmlBody: `The sales order ${rwsalesOrderNum} has been updated.`,
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

export default EventLevelRow;
