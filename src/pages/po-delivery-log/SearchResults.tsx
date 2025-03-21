// React
import React from 'react';

// MUI Components and Icons
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import NoteIcon from '@mui/icons-material/Note';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Components
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';

// Models
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';

// Styles
import '../../shared/styles/po-delivery-log/SearchResults.scss';

interface SearchResultsProps {
  results: PODeliveryLogs[];
  onRowClick: (event: React.MouseEvent, poDetail: PODeliveryLogs) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onRowClick,
}) => {
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
    'Issued',
    'By',
    'Revised Delivery Date',
    'PO Req. Date',
    'Ordered',
    'Received',
    'Recvr No.',
    'Date Recvd',
    'SO#',
    'Customer',
    'SO Req. Date',
    'Sales Rep',
    '',
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
      if (!expectedDelivery && poRequiredDate && soRequiredDate && poRequiredDate > soRequiredDate) {
        DeliveryAlert = true;
      }
    }

    // Check if the note edit date is older than 7 days
    const isNoteOld = po.noteEditDate ?
      (new Date().getTime() - new Date(po.noteEditDate).getTime() > 7 * 24 * 60 * 60 * 1000) : false;


    const rowCells = [
      <TableCell key="ponum" align="left">{po.ponum}</TableCell>,
      <TableCell key="vendorName" align="left">{po.vendorName}</TableCell>,
      <TableCell key="itemNum" align="left">{po.itemNum}</TableCell>,
      <TableCell key="altPartNum" align="left">{po.altPartNum}</TableCell>,
      <TableCell key="issueDate" align="left">{po.issueDate ? new Date(po.issueDate).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="issuedBy" align="left">{po.issuedBy}</TableCell>,
      <TableCell key="expectedDelivery" align="left">
        <Box className="expected-delivery">
          <span>{po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : ''}</span>
          {ExpDeliveryAlert && <LocalFireDepartmentIcon color="error" className="alert-icon" />}
        </Box>
      </TableCell>,
      <TableCell key="poRequiredDate" align="left">
        <Box className="po-required-date">
          <span>{po.poRequiredDate ? new Date(po.poRequiredDate).toLocaleDateString() : ''}</span>
          {DeliveryAlert && <LocalFireDepartmentIcon color="error" className="alert-icon" />}
        </Box>
      </TableCell>,
      <TableCell key="qtyOrdered" align="left">{po.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left">{po.qtyReceived}</TableCell>,
      <TableCell key="receiverNum" align="left">{po.receiverNum}</TableCell>,
      <TableCell key="dateDelivered" align="left">{po.dateDelivered ? new Date(po.dateDelivered).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="sonum" align="left">
        <Box className="po-sonum">
          <span>{po.sonum}</span>
          {po.isDropShipment && <LocalShippingIcon color="secondary" className="alert-icon" />}
        </Box>
      </TableCell>,
      <TableCell key="customerName" align="left">{po.customerName}</TableCell>,
      <TableCell key="soRequiredDate" align="left">{po.soRequiredDate ? new Date(po.soRequiredDate).toLocaleDateString() : ''}</TableCell>,
      <TableCell key="salesRep" align="left">{po.salesRep}</TableCell>,
      <TableCell key="notes" align="left" className="note-edit-date">
        {po.notesExist ? (
          <div className="notes-container">
            <NoteIcon color={isNoteOld ? "error" : "primary"} /> {/* Change icon color based on age */}
            {po.noteEditDate && (
              <span className="note-edit-date">
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
        tableHeight={"100vh"}
      />
    </Box>
  );
};

export default SearchResults;
