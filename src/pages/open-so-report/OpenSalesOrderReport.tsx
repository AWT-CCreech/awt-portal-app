import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import agent from '../../app/api/agent';
import { formatAmount } from '../../utils/dataManipulation';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import {
  Box,
  Container,
  Divider,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import SearchResults from './SearchResults';
import OpenSalesOrder from '../../models/OpenSalesOrder';
import { grey } from '@mui/material/colors';

const OpenSalesOrderReport: React.FC = () => {
  const [searchParams, setSearchParams] = useState<OpenSalesOrderSearchInput>({});
  const [searchResult, setSearchResult] = useState<OpenSalesOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueSalesOrders, setUniqueSalesOrders] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const getResultSets = async () => {
    setLoading(true);
    try {
      const response = await agent.OpenSalesOrders.fetchOpenSalesOrders(searchParams);
      setSearchResult(response);
      setUniqueSalesOrders(new Set(response.map(order => order.sonum)).size);
      setTotalItems(response.length);
      setTotalAmount(response.reduce((acc, order) => acc + (order.amountLeft || 0), 0));
    } catch (error) {
      console.error('Error fetching open sales orders', error);
      setSearchResult([]);
      setUniqueSalesOrders(0);
      setTotalItems(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader pageName="Open Sales Order Report" pageHref="/opensalesorderreport" />
      <Divider />
      <Container sx={{ padding: { xs: '20px', md: '40px 20px 40px 20px' }, maxWidth: '100%' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <SearchBox
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              getResultSets={getResultSets}
            />
          </Grid>
          <Grid item xs={12} sx={{ paddingTop: { xs: '15px' } }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
                <CircularProgress size={80} />
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                  Loading
                </Typography>
              </Box>
            ) : searchResult.length > 0 ? (
              <Box sx={{ maxHeight: '36vh', overflowY: 'auto', width: '100%', p: { xs: 1, md: 2 }, boxShadow: 3, bgcolor: 'background.paper', boxSizing: 'border-box' }}>
                <SearchResults results={searchResult} />
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
            padding: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <Typography variant="body1"><strong>Total Amount:</strong> {formatAmount(totalAmount)}</Typography>
          <Typography variant="body1"><strong>Sales Orders:</strong> {uniqueSalesOrders}</Typography>
          <Typography variant="body1"><strong>Total Items:</strong> {totalItems}</Typography>
        </Box>
      )}
    </div>
  );
};

export default OpenSalesOrderReport;
