import React from 'react';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import EventLevelRow from './EventLevelRow'; // Import the new row component

interface EventLevelProps {
    data: any[];
    onUpdate: (updateData: any) => void;
}

const EventLevel: React.FC<EventLevelProps> = ({ data, onUpdate }) => {
    const columns = [
        'eventId',
        'uName',
        'billToCompanyName',
        'rwsalesOrderNum',
        'saleTotal',
        'saleDate',
        'dropShipment',
    ];

    const columnNames = [
        'Sale ID',
        'Sales Rep',
        'Bill To',
        'MAS SO#(s)',
        'Sales Total',
        'Sale Date',
        'Drop Shipment',
    ];

    const renderRow = (row: any) => {
        const flatRow = {
            eventId: row.salesOrder.eventId,
            billToCompanyName: row.salesOrder.billToCompanyName || '',
            saleTotal: row.salesOrder.saleTotal,
            rwsalesOrderNum: row.salesOrder.rwsalesOrderNum || '',
            dropShipment: row.salesOrder.dropShipment || false,
            saleDate: row.salesOrder.saleDate,
            salesRep: row.accountManager.uname || '',
            version: row.salesOrder.version,
            saleId: row.salesOrder.saleId,
            quoteId: row.salesOrder.quoteId,
        };

        return (
            <TableRow key={row.salesOrder.eventId}>
                <EventLevelRow row={flatRow} onUpdate={onUpdate} />
            </TableRow>
        );
    };

    return (
        <PaginatedSortableTable
            columns={columns}
            columnNames={columnNames}
            tableData={data}
            func={renderRow}
            headerBackgroundColor="#384959"
            hoverColor="#f0f0f0"
        />
    );
};

export default EventLevel;