import React, { useCallback } from 'react';
import { TableRow, TableCell, Link, Box } from '@mui/material';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import Grid2 from '@mui/material/Grid2';

// Import the ScanHistory front end model
import { ScanHistory } from '../../models/ScanHistory';

interface SearchResultsProps {
    results: ScanHistory[];
    containerHeight?: string;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(
    ({ results, containerHeight = '60vh' }) => {
        // Define the table columns and the header names
        const allColumns = [
            'rowId',
            'scanDate',
            'scannerId',
            'orderType',
            'userName',
            'soNo',
            'poNo',
            'rmano',
            'partNo',
            'serialNo',
            'notes',
        ];

        const allColumnNames = [
            'Row ID',
            'Scan Date',
            'Scanner',
            'Order Type',
            'User Name',
            'SO No',
            'PO No',
            'RMA No',
            'Part No',
            'Serial No',
            'Notes',
        ];

        // Callback to render each row in the table
        const renderRow = useCallback(
            (record: ScanHistory): React.ReactElement => {
                // Optional: If a row should be clickable to open details, add an event handler.
                const rowClickHandler = () => {
                    // For example, open a details view (adjust URL as needed)
                    window.open(`/scan-history/details/${record.rowId}`, '_blank');
                };

                return (
                    <TableRow key={record.rowId} hover>
                        <TableCell
                            align="left"
                            style={{
                                cursor: record.rowId ? 'pointer' : 'default',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                            onClick={record.rowId ? rowClickHandler : undefined}
                        >
                            {record.rowId ? (
                                <Link underline="hover" target="_blank" rel="noopener noreferrer">
                                    {record.rowId}
                                </Link>
                            ) : (
                                ''
                            )}
                        </TableCell>
                        <TableCell align="left">
                            {record.scanDate ? new Date(record.scanDate).toLocaleDateString() : ''}
                        </TableCell>
                        <TableCell align="left">{record.scannerId || ''}</TableCell>
                        <TableCell align="left">{record.orderType || ''}</TableCell>
                        <TableCell align="left">{record.userName || ''}</TableCell>
                        <TableCell align="left">{record.soNo || ''}</TableCell>
                        <TableCell align="left">{record.poNo || ''}</TableCell>
                        <TableCell align="left">{record.rmano || ''}</TableCell>
                        <TableCell align="left">{record.partNo || ''}</TableCell>
                        <TableCell align="left">{record.serialNo || ''}</TableCell>
                        <TableCell align="left">{record.notes || ''}</TableCell>
                    </TableRow>
                );
            },
            []
        );

        return (
            <Box
                sx={{
                    height: containerHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                <PaginatedSortableTable
                    tableData={results}
                    columns={allColumns}
                    columnNames={allColumnNames}
                    func={renderRow}
                    headerBackgroundColor="#384959"
                    hoverColor="#f5f5f5"
                    tableHeight="100vh"
                />
            </Box>
        );
    }
);

export default SearchResults;
