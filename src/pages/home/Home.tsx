// React
import React from 'react';

// Routing
import { Navigate, useNavigate } from 'react-router-dom';

// Utilities
import { isAuthenticated } from '../../utils/authentication';

// MUI Components
import { Container, Grid, Button } from '@mui/material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <Container sx={{ padding: '300px 100px 0px 100px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/dropship')}
          >
            Drop Ship
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/massmailer')}
          >
            Mass Mailer
          </Button>
        </Grid>
        {/* <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/timetracker')}
          >
            Time Tracker
          </Button>
        </Grid> */}
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/mastersearch')}
          >
            Master Search
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/podeliverylog')}
          >
            PO Delivery Log
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/opensalesorderreport')}
          >
            Open SO Report
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/userlist')}
          >
            User List
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
