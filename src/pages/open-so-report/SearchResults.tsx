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
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';

// Styles
import '../../styles/open-so-report/SearchResults.css';

interface SearchResultsProps {
  results: (OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[];
  groupBySo: boolean;
  containerHeight?: string;
  onOpenNoteModal: (soNum: string, partNum: string, notes: TrkSoNote[]) => void;
  onOpenPoLog: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(({ results, groupBySo, containerHeight = '100%', onOpenNoteModal, onOpenPoLog }) => {
  const allColumns = [
    'eventId',
    'sonum',
    'accountTeam',
    'customerName',
    'custPo',
    'orderDate',
    'requiredDate',
    'itemNum',
    'mfgNum',
    'amountLeft',
    'ponum',
    'poissueDate',
    'expectedDelivery',
    'qtyOrdered',
    'qtyReceived',
    'poLog',
    'notes',
  ];

  const allColumnNames = [
    'EID',
    'SO #',
    'Team',
    'Customer',
    'Cust PO',
    'Order Date',
    'Req. Date',
    'Missing P/N',
    'Vendor P/N',
    'Amount',
    'PO #',
    'PO Issue Date',
    'Exp. Delivery',
    'Qty Ordered',
    'Qty Received',
    'PO Log',
    'Notes',
  ];

  const columns = groupBySo
    ? allColumns.filter(column => column !== 'itemNum' && column !== 'mfgNum')
    : allColumns;

  const columnNames = groupBySo
    ? allColumnNames.filter(columnName => columnName !== 'Missing P/N' && columnName !== 'Vendor P/N')
    : allColumnNames;

  const isDefaultDate = (date: Date | null) =>
    date?.toLocaleDateString() === '1/1/1900' || date?.toLocaleDateString() === '1/1/1990';

  const renderRow = useCallback((order: OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog }): React.JSX.Element[] => {
    const orderDate = order.orderDate ? new Date(order.orderDate) : null;
    const requiredDate = order.requiredDate ? new Date(order.requiredDate) : null;
    const poIssueDate = order.poissueDate ? new Date(order.poissueDate) : null;
    const expectedDelivery = order.expectedDelivery ? new Date(order.expectedDelivery) : null;

    const deliveryAlert = expectedDelivery && requiredDate && expectedDelivery > requiredDate && (order.leftToShip ?? 0) > 0;

    const openEvent = () => {
      window.open(`http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${order.eventId}`);
    };

    const hasNotes = order.notes && order.notes.length > 0;
    const hasPoLog = order.poLog !== undefined && order.poLog !== null;

    const mostRecentNoteDate = hasNotes
      ? new Date(Math.max(...order.notes.map(note => new Date(note.entryDate!).getTime())))
      : null;

    const rowCells = [
      <TableCell key="eventId" align="left" style={{ cursor: order.eventId ? 'pointer' : 'default', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={order.eventId ? openEvent : undefined}>
        {order.eventId ? (
          <Link underline="hover" target="_blank" rel="noopener noreferrer">
            {order.eventId}
          </Link>
        ) : (
          ''
        )}
      </TableCell>,
      <TableCell key="sonum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.sonum}</TableCell>,
      <TableCell key="team" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.accountTeam || order.salesRep}</TableCell>,
      <TableCell key="customerName" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.customerName}</TableCell>,
      <TableCell key="custPo" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.custPo}</TableCell>,
      <TableCell key="orderDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{orderDate && !isDefaultDate(orderDate) ? orderDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="requiredDate" align="left" className="text-overflow">
        <div className="required-date">
          {requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}
          {deliveryAlert && (
            <Warning
              color="error"
              fontSize="small"
              className="alert-icon"
            />
          )}
        </div>
      </TableCell>,
      <TableCell key="amountLeft" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{formatAmount(order.amountLeft ?? 0)}</TableCell>,
      <TableCell key="ponum" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.ponum}</TableCell>,
      <TableCell key="poissueDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{poIssueDate && !isDefaultDate(poIssueDate) ? poIssueDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="expectedDelivery" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{expectedDelivery && !isDefaultDate(expectedDelivery) ? expectedDelivery.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="qtyOrdered" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.qtyReceived}</TableCell>,
      <TableCell 
        key="poLog" 
        align="left" 
        onClick={hasPoLog ? () => onOpenPoLog(order.poLog!.id) : undefined} 
        style={{ cursor: hasPoLog ? 'pointer' : 'default', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        {hasPoLog ? `${new Date(order.poLog!.entryDate).toLocaleDateString()} (${order.poLog!.enteredBy})` : ''}
      </TableCell>,
      <TableCell key="notes" align="left" className="pointer notes-container">
        <IconButton onClick={() => onOpenNoteModal(order.sonum || '', order.itemNum || '', order.notes || [])}>
          {hasNotes ? <Note color="primary" /> : <Add />}
        </IconButton>
        {hasNotes && mostRecentNoteDate && (
          <div className="notes-edit-date">
            {mostRecentNoteDate.toLocaleDateString()}
          </div>
        )}
      </TableCell>,
    ];

    if (!groupBySo) {
      rowCells.splice(7, 0, <TableCell key="itemNum" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.itemNum} ({order.leftToShip ?? 0})</TableCell>);
      rowCells.splice(8, 0, <TableCell key="mfgNum" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.mfgNum}</TableCell>);
    }

    return rowCells;
  }, [onOpenNoteModal, onOpenPoLog, groupBySo]);

  return (
    <Box sx={{ height: containerHeight, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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
});

export default SearchResults;
