import React from 'react';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import EventLevelRow from './EventLevelRow';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';

interface EventLevelProps {
    data: EventLevelRowData[];
    onUpdate: (updateData: any) => void;
}

const EventLevel: React.FC<EventLevelProps> = ({ data, onUpdate }) => {
    const columns = [
        'saleId',
        'salesRep',
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

    const renderRow = (row: EventLevelRowData) => {
        return (
            <TableRow key={row.saleId}>
                <EventLevelRow row={row} onUpdate={onUpdate} />
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
            tableHeight={'40vh'}
        />
    );
};

export default EventLevel;