import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import EventLevelRow from './EventLevelRow';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';

interface EventLevelProps {
    data: EventLevelRowData[];
    onBatchUpdate: (updates: any[]) => void;
}

const EventLevel: React.FC<EventLevelProps> = ({ data, onBatchUpdate }) => {
    const [pendingUpdates, setPendingUpdates] = useState<any[]>([]);

    const handleRowUpdate = (update: any) => {
        console.log('Update Received in handleRowUpdate:', update); // Debug log
        setPendingUpdates((prevUpdates) => {
            const existingIndex = prevUpdates.findIndex((u) => u.SaleId === update.SaleId);
            if (existingIndex !== -1) {
                const newUpdates = [...prevUpdates];
                newUpdates[existingIndex] = { ...newUpdates[existingIndex], ...update };
                console.log('Updated Pending Updates:', newUpdates); // Debug log
                return newUpdates;
            }
            const newPendingUpdates = [...prevUpdates, update];
            console.log('New Pending Updates:', newPendingUpdates); // Debug log
            return newPendingUpdates;
        });
    };

    const handleSaveChanges = async () => {
        if (pendingUpdates.length > 0) {
            try {
                await onBatchUpdate(pendingUpdates);
                setPendingUpdates([]);
            } catch (error) {
                console.error('Failed to save Event Level changes:', error);
            }
        }
    };

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

    const renderRow = (row: EventLevelRowData) => (
        <TableRow key={row.saleId}>
            <EventLevelRow row={row} onUpdate={handleRowUpdate} />
        </TableRow>
    );

    return (
        <Box>
            <PaginatedSortableTable
                columns={columns}
                columnNames={columnNames}
                tableData={data}
                func={renderRow}
                headerBackgroundColor="#384959"
                hoverColor="#f0f0f0"
                tableHeight={'40vh'}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    disabled={pendingUpdates.length === 0}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
};

export default EventLevel;
