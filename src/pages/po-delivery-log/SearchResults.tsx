import React, { useState } from 'react';
import { TableCell, IconButton, Box } from '@mui/material';
import { Note, Add } from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { formatAmount } from '../../utils/dataManipulation';
import { TrkPoLog } from '../../models/TrkPoLog';
import Modules from '../../app/api/agent';

interface SearchResultsProps {
  results: any[]; // Use your correct typing for the PO data
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const [searchResult, setSearchResult] = useState<any[]>(results);

  const openPoDetail = (id: number) => {
    window.open(`/PODetail?id=${id}`, '_blank');
  };

  // Define columns and column names before they are used
  const columns = [
    'ponum',
    'vendorName',
    'issueDate',
    'itemNum',
    'qtyOrdered',
    'qtyReceived',
    'receiverNum',
    'requiredDate',
    'dateDelivered',
    'editDate',
    'expectedDelivery',
    'salesOrderNum',
    'salesRep',
    'issuedBy',
    'itemClassId',
    'altPartNum',
    'postatus',
    'notes'
  ];

  const columnNames = [
    'PO #',
    'Vendor',
    'Issue Date',
    'Part Number',
    'Quantity Ordered',
    'Quantity Received',
    'Receiver Number',
    'Required Date',
    'Date Delivered',
    'Edit Date',
    'Expected Delivery',
    'Sales Order Number',
    'Sales Representative',
    'Issued By',
    'Item Class ID',
    'Alternate Part Number',
    'PO Status',
    'Notes'
  ];

  const isDefaultDate = (date: Date | null) => 
    date?.toLocaleDateString() === '1/1/1900' || date?.toLocaleDateString() === '1/1/1990';

  const renderRow = (po: any): React.JSX.Element[] => {
    const issueDate = po.issueDate ? new Date(po.issueDate) : null;
    const requiredDate = po.requiredDate ? new Date(po.requiredDate) : null;
    const dateDelivered = po.dateDelivered ? new Date(po.dateDelivered) : null;
    const editDate = po.editDate ? new Date(po.editDate) : null;
    const expectedDelivery = po.expectedDelivery ? new Date(po.expectedDelivery) : null;

    const hasNotes = po.notes && po.notes.length > 0;

    const rowCells = [
      <TableCell key="ponum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.ponum}</TableCell>,
      <TableCell key="vendorName" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.vendorName}</TableCell>,
      <TableCell key="issueDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{issueDate && !isDefaultDate(issueDate) ? issueDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="itemNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.itemNum}</TableCell>,
      <TableCell key="qtyOrdered" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.qtyReceived}</TableCell>,
      <TableCell key="receiverNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.receiverNum}</TableCell>,
      <TableCell key="requiredDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="dateDelivered" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{dateDelivered && !isDefaultDate(dateDelivered) ? dateDelivered.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="editDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{editDate && !isDefaultDate(editDate) ? editDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="expectedDelivery" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{expectedDelivery && !isDefaultDate(expectedDelivery) ? expectedDelivery.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="salesOrderNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.salesOrderNum}</TableCell>,
      <TableCell key="salesRep" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.salesRep || 'N/A'}</TableCell>,
      <TableCell key="issuedBy" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.issuedBy}</TableCell>,
      <TableCell key="itemClassId" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.itemClassId}</TableCell>,
      <TableCell key="altPartNum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.altPartNum}</TableCell>,
      <TableCell key="postatus" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{po.postatus}</TableCell>,
      <TableCell key="notes" align="left" style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <IconButton onClick={() => openPoDetail(po.id)}>
          {hasNotes ? <Note color="primary" /> : <Add />}
        </IconButton>
      </TableCell>,
    ];

    return rowCells;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PaginatedSortableTable
        tableData={searchResult}
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
