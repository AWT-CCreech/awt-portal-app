// pages/open-so-report/SearchResults.tsx
import React, { useState } from 'react';
import { TableCell, Link, IconButton, Modal, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import NoteIcon from '@mui/icons-material/Note';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import NoteModal from './NoteModal';
import { formatAmount } from '../../utils/dataManipulation';
import OpenSalesOrder from '../../models/OpenSalesOrder';
import { TrkSoNote } from '../../models/TrkSoNote';

interface SearchResultsProps {
  results: (OpenSalesOrder & { notes: TrkSoNote[] })[];
  groupBySo: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, groupBySo }) => {
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [selectedSONum, setSelectedSONum] = useState<string>('');
  const [selectedPartNum, setSelectedPartNum] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<TrkSoNote[]>([]);

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
    'Expected Delivery',
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

  const isDefaultDate = (date: Date | null) => date?.toLocaleDateString() === '1/1/1900' || date?.toLocaleDateString() === '1/1/1990';

  const renderRow = (order: OpenSalesOrder & { notes: TrkSoNote[] }): React.JSX.Element[] => {
    const orderDate = order.orderDate ? new Date(order.orderDate) : null;
    const requiredDate = order.requiredDate ? new Date(order.requiredDate) : null;
    const poIssueDate = order.poissueDate ? new Date(order.poissueDate) : null;
    const expectedDelivery = order.expectedDelivery ? new Date(order.expectedDelivery) : null;

    const deliveryAlert = expectedDelivery && requiredDate && expectedDelivery > requiredDate && (order.leftToShip ?? 0) > 0;

    const openEvent = () => {
      window.open(`http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${order.eventId}`);
    };

    const hasNotes = order.notes && order.notes.length > 0;

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
      <TableCell key="sonum" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.sonum}</TableCell>,
      <TableCell key="team" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.accountTeam || order.salesRep}</TableCell>,
      <TableCell key="customerName" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.customerName}</TableCell>,
      <TableCell key="custPo" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.custPo}</TableCell>,
      <TableCell key="orderDate" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{orderDate && !isDefaultDate(orderDate) ? orderDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="requiredDate" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}
          {deliveryAlert && <WarningIcon color="error" fontSize="small" style={{ marginLeft: 4 }} />}
        </div>
      </TableCell>,
      <TableCell key="amountLeft" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{formatAmount(order.amountLeft ?? 0)}</TableCell>,
      <TableCell key="ponum" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.ponum}</TableCell>,
      <TableCell key="poissueDate" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{poIssueDate && !isDefaultDate(poIssueDate) ? poIssueDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="expectedDelivery" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{expectedDelivery && !isDefaultDate(expectedDelivery) ? expectedDelivery.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="qtyOrdered" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.qtyReceived}</TableCell>,
      <TableCell key="poLog" align="left" style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} >{/* PO Log content here */}</TableCell>,
      <TableCell key="notes" align="left" style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <IconButton onClick={() => handleOpenNoteModal(order.sonum || '', order.itemNum || '', order.notes || [])}>
          {hasNotes ? <NoteIcon color="primary" /> : <AddIcon />}
        </IconButton>
      </TableCell>,
    ];

    if (!groupBySo) {
      rowCells.splice(7, 0, <TableCell key="itemNum" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.itemNum} ({order.leftToShip})</TableCell>);
      rowCells.splice(8, 0, <TableCell key="mfgNum" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.mfgNum}</TableCell>);
    }

    return rowCells;
  };

  const handleOpenNoteModal = (soNum: string, partNum: string, notes: TrkSoNote[]) => {
    setSelectedSONum(soNum);
    setSelectedPartNum(partNum);
    setSelectedNotes(notes);
    setShowNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
  };

  return (
    <>
      <PaginatedSortableTable
        tableData={results}
        columns={columns}
        columnNames={columnNames}
        func={renderRow}
        headerBackgroundColor="#384959"
        hoverColor="#f5f5f5"
      />
      <Modal
        open={showNoteModal}
        onClose={handleCloseNoteModal}
        aria-labelledby="note-modal-title"
        aria-describedby="note-modal-description"
        closeAfterTransition
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(3px)',
            }
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '90%',
            maxWidth: '600px',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '90vh'
          }}
        >
          <NoteModal
            soNum={selectedSONum}
            partNum={selectedPartNum}
            notes={selectedNotes}
            onClose={handleCloseNoteModal}
          />
        </Box>
      </Modal>
    </>
  );
};

export default SearchResults;
