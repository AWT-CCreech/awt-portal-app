import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const BackgroundContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'url("../../../public/logo512.png") no-repeat center center fixed',
  backgroundSize: 'cover',
});

const Title = styled(Typography)({
  fontSize: '4rem',
  fontWeight: 'bold',
  color: '#FF0000', // error color
  marginBottom: '1rem',
});

const Description = styled(Typography)({
  fontSize: '1.5rem',
  color: '#000', // white color
  marginBottom: '2rem',
});

const HomeButton = styled(Button)({
  fontSize: '1rem',
  color: '#FFFFFF',
  backgroundColor: 'black', // primary color
  padding: '0.5rem 2rem',
  '&:hover': {
    backgroundColor: 'grey', // darken primary color
  },
});

const NotFoundPage: React.FC = () => {
  return (
    <BackgroundContainer>
      <Box textAlign="center">
        <Title variant="h2">
          404 PAGE NOT FOUND
        </Title>
        <Description variant="h5">
          Sorry, the page you are looking for does not exist.
        </Description>
        <HomeButton variant="contained" href="/">
          Home
        </HomeButton>
      </Box>
    </BackgroundContainer>
  );
};

export default NotFoundPage;
