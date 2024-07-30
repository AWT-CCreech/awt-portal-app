import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PortalMenu from './PortalMenu';

interface IProps {
  pageName: string;
  pageHref: string;
}

const PageHeader: React.FC<IProps> = ({ pageName, pageHref }) => {
  const username = localStorage.getItem('username');

  return (
    <Container
      maxWidth={false}
      sx={{
        padding: '15px 50px',
        backgroundColor: 'whiteSmoke',
        position: 'sticky',
        top: 0,
        zIndex: 1100, // Ensure it's above other elements
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
          <PortalMenu />
          <Typography variant="h6" component="div" style={{ marginLeft: '15px', color: '#384959' }}>
            {pageName}
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" style={{ display: 'inline-flex', alignItems: 'center', color: '#384959' }}>
              <AccountCircleIcon fontSize="small" style={{ marginRight: '3px' }} />
              {username}
            </Typography>
          </Box>
        </Grid>
        {/* Uncomment this section if you need to reimplement the breadcrumbs */}
        {/* <Grid item xs={12} style={{ marginTop: '15px' }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <HomeIcon fontSize="small"/>
              Home
            </a>
            <a href={pageHref} style={{ textDecoration: 'none', color: 'inherit' }}>
              {pageName}
            </a>
          </Breadcrumbs>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default PageHeader;
