import React, { useState, useCallback } from 'react';
import Modules from '../../app/api/agent';
import { PODeliveryLogs } from '../../models/PODeliveryLog/PODeliveryLogs'; 
import SearchInput from '../../models/PODeliveryLog/SearchInput';
import { Box, Container, Grid, Typography, Modal } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import PODetail from './PODetail';
import * as XLSX from 'xlsx';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';

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
  const [loading, setLoading] = useState(false); // Loading state for fetching PO data
  const [detailLoading, setDetailLoading] = useState(false); // Loading state for fetching PO detail

  const fetchPOData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Modules.PODeliveryLogService.getPODeliveryLogs(searchParams);
      setPoData(data);
    } catch (error) {
      console.error('Error fetching PO data:', error);
      setPoData([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSearch = () => {
    fetchPOData();
  };

  const handleRowClick = async (event: React.MouseEvent, poLog: PODeliveryLogs) => {
    event.stopPropagation();
    setModalOpen(true);
    setSelectedPO(null); // Reset selected PO

    setDetailLoading(true); // Set loading to true for fetching PO detail
    try {
      const poDetail = await Modules.PODeliveryLogService.getPODetailByID(poLog.id);
      setSelectedPO(poDetail);
    } catch (error) {
      console.error('Error fetching PO detail:', error);
    } finally {
      setDetailLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPO(null);
  };

  const handleExport = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(poData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PODeliveryLogs');
    XLSX.writeFile(wb, 'PODeliveryLogs.xlsx');
  }, [poData]);

  return (
    <div>
      <PageHeader pageName="PO Delivery Log" pageHref="/podeliverylog" />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <SearchBox
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              loading={loading} // Only for search loading
              handleExport={handleExport}
              searchResultLength={poData.length}
            />
          </Grid>
          <Grid item xs={12}>
            {poData.length > 0 ? (
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
          </Grid>
        </Grid>
      </Container>

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
          <PODetail poDetail={selectedPO} onClose={handleCloseModal} loading={detailLoading} />
        </Box>
      </Modal>
    </div>
  );
};

export default PODeliveryLog;
