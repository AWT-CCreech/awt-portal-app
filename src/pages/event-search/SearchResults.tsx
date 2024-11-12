// React and Hooks
import React, { useCallback } from 'react';

// MUI Components and Icons
import { Box, TableCell, TableRow, Link } from '@mui/material';

// Components
import PaginatedSortableTable from '../../components/PaginatedSortableTable';

// Models
import { EquipReqSearchResult } from '../../models/EventSearchPage/EquipReqSearchResult';

// Styles
import '../../styles/open-so-report/SearchResults.scss';

interface SearchResultsProps {
    results: EquipReqSearchResult[];
    containerHeight?: string;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(
    ({
        results,
        containerHeight = '100%',
    }) => {
        const allColumns = [
            'eventId',
            'company',
            'contact',
            'salesRep',
            'projectName',
        ];

        const allColumnNames = [
            'Event ID',
            'Company',
            'Contact',
            'Sales Rep',
            'Project Name',
        ];

        const renderRow = useCallback(
            (event: EquipReqSearchResult): React.ReactElement => {
                const eventIdClickHandler = () => {
                    window.open(
                        `http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${event.eventId}`
                    );
                };

                return (
                    <TableRow key={event.eventId} hover>
                        <TableCell
                            align="left"
                            style={{
                                cursor: event.eventId ? 'pointer' : 'default',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                            onClick={event.eventId ? eventIdClickHandler : undefined}
                        >
                            {event.eventId ? (
                                <Link underline="hover" target="_blank" rel="noopener noreferrer">
                                    {event.eventId}
                                </Link>
                            ) : (
                                ''
                            )}
                        </TableCell>
                        <TableCell
                            align="left"
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                            {event.company}
                        </TableCell>
                        <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {event.contact}
                        </TableCell>
                        <TableCell style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {event.salesRep}
                        </TableCell>
                        <TableCell
                            align="left"
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                            {event.projectName || ''}
                        </TableCell>
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
                />
            </Box>
        );
    }
);

export default SearchResults;
