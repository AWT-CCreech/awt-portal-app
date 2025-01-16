import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import DetailLevelRow from './DetailLevelRow';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';

interface DetailLevelProps {
    data: DetailLevelRowData[];
    onBatchUpdate: (updates: any[]) => void;
}

const DetailLevel: React.FC<DetailLevelProps> = ({ data, onBatchUpdate }) => {
    const [pendingUpdates, setPendingUpdates] = useState<any[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleRowUpdate = (update: any) => {
        setPendingUpdates((prevUpdates) => {
            const existingIndex = prevUpdates.findIndex((u) => u.Id === update.Id);
            if (existingIndex !== -1) {
                const newUpdates = [...prevUpdates];
                newUpdates[existingIndex] = update;
                return newUpdates;
            }
            return [...prevUpdates, update];
        });
    };

    const handleSaveChanges = async () => {
        if (pendingUpdates.length > 0) {
            try {
                onBatchUpdate(pendingUpdates);
                setSnackbar({ open: true, message: 'Detail Level changes saved successfully.', severity: 'success' });
                setPendingUpdates([]);
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to save Detail Level changes.', severity: 'error' });
            }
        }
    };

    const handleSnackbarClose = () => setSnackbar({ open: false, message: '', severity: 'success' });

    const columns = [
        'rwsalesOrderNum',
        'qtySold',
        'unitMeasure',
        'partNum',
        'partDesc',
        'unitPrice',
        'salesRep',
    ];

    const columnNames = [
        'MAS SO#',
        'Qty Sold',
        'U/M',
        'Part Num',
        'Part Desc',
        'Unit Price',
        'Sales Rep',
    ];

    const renderRow = (row: DetailLevelRowData) => (
        <TableRow key={row.id}>
            <DetailLevelRow row={row} onUpdate={handleRowUpdate} />
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

export default DetailLevel;
