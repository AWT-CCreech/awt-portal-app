import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
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
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleRowUpdate = (update: any) => {
        setPendingUpdates((prevUpdates) => {
            const existingIndex = prevUpdates.findIndex((u) => u.SaleId === update.SaleId);
            if (existingIndex !== -1) {
                const newUpdates = [...prevUpdates];
                newUpdates[existingIndex] = update; // Update existing entry
                return newUpdates;
            }
            return [...prevUpdates, update]; // Add new entry
        });
    };

    const handleSaveChanges = async () => {
        if (pendingUpdates.length > 0) {
            try {
                await onBatchUpdate(pendingUpdates);
                setSnackbar({ open: true, message: 'Event Level changes saved successfully.', severity: 'success' });
                setPendingUpdates([]);
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to save Event Level changes.', severity: 'error' });
            }
        }
    };

    const handleSnackbarClose = () => setSnackbar({ open: false, message: '', severity: 'success' });

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
                    Save Changes
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EventLevel;
