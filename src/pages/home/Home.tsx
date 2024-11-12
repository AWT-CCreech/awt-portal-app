import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Grid, Button } from '@mui/material';
import { isAuthenticated } from '../../utils/authentication';
import { ROUTE_PATHS } from '../../routes'; // Import the path constants

const Home: React.FC = () => {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTE_PATHS.LOGIN} />;
  }

  return (
    <Container sx={{ padding: '300px 100px 0px 100px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.PURCHASING.DROPSHIP)}
          >
            Drop Ship
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.SALES.EVENT_SEARCH)}
          >
            Event Search
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.PURCHASING.MASS_MAILER)}
          >
            Mass Mailer
          </Button>
        </Grid>
        {/* <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate(ROUTE_PATHS.TIME_TRACKER)}
          >
            Time Tracker
          </Button>
        </Grid> */}
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.MASTER_SEARCH)}
          >
            Master Search
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG)}
          >
            PO Delivery Log
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.SALES.OPEN_SO_REPORT)}
          >
            Open SO Report
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.SALES.SALES_ORDER_WB)}
          >
            SO Workbench
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: 'grey' },
            }}
            onClick={() => navigate(ROUTE_PATHS.USER_LIST)}
          >
            User List
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
