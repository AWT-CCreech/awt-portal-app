import React, { useState, useCallback } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import agent from '../../app/api/agent';
import { formatAmount } from '../../utils/dataManipulation';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { Box, Container, Grid, Typography, Snackbar } from '@mui/material';
import SearchResults from './SearchResults';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { grey } from '@mui/material/colors';
import * as XLSX from 'xlsx';
import { TrkSoNote } from '../../models/TrkSoNote';

const OpenSalesOrderReport: React.FC = () => {
  const [searchParams, setSearchParams] = useState<OpenSalesOrderSearchInput>({} as OpenSalesOrderSearchInput);
  const [searchResult, setSearchResult] = useState<(OpenSOReport & { Notes: TrkSoNote[] })[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueSalesOrders, setUniqueSalesOrders] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <PageHeader pageName="Open Sales Order Report" pageHref="/opensalesorderreport" />
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
    </div>
  );
};

export default OpenSalesOrderReport;
