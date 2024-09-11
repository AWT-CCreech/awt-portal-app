import React, { useState, useEffect, useCallback } from 'react';
import Modules from '../../app/api/agent'; // Import the updated API agent
import { SearchInput } from '../../models/PODeliveryLog/SearchInput'; // Import the SearchInput model
import { Box, Container, CircularProgress, Grid, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox'; // Import the SearchBox component
import SearchResults from './SearchResults'; // Import the SearchResults component

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
    lstYear: new Date().getFullYear(),
  });

  const [poData, setPoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPOData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Modules.PODeliveryLog.getPODeliveryLogs(searchParams);
      console.log(data); // Debugging: Log the full data array
      setPoData(data);
    } catch (error) {
      console.error('Error fetching PO data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPOData();
  }, [fetchPOData]);

  return (
    <div>
      <PageHeader pageName="PO Delivery Log" pageHref="/podeliverylog" />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' }}}>
        <SearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={fetchPOData} />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <SearchResults results={poData} />
        )}
      </Container>
    </div>
  );
};

export default PODeliveryLog;
