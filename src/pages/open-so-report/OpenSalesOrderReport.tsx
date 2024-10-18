// React and Hooks
import React, { useState, useCallback } from 'react';

// Components
import PageHeader from '../../components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import NoteModal from './NoteModal';
import PODetail from '../po-delivery-log/PODetail';

// API and Data Manipulation
import agent from '../../app/api/agent';
import { formatAmount } from '../../utils/dataManipulation';
import * as XLSX from 'xlsx';

// MUI Components and Styling
import { Box, Container, Grid, Typography, Snackbar, Modal } from '@mui/material';
import { grey } from '@mui/material/colors';

// Models
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';

const OpenSalesOrderReport: React.FC = () => {
  const [searchParams, setSearchParams] = useState<OpenSalesOrderSearchInput>({} as OpenSalesOrderSearchInput);
  const [searchResult, setSearchResult] = useState<(OpenSOReport & { notes: TrkSoNote[], poLog?: TrkPoLog })[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueSalesOrders, setUniqueSalesOrders] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Modal state variables
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [selectedSONum, setSelectedSONum] = useState<string>('');
  const [selectedPartNum, setSelectedPartNum] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<TrkSoNote[]>([]);

  const [selectedPO, setSelectedPO] = useState<PODetailUpdateDto | null>(null);
  const [poDetailModalOpen, setPoDetailModalOpen] = useState(false);
  const [poDetailLoading, setPoDetailLoading] = useState(false);

  const getResultSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agent.OpenSalesOrderReport.fetchOpenSalesOrders(searchParams);
      setSearchResult(response);
      setUniqueSalesOrders(new Set(response.map(order => order.sonum)).size);
      setTotalItems(response.length);
      setTotalAmount(response.reduce((acc, order) => acc + (order.amountLeft || 0), 0));
    } catch (error) {
      console.error('Error fetching open sales orders', error);
      setError('Failed to fetch sales orders. Please try again.');
      setSearchResult([]);
      setUniqueSalesOrders(0);
      setTotalItems(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleExport = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(searchResult);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OpenSOReport');
    XLSX.writeFile(wb, 'OpenSOReport.xlsx');
  }, [searchResult]);

  const handleCloseSnackbar = useCallback(() => {
    setError(null);
  }, []);

  // Function to fetch notes for a line item
  const fetchNotesForLineItem = useCallback(async (soNum: string, partNum: string) => {
    try {
      const response = await agent.OpenSalesOrderNotes.getNotes(soNum, partNum);
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

  // Function to handle opening the note modal
  const handleOpenNoteModal = useCallback((soNum: string, partNum: string, notes: TrkSoNote[]) => {
    setSelectedSONum(soNum);
    setSelectedPartNum(partNum);
    setSelectedNotes(notes);
    setShowNoteModal(true);
  }, []);

  // Function to handle closing the note modal
  const handleCloseNoteModal = useCallback(() => {
    setShowNoteModal(false);
    fetchNotesForLineItem(selectedSONum, selectedPartNum); // Refetch notes when closing the modal
  }, [selectedSONum, selectedPartNum, fetchNotesForLineItem]);

  // Function to open the PO Log modal
  const openPoLog = useCallback(async (id: number) => {
    setPoDetailModalOpen(true);
    setSelectedPO(null); // Reset selected PO
    setPoDetailLoading(true); // Start loading

    try {
      const poDetail = await agent.PODeliveryLogService.getPODetailByID(id);
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

  return (
    <div>
      <PageHeader pageName="Open Sales Order Report" pageHref={ROUTE_PATHS.SALES.OPEN_SO_REPORT} />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <SearchBox
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              getResultSets={getResultSets}
              handleExport={handleExport}
              searchResultLength={searchResult.length}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sx={{ paddingTop: { xs: '15px' } }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                  Loading...
                </Typography>
              </Box>
            ) : searchResult.length > 0 ? (
              <Box
                sx={{
                  height: '80vh', 
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  overflow: 'auto',
                }}
              >
                <SearchResults
                  results={searchResult}
                  groupBySo={searchParams.chkGroupBySo || false}
                  containerHeight="100%"
                  onOpenNoteModal={handleOpenNoteModal}
                  onOpenPoLog={openPoLog}
                />
              </Box>
            ) : (
              <Typography variant="h6" align="center" mt={2}>
                No results found.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
      {searchResult.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: grey[100],
            opacity: '75%',
            padding: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: 5,
            zIndex: 1000,
          }}
        >
          <Typography variant="body1"><strong>Total Amount:</strong> {formatAmount(totalAmount)}</Typography>
          <Typography variant="body1"><strong>Sales Orders:</strong> {uniqueSalesOrders}</Typography>
          <Typography variant="body1"><strong>Total Items:</strong> {totalItems}</Typography>
        </Box>
      )}
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={error}
        />
      )}
      {/* Modals */}
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
    </div>
  );
};

export default OpenSalesOrderReport;
