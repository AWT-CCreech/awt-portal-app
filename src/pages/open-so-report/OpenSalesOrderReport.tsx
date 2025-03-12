import React, { useState, useCallback } from 'react';

// Components
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import NoteModal from './NoteModal';
import PODetail from '../po-delivery-log/PODetail';

// API and Data Manipulation
import agent from '../../app/api/agent';
import ExcelJS from 'exceljs';

// MUI Components and Styling
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Modal from '@mui/material/Modal';
import { Alert, useTheme, useMediaQuery } from '@mui/material';

// Models
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';

const OpenSalesOrderReport: React.FC = () => {
  const [searchParams, setSearchParams] = useState<OpenSalesOrderSearchInput>({
    soNum: '',
    poNum: '',
    custPO: '',
    partNum: '',
    reqDateStatus: 'All',
    salesTeam: 'All',
    category: 'All',
    salesRep: 'All',
    accountNo: 'All',
    customer: '',
    chkExcludeCo: false,
    chkGroupBySo: false,
    chkAllHere: false,
    dateFilterType: 'OrderDate',
    date1: null,
    date2: null,
  });

  const [searchResult, setSearchResult] = useState<
    (OpenSOReport & { notes: TrkSoNote[]; poLog?: TrkPoLog })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueSalesOrders, setUniqueSalesOrders] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Export states
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Modal state variables for Notes
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [selectedSONum, setSelectedSONum] = useState<string>('');
  const [selectedPartNum, setSelectedPartNum] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<TrkSoNote[]>([]);

  // Modal state variables for PO Detail
  const [selectedPO, setSelectedPO] = useState<PODetailUpdateDto | null>(null);
  const [poDetailModalOpen, setPoDetailModalOpen] = useState(false);
  const [poDetailLoading, setPoDetailLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchOpenSalesOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agent.OpenSalesOrderReport.fetchOpenSalesOrders(searchParams);
      setSearchResult(response);
      setUniqueSalesOrders(new Set(response.map((order) => order.sonum)).size);
      setTotalItems(response.length);
      setTotalAmount(response.reduce((acc, order) => acc + (order.amountLeft || 0), 0));
    } catch (error: any) {
      console.error('Error fetching sales orders:', error);
      setError('Failed to fetch sales orders. Please try again.');
      setSearchResult([]);
      setUniqueSalesOrders(0);
      setTotalItems(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('OpenSOReport');

      // Define columns with headers and keys matching the data structure
      worksheet.columns = [
        { header: 'EID', key: 'eventId', width: 15 },
        { header: 'SO #', key: 'sonum', width: 15 },
        { header: 'Team', key: 'accountTeam', width: 15 },
        { header: 'Customer', key: 'customerName', width: 20 },
        { header: 'Cust PO', key: 'custPo', width: 15 },
        { header: 'Order Date', key: 'orderDate', width: 15 },
        { header: 'Req. Date', key: 'requiredDate', width: 15 },
        { header: 'Missing P/N', key: 'itemNum', width: 20 },
        { header: 'Vendor P/N', key: 'mfgNum', width: 20 },
        { header: 'Amount', key: 'amountLeft', width: 15 },
        { header: 'PO #', key: 'ponum', width: 15 },
        { header: 'PO Issue Date', key: 'poissueDate', width: 15 },
        { header: 'Exp. Delivery', key: 'expectedDelivery', width: 15 },
        { header: 'Qty Ordered', key: 'qtyOrdered', width: 15 },
        { header: 'Qty Received', key: 'qtyReceived', width: 15 },
        { header: 'PO Log', key: 'poLog', width: 25 },
        { header: 'Notes', key: 'notesExist', width: 10 },
      ];

      // Add rows to the worksheet
      searchResult.forEach((order) => {
        worksheet.addRow({
          eventId: order.eventId,
          sonum: order.sonum,
          accountTeam: order.accountTeam || order.salesRep,
          customerName: order.customerName,
          custPo: order.custPo,
          orderDate: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
          requiredDate: order.requiredDate ? new Date(order.requiredDate).toLocaleDateString() : '',
          itemNum: order.itemNum ? `${order.itemNum} (${order.leftToShip ?? 0})` : '',
          mfgNum: order.mfgNum,
          amountLeft: order.amountLeft ?? 0,
          ponum: order.ponum,
          poissueDate:
            order.poissueDate && order.poissueDate instanceof Date && !isNaN(order.poissueDate.getTime())
              ? order.poissueDate.toLocaleDateString()
              : '',
          expectedDelivery:
            order.expectedDelivery && order.expectedDelivery instanceof Date && !isNaN(order.expectedDelivery.getTime())
              ? order.expectedDelivery.toLocaleDateString()
              : '',
          qtyOrdered: order.qtyOrdered,
          qtyReceived: order.qtyReceived,
          poLog: order.poLog ? `${new Date(order.poLog.entryDate).toLocaleDateString()} (${order.poLog.enteredBy})` : '',
          notesExist: order.notes.length > 0 ? 'Yes' : 'No',
        });
      });

      // Style the header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFB0C4DE' }, // LightSteelBlue background
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Format the 'Amount' column as currency
      worksheet.getColumn('amountLeft').numFmt = '$#,##0.00';

      // Write the workbook to a buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create a temporary anchor element and trigger the download
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `OpenSOReport_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(anchor); // Append to body to ensure it works in Firefox
      anchor.click();
      document.body.removeChild(anchor); // Remove from body after clicking
      window.URL.revokeObjectURL(url);

      setExportSuccess('Excel file exported successfully!');
      console.log('Excel export successful');
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      setExportError('Failed to export Excel file.');
    } finally {
      setLoadingExport(false);
    }
  }, [searchResult]);

  const handleCloseSnackbar = useCallback(() => {
    setError(null);
    setExportError(null);
    setExportSuccess(null);
  }, []);

  // Function to fetch notes for a line item
  const fetchNotesForLineItem = useCallback(async (soNum: string, partNum: string) => {
    try {
      const response = await agent.OpenSalesOrderNotes.getNotes(soNum, partNum);
      console.log(`Fetched notes for SO: ${soNum}, Part: ${partNum}`, response);
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
  const handleOpenNoteModal = useCallback(
    (soNum: string, partNum: string, notes: TrkSoNote[]) => {
      console.log(`Opening Note Modal for SO: ${soNum}, Part: ${partNum}`);
      setSelectedSONum(soNum);
      setSelectedPartNum(partNum);
      setSelectedNotes(notes);
      setShowNoteModal(true);
    },
    []
  );

  // Function to handle closing the note modal
  const handleCloseNoteModal = useCallback(() => {
    console.log('Closing Note Modal');
    setShowNoteModal(false);
    fetchNotesForLineItem(selectedSONum, selectedPartNum); // Refetch notes when closing the modal
  }, [selectedSONum, selectedPartNum, fetchNotesForLineItem]);

  // Function to open the PO Log modal
  const openPoLog = useCallback(async (id: number) => {
    console.log(`Opening PO Detail Modal for ID: ${id}`);
    setPoDetailModalOpen(true);
    setSelectedPO(null); // Reset selected PO
    setPoDetailLoading(true); // Start loading

    try {
      const poDetail = await agent.PODeliveryLogService.getPODetailByID(id);
      console.log('Fetched PO Detail:', poDetail);
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

  // Centralized onUpdate method for the PODetail modal
  const handlePODetailUpdate = useCallback(() => {
    fetchNotesForLineItem(selectedSONum, selectedPartNum);
    setPoDetailModalOpen(false);
  }, [selectedSONum, selectedPartNum, fetchNotesForLineItem]);

  return (
    <div>
      <PageHeader
        pageName="Open Sales Order Report"
        pageHref={ROUTE_PATHS.SALES.OPEN_SO_REPORT}
      />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <SearchBox
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              getResultSets={fetchOpenSalesOrders}
              handleExport={handleExport}
              searchResultLength={searchResult.length}
              loading={loading}
              loadingExport={loadingExport}
              summary={{
                totalAmount,
                uniqueSalesOrders,
                totalItems,
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            {searchResult.length > 0 ? (
              <Box
                sx={{
                  height: isSmallScreen ? 'auto' : '80vh',
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
                {loading ? '' : 'No results found.'}
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Container>

      <Snackbar
        open={Boolean(exportSuccess)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {exportSuccess}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(exportError)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {exportError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Note Modal */}
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
            },
          },
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
            maxHeight: '90vh',
          }}
        >
          <NoteModal
            soNum={selectedSONum}
            partNum={selectedPartNum}
            notes={selectedNotes}
            onClose={handleCloseNoteModal}
            onNoteAdded={() => fetchNotesForLineItem(selectedSONum, selectedPartNum)}
          />
        </Box>
      </Modal>

      {/* PO Detail Modal */}
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
            },
          },
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
            maxHeight: '90vh',
          }}
        >
          <PODetail
            poDetail={selectedPO}
            onClose={() => setPoDetailModalOpen(false)}
            onUpdate={handlePODetailUpdate}
            loading={poDetailLoading}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default OpenSalesOrderReport;