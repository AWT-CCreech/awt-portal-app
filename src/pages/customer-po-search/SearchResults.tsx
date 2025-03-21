import React from 'react';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { CustomerPOSearchResult } from '../../models/CustomerPOSearch/CustomerPOSearchResult';
import { formatAmount } from '../../shared/utils/dataManipulation';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface SearchResultsProps {
    items: CustomerPOSearchResult[];
}

const columns = [
    'custPoNo',
    'eventID',
    'saleID',
    'quoteID',
    'customerName',
    'custNum',
    'soTranNo',
    'soTranAmt',
    'soTranDate',
];

const columnNames = [
    'Customer PO No.',
    'Event ID',
    'Sale ID',
    'Quote ID',
    'Customer',
    'Customer ID',
    'SO No.',
    'SO Total',
    'SO Date',
];

const SearchResults: React.FC<SearchResultsProps> = ({ items }) => {
    const renderRow = (row: CustomerPOSearchResult, hoverColor: string) => (
        <TableRow
            key={row.soTranNo}
            hover
            sx={{ '&:hover': { backgroundColor: hoverColor } }}
        >
            <TableCell>{row.custPoNo ?? '-'}</TableCell>
            <TableCell>{row.eventID ?? '-'}</TableCell>
            <TableCell>{row.saleID ?? '-'}</TableCell>
            <TableCell>{row.quoteID ?? '-'}</TableCell>
            <TableCell>{row.customerName}</TableCell>
            <TableCell>{row.custNum}</TableCell>
            <TableCell>{row.soTranNo}</TableCell>
            <TableCell>{formatAmount(row.soTranAmt)}</TableCell>
            <TableCell>{new Date(row.soTranDate).toLocaleDateString()}</TableCell>
        </TableRow>
    );

    return (
        <PaginatedSortableTable
            tableData={items}
            columns={columns}
            columnNames={columnNames}
            func={renderRow}
            headerBackgroundColor="#384959"
            hoverColor="#f5f5f5"
            tableHeight={"50vh"}
        />
    );
};

export default SearchResults;
