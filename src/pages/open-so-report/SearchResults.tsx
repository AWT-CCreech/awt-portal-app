import React, { useState } from 'react';
import { TableCell, Link, IconButton, Modal, Box } from '@mui/material';
import {Warning, Add, Note} from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import NoteModal from './NoteModal';
import { formatAmount } from '../../utils/dataManipulation';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import Modules from '../../app/api/agent';

interface SearchResultsProps {
  results: (OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[];
  groupBySo: boolean;
  containerHeight?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, groupBySo, containerHeight = '100%' }) => {
  const [searchResult, setSearchResult] = useState<(OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[]>(results);
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [selectedSONum, setSelectedSONum] = useState<string>('');
  const [selectedPartNum, setSelectedPartNum] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<TrkSoNote[]>([]);

  const fetchNotesForLineItem = async (soNum: string, partNum: string) => {
    try {
      const response = await Modules.OpenSalesOrderNotes.getNotes(soNum, partNum);
      setSearchResult((prevResults) =>
        prevResults.map((order) => {
          if (order.sonum === soNum && order.itemNum === partNum) {
            return { ...order, notes: response };
          }
          return order;
        })
      );
    } catch (error) {
      console.error('Error fetching notes', error);
    }
  };

  const handleOpenNoteModal = (soNum: string, partNum: string, notes: TrkSoNote[]) => {
    setSelectedSONum(soNum);
    setSelectedPartNum(partNum);
    setSelectedNotes(notes);
    setShowNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    fetchNotesForLineItem(selectedSONum, selectedPartNum); // Refetch notes when closing the modal
  };

  // Define columns and column names before they are used
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

  const isDefaultDate = (date: Date | null) => date?.toLocaleDateString() === '1/1/1900' || date?.toLocaleDateString() === '1/1/1990';

  const renderRow = (order: OpenSOReport & { notes: TrkSoNote[], poLog?: { Id: number, EnteredBy: string, EntryDate: Date } }): React.JSX.Element[] => {
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
      <TableCell key="requiredDate" align="left" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}
          {deliveryAlert && (
            <Warning
              color="error"
              fontSize="small"
              style={{ marginLeft: 4, visibility: 'visible', display: 'inline-block' }}
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
        onClick={hasPoLog ? () => openPoLog(order.poLog!.id) : undefined} 
        style={{ cursor: hasPoLog ? 'pointer' : 'default', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        {hasPoLog ? `${new Date(order.poLog!.entryDate).toLocaleDateString()} (${order.poLog!.enteredBy})` : ''}
      </TableCell>,
      <TableCell key="notes" align="left" style={{ cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <IconButton onClick={() => handleOpenNoteModal(order.sonum || '', order.itemNum || '', order.notes || [])}>
          {hasNotes ? <Note color="primary" /> : <Add />}
        </IconButton>
        {hasNotes && mostRecentNoteDate && (
          <div style={{ fontSize: '0.8em', color: '#888' }}>
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
  };

  const openPoLog = (id: number) => {
    window.open(`/PODetail?id=${id}`, '_blank');
  };

  return (
    <>
      <Box sx={{ height: containerHeight, display: 'flex', flexDirection: 'column' }}>
        <PaginatedSortableTable
          tableData={searchResult}
          columns={columns}
          columnNames={columnNames}
          func={renderRow}
          headerBackgroundColor="#384959"
          hoverColor="#f5f5f5"
        />
      </Box>
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
            maxWidth: '800px',
            borderRadius: 5,
            overflow: 'auto',
            maxHeight: '90vh'
          }}
        >
          <NoteModal
            soNum={selectedSONum}
            partNum={selectedPartNum}
            notes={selectedNotes}
            onClose={handleCloseNoteModal}
            onNoteAdded={() => fetchNotesForLineItem(selectedSONum, selectedPartNum)} // Refetch notes when a new note is added
          />
        </Box>
      </Modal>
    </>
  );
};

export default SearchResults;
