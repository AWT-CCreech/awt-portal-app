// React and Hooks
import React, { useCallback } from 'react';

// MUI Components and Icons
import { Box, TableCell, Link, IconButton } from '@mui/material';
import { Warning, Add, Note } from '@mui/icons-material';

// Components
import PaginatedSortableTable from '../../components/PaginatedSortableTable';

// Utilities
import { formatAmount } from '../../utils/dataManipulation';

// Models
import EquipReqSearchResult from '../../models/EventSearchPage/EquipReqSearchResult';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';

// Styles
import '../../styles/open-so-report/SearchResults.scss';

interface SearchResultsProps {
    results: (EquipReqSearchResult)[];
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


        const isDefaultDate = (date: Date | null) =>
            date?.toLocaleDateString() === '1/1/1900' ||
            date?.toLocaleDateString() === '1/1/1990';

        const renderRow = useCallback(
            (
                event: EquipReqSearchResult
            ): React.JSX.Element[] => {
                const eventId = () => {
                    window.open(
                        `http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${event.eventId}`
                    );
                };
                const company = event.company;
                const contact = event.contact;
                const salesRep = event.salesRep;
                const projectName = event.projectName ? event.projectName : null;


                const rowCells = [
                    <TableCell
                        key="eventId"
                        align="left"
                        style={{
                            cursor: event.eventId ? 'pointer' : 'default',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                        onClick={event.eventId ? eventId : undefined}
                    >
                        {event.eventId ? (
                            <Link underline="hover" target="_blank" rel="noopener noreferrer">
                                {event.eventId}
                            </Link>
                        ) : (
                            ''
                        )}
                    </TableCell>,
                    <TableCell
                        key="contact"
                        align="left"
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        {event.contact}
                    </TableCell>,
                    <TableCell
                        key="company"
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        {event.company}
                    </TableCell>,
                    <TableCell
                        key="salesRep"
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        {event.salesRep}
                    </TableCell>,
                    <TableCell
                        key="projectName"
                        align="left"
                        style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                        {event.projectName || undefined}
                    </TableCell>,

                ];


                return rowCells;
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
