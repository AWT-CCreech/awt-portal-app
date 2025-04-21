// src/pages/scan-history/SearchResults.tsx
import React, { useCallback } from 'react';
import { TableRow, TableCell, Link, Box, Typography } from '@mui/material';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';

import { ScanHistory } from '../../models/ScanHistory';

interface SearchResultsProps {
    results: ScanHistory[];
    containerHeight?: string;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(
    ({ results, containerHeight = '60vh' }) => {
        // Now we collapse scanDate + userName into one "userInfo" column
        const columns = [
            'rowId',
            'orderType',
            'orderNo',    // logical column, not a real property
            'userInfo',   // combined user+date
            'partNo',
            'serialNo',
            'notes',
        ];

        const columnNames = [
            'Row ID',
            'Order Type',
            'Order No',
            'User / Date',
            'Part No',
            'Serial No',
            'Notes',
        ];

        const renderRow = useCallback(
            (record: ScanHistory): React.ReactElement => {
                // Compute Order No as before
                const orderNo = (() => {
                    switch (record.orderType) {
                        case 'SO':
                            return record.soNo ?? '';
                        case 'PO':
                            return record.poNo ?? '';
                        case 'RMA':
                            return record.rmano ?? '';
                        case 'RTV/C':
                            return record.rtvRmaNo ?? record.rtvid?.toString() ?? '';
                        default:
                            return '';
                    }
                })();

                // Format the scan date
                const formattedDate = record.scanDate
                    ? new Date(record.scanDate).toLocaleDateString()
                    : '';

                const openDetail = () => {
                    window.open(`/scanhistory/details/${record.rowId}`, '_blank');
                };

                return (
                    <TableRow key={record.rowId} hover>
                        {/* Row ID */}
                        <TableCell
                            align="left"
                            sx={{
                                cursor: record.rowId ? 'pointer' : 'default',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                            onClick={record.rowId ? openDetail : undefined}
                        >
                            {record.rowId ? (
                                <Link underline="hover" target="_blank" rel="noopener noreferrer">
                                    {record.rowId}
                                </Link>
                            ) : (
                                ''
                            )}
                        </TableCell>

                        {/* Order Type */}
                        <TableCell align="left">{record.orderType || ''}</TableCell>

                        {/* Computed Order No */}
                        <TableCell align="left">{orderNo}</TableCell>

                        {/* Combined User / Date */}
                        <TableCell align="left">
                            <Box>
                                <Typography variant="body1">
                                    {record.userName || ''}
                                </Typography>
                                {formattedDate && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontStyle: 'italic', lineHeight: 1 }}
                                    >
                                        {formattedDate}
                                    </Typography>
                                )}
                            </Box>
                        </TableCell>

                        {/* Part No */}
                        <TableCell align="left">{record.partNo || ''}</TableCell>

                        {/* Serial No */}
                        <TableCell align="left">{record.serialNo || ''}</TableCell>

                        {/* Notes */}
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
                    columns={columns}
                    columnNames={columnNames}
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
