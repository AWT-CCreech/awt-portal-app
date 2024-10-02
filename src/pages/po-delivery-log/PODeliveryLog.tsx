import React, { useState, useCallback } from 'react';
import Modules from '../../app/api/agent';
import { SearchInput } from '../../models/PODeliveryLog/SearchInput';
import { Box, Container, Grid, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

const PODeliveryLog: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchInput>({
    PONum: '',
    Vendor: '',
    PartNum: '',
    IssuedBy: '',
    SONum: '',
    xSalesRep: '',
    HasNotes: '',
    POStatus: 'Not Complete',
    EquipType: 'All',
    CompanyID: 'AIR',
    YearRange: new Date().getFullYear(),
  });

  const [poData, setPoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPOData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Modules.PODeliveryLog.getPODeliveryLogs(searchParams);
      setPoData(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching PO data:', error);
      setPoData([]); // Reset the data on error
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSearch = () => {
    fetchPOData(); // Explicitly trigger the fetch
  };

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
              loading={loading} // Pass loading state to SearchBox
            />
          </Grid>
          <Grid item xs={12}>
            {loading ? null : poData.length > 0 ? (
              <Box
                sx={{
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  overflow: 'auto',
                }}
              >
                <SearchResults results={poData} />
              </Box>
            ) : (
              <Typography variant="h6" align="center" mt={2}>
                No results found.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default PODeliveryLog;
