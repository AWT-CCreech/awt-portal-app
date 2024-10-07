import React from 'react';
import { TableCell, TableRow, Box } from '@mui/material';
import { Note } from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';

interface SearchResultsProps {
  results: PODeliveryLogs[];
  onRowClick: (poDetail: PODeliveryLogs) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onRowClick }) => {
  const columns = [
    'ponum',
    'vendorName',
    'itemNum',
    'altPartNum',
    'issueDate',
    'issuedBy',
    'expectedDelivery',
    'poRequiredDate',
    'qtyOrdered',
    'qtyReceived',
    'receiverNum',
    'dateDelivered',
    'salesOrderNum',
    'customerName',
    'soRequiredDate',
    'salesRep',
    'notesExist',
  ];

  const columnNames = [
    'PO#',
    'Vendor',
    'AWT P/N',
    'MFG P/N',
    'Issue Date',
    'Issued By',
    'Revised Delivery Date',
    'PO Required Date',
    'Ordered',
    'Received',
    'Recvr No.',
    'Date Recvd',
    'SO#',
    'Customer',
    'SO Req Date',
    'Sales Rep',
    'Notes Exist',
  ];

  const renderRow = (po: PODeliveryLogs): React.JSX.Element => {
    const rowCells = [
      <TableCell key="ponum" align="left">{po.ponum}</TableCell>,
      <TableCell key="vendorName" align="left">{po.vendorName}</TableCell>,
      <TableCell key="itemNum" align="left">{po.itemNum}</TableCell>,
      <TableCell key="altPartNum" align="left">{po.altPartNum}</TableCell>,
      <TableCell key="issueDate" align="left">{po.issueDate ? new Date(po.issueDate).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="issuedBy" align="left">{po.issuedBy}</TableCell>,
      <TableCell key="expectedDelivery" align="left">{po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="poRequiredDate" align="left">{po.poRequiredDate ? new Date(po.poRequiredDate).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="qtyOrdered" align="left">{po.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left">{po.qtyReceived}</TableCell>,
      <TableCell key="receiverNum" align="left">{po.receiverNum}</TableCell>,
      <TableCell key="dateDelivered" align="left">{po.dateDelivered ? new Date(po.dateDelivered).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="salesOrderNum" align="left">{po.salesOrderNum}</TableCell>,
      <TableCell key="customerName" align="left">{po.customerName}</TableCell>,
      <TableCell key="soRequiredDate" align="left">{po.soRequiredDate ? new Date(po.soRequiredDate).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="salesRep" align="left">{po.salesRep}</TableCell>,
      <TableCell key="notes" align="left" sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {po.notesExist ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Note color="primary" />
            {po.noteEditDate && (
              <span style={{ fontSize: '0.8em', marginTop: '4px' }}>
                {new Date(po.noteEditDate).toLocaleDateString()}
              </span>
            )}
          </div>
        ) : null}
      </TableCell>,
    ];

    return (
      <TableRow key={po.id} hover onClick={() => onRowClick(po)} style={{ cursor: 'pointer' }}>
        {rowCells}
      </TableRow>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PaginatedSortableTable
        tableData={results}
        columns={columns}
        columnNames={columnNames}
        func={renderRow}
        headerBackgroundColor="#384959"
        hoverColor="#f5f5f5"
      />
    </Box>
  );
};

export default SearchResults;
