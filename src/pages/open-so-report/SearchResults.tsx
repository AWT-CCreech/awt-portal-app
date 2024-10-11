import React, { useState, useCallback } from 'react';
import { TableCell, Link, IconButton, Modal, Box } from '@mui/material';
import { Warning, Add, Note } from '@mui/icons-material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import NoteModal from './NoteModal';
import { formatAmount } from '../../utils/dataManipulation';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import Modules from '../../app/api/agent';
import '../../styles/open-so-report/SearchResults.css';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import PODetail from '../po-delivery-log/PODetail';

interface SearchResultsProps {
  results: (OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[];
  groupBySo: boolean;
  containerHeight?: string;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(({ results, groupBySo, containerHeight = '100%' }) => {
  const [searchResult, setSearchResult] = useState<(OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[]>(results);
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [selectedSONum, setSelectedSONum] = useState<string>('');
  const [selectedPartNum, setSelectedPartNum] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<TrkSoNote[]>([]);

  // State variables for PO Detail modal
  const [selectedPO, setSelectedPO] = useState<PODetailUpdateDto | null>(null);
  const [poDetailModalOpen, setPoDetailModalOpen] = useState(false);
  const [poDetailLoading, setPoDetailLoading] = useState(false);

  const fetchNotesForLineItem = useCallback(async (soNum: string, partNum: string) => {
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
  }, []);

  const handleOpenNoteModal = useCallback((soNum: string, partNum: string, notes: TrkSoNote[]) => {
    setSelectedSONum(soNum);
    setSelectedPartNum(partNum);
    setSelectedNotes(notes);
    setShowNoteModal(true);
  }, []);

  const handleCloseNoteModal = useCallback(() => {
    setShowNoteModal(false);
    fetchNotesForLineItem(selectedSONum, selectedPartNum); // Refetch notes when closing the modal
  }, [selectedSONum, selectedPartNum, fetchNotesForLineItem]);

  const openPoLog = useCallback(async (id: number) => {
    setPoDetailModalOpen(true);
    setSelectedPO(null); // Reset selected PO
    setPoDetailLoading(true); // Start loading

    try {
      const poDetail = await Modules.PODeliveryLogService.getPODetailByID(id);
      if (poDetail) {
        setSelectedPO(poDetail);
      } else {
        console.error('PO Detail not found');
        setPoDetailModalOpen(false); // Close modal if no data
      }
    } catch (error) {
      console.error('Error fetching PO detail:', error);
      setPoDetailModalOpen(false); // Close modal if error occurs
    } finally {
      setPoDetailLoading(false); // Stop loading
    }
  }, []);

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
        onClick={hasPoLog ? () => openPoLog(order.poLog!.id) : undefined} 
        style={{ cursor: hasPoLog ? 'pointer' : 'default', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        {hasPoLog ? `${new Date(order.poLog!.entryDate).toLocaleDateString()} (${order.poLog!.enteredBy})` : ''}
      </TableCell>,
      <TableCell key="notes" align="left" className="pointer notes-container">
        <IconButton onClick={() => handleOpenNoteModal(order.sonum || '', order.itemNum || '', order.notes || [])}>
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
  }, [handleOpenNoteModal, groupBySo, openPoLog]);

  return (
    <>
      <Box sx={{ height: containerHeight, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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
      {/* New Modal for PO Details */}
      <Modal
        open={poDetailModalOpen}
        onClose={() => setPoDetailModalOpen(false)}
        aria-labelledby="po-detail-modal-title"
        aria-describedby="po-detail-modal-description"
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
            width: '80vw',
            margin: '50px auto',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <PODetail
            poDetail={selectedPO}
            onClose={() => setPoDetailModalOpen(false)}
            loading={poDetailLoading}
          />
        </Box>
      </Modal>
    </>
  );
});

export default SearchResults;
