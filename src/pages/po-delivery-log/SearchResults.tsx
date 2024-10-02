import React from 'react';
import { TableCell, TableRow, Box } from '@mui/material'; // Added TableRow import
import { Note } from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { PODeliveryLog } from '../../models/PODeliveryLog/PODeliveryLog';

interface SearchResultsProps {
  results: PODeliveryLog[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const openPoDetail = (id: number) => {
    window.open(`/PODetail?id=${id}`, '_blank');
  };

  const columns = [
    'ponum',
    'vendorName',
    'itemNum',
    'altPartNum',      // Mfg Part #
    'issueDate',
    'issuedBy',
    'expectedDelivery', // Revised Del Date
    'poRequiredDate',   // PO Req Date
    'qtyOrdered',
    'qtyReceived',
    'receiverNum',
    'dateDelivered',    // Date Recvd
    'salesOrderNum',    // SO #
    'customerName',
    'soRequiredDate',   // SO Req Date
    'salesRep',
    'notes'
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
    'Notes'
  ];

  const isDefaultDate = (date: Date | null) =>
    date?.toLocaleDateString() === '1/1/1900' || date?.toLocaleDateString() === '1/1/1990';

  const renderRow = (po: PODeliveryLog): React.JSX.Element => {
    const issueDate = po.issueDate ? new Date(po.issueDate) : null;
    const requiredDate = po.poRequiredDate ? new Date(po.poRequiredDate) : null;
    const revisedDeliveryDate = po.expectedDelivery ? new Date(po.expectedDelivery) : null;
    const dateDelivered = po.dateDelivered ? new Date(po.dateDelivered) : null;
    const soRequiredDate = po.soRequiredDate ? new Date(po.soRequiredDate) : null;
    const noteEditDate = po.noteEditDate ? new Date(po.noteEditDate) : null;

    const hasNotes = po.notes && po.notes.toLowerCase() === 'yes';

    const highlightStyle = {
      backgroundColor: '#ed8794',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    };

    const rowCells = [
      <TableCell key="ponum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.ponum}</TableCell>,
      <TableCell key="vendorName" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.vendorName}</TableCell>,
      <TableCell key="itemNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.itemNum}</TableCell>,
      <TableCell key="altPartNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.altPartNum}</TableCell>,
      <TableCell key="issueDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{issueDate && !isDefaultDate(issueDate) ? issueDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="issuedBy" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.issuedBy}</TableCell>,
      <TableCell key="expectedDelivery" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{revisedDeliveryDate && !isDefaultDate(revisedDeliveryDate) ? revisedDeliveryDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="poRequiredDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="qtyOrdered" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.qtyReceived}</TableCell>,
      <TableCell key="receiverNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.receiverNum}</TableCell>,
      <TableCell key="dateDelivered" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{dateDelivered && !isDefaultDate(dateDelivered) ? dateDelivered.toLocaleDateString() : ''}</TableCell>,
      // Column: SO#
      <TableCell key="salesOrderNum" align="left" style={highlightStyle}>
        {po.salesOrderNum}
      </TableCell>,

      // Column: Customer
      <TableCell key="customerName" align="left" style={highlightStyle}>
        {po.customerName}
      </TableCell>,

      // Column: SO Req Date
      <TableCell key="soRequiredDate" align="left" style={highlightStyle}>
        {soRequiredDate ? soRequiredDate.toLocaleDateString() : ''}
      </TableCell>,

      // Column: Sales Rep
      <TableCell key="salesRep" align="left" style={highlightStyle}>
        {po.salesRep}
      </TableCell>,

      // Column: Notes
      <TableCell key="notes" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {hasNotes ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Note color="primary" />
            {noteEditDate && !isDefaultDate(noteEditDate) && (
              <span style={{ fontSize: '0.8em', marginTop: '4px' }}>
                {noteEditDate.toLocaleDateString()}
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
        onClick={() => openPoDetail(po.id)}
        style={{ cursor: 'pointer' }}
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
