import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import PODetail from './PODetail';
import Modules from '../../app/api/agent';
import SearchInput from '../../models/PODeliveryLog/SearchInput';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import ExcelJS from 'exceljs';
import '../../shared/styles/user-list/UserListPage.scss';

interface Statistics {
  uniquePOs: number;
  dropShipments: number;
  expDeliveryAlerts: number;
}

const PODeliveryLog: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchInput>({
    PONum: '',
    Vendor: '',
    PartNum: '',
    IssuedBy: '',
    SONum: '',
    xSalesRep: '',
    HasNotes: 'All',
    POStatus: 'Not Complete',
    EquipType: 'All',
    CompanyID: 'AIR',
    YearRange: new Date().getFullYear(),
  });

  const [poData, setPoData] = useState<PODeliveryLogs[]>([]);
  const [selectedPO, setSelectedPO] = useState<PODetailUpdateDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Compute statistics using useMemo for performance optimization
  const statistics = useMemo<Statistics>(() => {
    const uniquePOs = new Set(poData.map((po) => po.ponum)).size;
    const dropShipments = poData.filter((po) => po.isDropShipment).length;
    const expDeliveryAlerts = poData.filter((po) => {
      let ExpDeliveryAlert = false;
      const isPOComplete = po.qtyOrdered <= po.qtyReceived;

      if (!isPOComplete) {
        const expectedDelivery = po.expectedDelivery ? new Date(po.expectedDelivery) : null;
        const soRequiredDate = po.soRequiredDate ? new Date(po.soRequiredDate) : null;

        if (expectedDelivery && soRequiredDate && expectedDelivery > soRequiredDate) {
          ExpDeliveryAlert = true;
        }
      }

      return ExpDeliveryAlert;
    }).length;

    return {
      uniquePOs,
      dropShipments,
      expDeliveryAlerts,
    };
  }, [poData]);

  const fetchPOData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Modules.PODeliveryLogService.getPODeliveryLogs(searchParams);
      setPoData(data);
    } catch (error) {
      console.error('Error fetching PO data:', error);
      setPoData([]);
      setError('Failed to fetch PO data.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSearch = () => {
    fetchPOData();
  };

  const refreshData = useCallback(async () => {
    await fetchPOData(); // Re-fetch data from the server
  }, [fetchPOData]);

  const handleRowClick = async (event: React.MouseEvent, poLog: PODeliveryLogs) => {
    event.stopPropagation();
    setModalOpen(true);
    setSelectedPO(null);
    setDetailLoading(true);
    setError(null);
    try {
      const poDetail = await Modules.PODeliveryLogService.getPODetailByID(poLog.id);
      setSelectedPO(poDetail);
    } catch (error) {
      console.error('Error fetching PO detail:', error);
      setError('Failed to fetch PO detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPO(null);
  };

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('PODeliveryLogs');

      worksheet.columns = [
        { header: 'PO#', key: 'ponum', width: 15 },
        { header: 'Vendor Name', key: 'vendorName', width: 20 },
        { header: 'Item Number', key: 'itemNum', width: 15 },
        { header: 'Alternate Part Number', key: 'altPartNum', width: 20 },
        { header: 'Issue Date', key: 'issueDate', width: 15 },
        { header: 'Issued By', key: 'issuedBy', width: 15 },
        { header: 'Expected Delivery', key: 'expectedDelivery', width: 20 },
        { header: 'PO Required Date', key: 'poRequiredDate', width: 20 },
        { header: 'Quantity Ordered', key: 'qtyOrdered', width: 15 },
        { header: 'Quantity Received', key: 'qtyReceived', width: 15 },
        { header: 'Receiver Number', key: 'receiverNum', width: 15 },
        { header: 'Date Delivered', key: 'dateDelivered', width: 15 },
        { header: 'SO#', key: 'sonum', width: 15 },
        { header: 'Customer Name', key: 'customerName', width: 20 },
        { header: 'SO Required Date', key: 'soRequiredDate', width: 20 },
        { header: 'Sales Rep', key: 'salesRep', width: 15 },
        { header: 'Notes Exist', key: 'notesExist', width: 15 },
      ];

      poData.forEach((po) => {
        worksheet.addRow({
          ponum: po.ponum,
          vendorName: po.vendorName,
          itemNum: po.itemNum,
          altPartNum: po.altPartNum,
          issueDate: po.issueDate ? new Date(po.issueDate).toLocaleDateString() : '',
          issuedBy: po.issuedBy,
          expectedDelivery: po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : '',
          poRequiredDate: po.poRequiredDate ? new Date(po.poRequiredDate).toLocaleDateString() : '',
          qtyOrdered: po.qtyOrdered,
          qtyReceived: po.qtyReceived,
          receiverNum: po.receiverNum,
          dateDelivered: po.dateDelivered ? new Date(po.dateDelivered).toLocaleDateString() : '',
          sonum: po.sonum,
          customerName: po.customerName,
          soRequiredDate: po.soRequiredDate ? new Date(po.soRequiredDate).toLocaleDateString() : '',
          salesRep: po.salesRep,
          notesExist: po.notesExist ? 'Yes' : 'No',
        });
      });

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFB0C4DE' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `PODeliveryLogs_${new Date().toISOString().split('T')[0]}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);

      setExportSuccess('Excel file exported successfully!');
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      setExportError('Failed to export Excel file.');
    } finally {
      setLoadingExport(false);
    }
  }, [poData]);

  return (
    <div>
      <PageHeader
        pageName="PO Delivery Log"
        pageHref={ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG}
      />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
        <Grid2 container justifyContent="center" spacing={2}>
          <Grid2 size={12}>
            <SearchBox
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              loading={loading}
              handleExport={handleExport}
              loadingExport={loadingExport}
              searchResultLength={poData.length}
              statistics={statistics} // Passing updated statistics
            />
          </Grid2>
          <Grid2 size={12}>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : poData.length > 0 ? (
              <Box
                sx={{
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  overflow: 'auto',
                }}
              >
                <SearchResults results={poData} onRowClick={handleRowClick} />
              </Box>
            ) : (
              <Typography variant="h6" align="center" mt={2}>
                No results found.
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Export Success Snackbar */}
      <Snackbar
        open={Boolean(exportSuccess)}
        autoHideDuration={3000}
        onClose={() => setExportSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setExportSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {exportSuccess}
        </Alert>
      </Snackbar>

      {/* Export Error Snackbar */}
      <Snackbar
        open={Boolean(exportError)}
        autoHideDuration={3000}
        onClose={() => setExportError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setExportError(null)} severity="error" sx={{ width: '100%' }}>
          {exportError}
        </Alert>
      </Snackbar>

      {/* PO Detail Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
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
          {detailLoading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <PODetail
              poDetail={selectedPO}
              onClose={handleCloseModal}
              loading={detailLoading}
              onUpdate={refreshData} // Pass the refreshData function
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default PODeliveryLog;
