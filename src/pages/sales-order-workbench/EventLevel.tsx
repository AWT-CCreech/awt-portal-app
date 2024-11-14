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
        'billToCompanyName',
        'saleTotal',
        'rwsalesOrderNum',
        'saleDate',
        'dropShipment',
    ];

    const columnNames = [
        'Sale ID',
        'Bill To',
        'Sales Total',
        'MAS SO#(s)',
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
            salesRep: row.salesOrder.salesRep || '',
            version: row.salesOrder.version,
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