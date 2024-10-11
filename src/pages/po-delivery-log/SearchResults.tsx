import React from 'react';
import { TableCell, TableRow, Box } from '@mui/material';
import { Note, LocalFireDepartment, LocalShipping } from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';

interface SearchResultsProps {
  results: PODeliveryLogs[];
  onRowClick: (event: React.MouseEvent, poDetail: PODeliveryLogs) => void;
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
    'sonum',
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
    let ExpDeliveryAlert = false;
    let DeliveryAlert = false;

    // Determine if the PO is complete based on quantities
    const isPOComplete = po.qtyOrdered <= po.qtyReceived;

    // Only check for alerts if PO is not complete
    if (!isPOComplete) {
      const expectedDelivery = po.expectedDelivery ? new Date(po.expectedDelivery) : null;
      const poRequiredDate = po.poRequiredDate ? new Date(po.poRequiredDate) : null;
      const soRequiredDate = po.soRequiredDate ? new Date(po.soRequiredDate) : null;

      // Check for ExpDeliveryAlert
      if (expectedDelivery && soRequiredDate && expectedDelivery > soRequiredDate) {
        ExpDeliveryAlert = true;
      }

      // Check for DeliveryAlert
      if (
        !expectedDelivery &&
        poRequiredDate &&
        soRequiredDate &&
        poRequiredDate > soRequiredDate
      ) {
        DeliveryAlert = true;
      }
    }

    const rowCells = [
      <TableCell key="ponum" align="left">{po.ponum}</TableCell>,
      <TableCell key="vendorName" align="left">{po.vendorName}</TableCell>,
      <TableCell key="itemNum" align="left">{po.itemNum}</TableCell>,
      <TableCell key="altPartNum" align="left">{po.altPartNum}</TableCell>,
      <TableCell key="issueDate" align="left">
        {po.issueDate ? new Date(po.issueDate).toLocaleDateString() : ''}
      </TableCell>,
      <TableCell key="issuedBy" align="left">{po.issuedBy}</TableCell>,
      <TableCell key="expectedDelivery" align="left">
        <Box display="flex" alignItems="center">
          <span>{po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : ''}</span>
          {ExpDeliveryAlert && (
            <LocalFireDepartment color="error" style={{ marginLeft: 4 }} />
          )}
        </Box>
      </TableCell>,
      <TableCell key="poRequiredDate" align="left">
        <Box display="flex" alignItems="center">
          <span>{po.poRequiredDate ? new Date(po.poRequiredDate).toLocaleDateString() : ''}</span>
          {DeliveryAlert && (
            <LocalFireDepartment color="error" style={{ marginLeft: 4 }} />
          )}
        </Box>
      </TableCell>,
      <TableCell key="qtyOrdered" align="left">{po.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left">{po.qtyReceived}</TableCell>,
      <TableCell key="receiverNum" align="left">{po.receiverNum}</TableCell>,
      <TableCell key="dateDelivered" align="left">
        {po.dateDelivered ? new Date(po.dateDelivered).toLocaleDateString() : ''}
      </TableCell>,
      <TableCell key="sonum" align="left">
        <Box display="flex" alignItems="center">
          <span>{po.sonum}</span>
          {po.isDropShipment && (
            <LocalShipping color="secondary" style={{ marginLeft: 4 }} />
          )}
        </Box>
      </TableCell>,
      <TableCell key="customerName" align="left">{po.customerName}</TableCell>,
      <TableCell key="soRequiredDate" align="left">
        {po.soRequiredDate ? new Date(po.soRequiredDate).toLocaleDateString() : ''}
      </TableCell>,
      <TableCell key="salesRep" align="left">{po.salesRep}</TableCell>,
      <TableCell
        key="notes"
        align="left"
        sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
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
      <TableRow
        key={po.id}
        hover
        onClick={(event) => onRowClick(event, po)}
        sx={{ cursor: 'pointer' }}
      >
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
