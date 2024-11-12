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
        'saleId',
        'billToCompanyName',
        'saleTotal',
        'rwsalesOrderNum', // Correct casing to match backend
        'dropShipment',   // Correct casing to match backend
        'saleDate',
        'salesRep',
    ];

    const columnNames = [
        'Sale ID',
        'Bill To',
        'Sales Total',
        'MAS SO#(s)',
        'Drop Shipment',
        'Sale Date',
        'Sales Rep',
    ];

    const renderRow = (row: any) => {
        const flatRow = {
            saleId: row.salesOrder.saleId,
            billToCompanyName: row.salesOrder.billToCompanyName || '',
            saleTotal: row.salesOrder.saleTotal,
            rwsalesOrderNum: row.salesOrder.rwsalesOrderNum || '',
            dropShipment: row.salesOrder.dropShipment || false,
            saleDate: row.salesOrder.saleDate,
            salesRep: row.salesOrder.salesRep || '',
        };

        return (
            <TableRow key={row.salesOrder.saleId}>
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