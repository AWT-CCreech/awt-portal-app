import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authentication';
import { Container, Grid, Button, Box } from '@mui/material';

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
            onClick={() => navigate('/massmailer')}
          >
            Mass Mailer
          </Button>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
            onClick={() => navigate('/timetracker')}
          >
            Time Tracker
          </Button>
        </Grid>
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
            onClick={() => navigate('/dropship')}
          >
            Drop Ship
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
