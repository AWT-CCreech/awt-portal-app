import React, { useContext } from 'react';
import { Container, Grid, Breadcrumbs, Button, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UserInfo from '../stores/userInfo';
import { handleLogOut } from '../utils/authentication';
import { useNavigate } from 'react-router-dom';

interface IProps {
  pageName: string;
  pageHref: string;
}

const PageHeader: React.FC<IProps> = ({ pageName, pageHref }) => {
  const { setUserName, setPassWord } = useContext(UserInfo);
  const navigate = useNavigate();

  return (
    <Container maxWidth={false} style={{ padding: '15px 100px 15px 100px', backgroundColor: 'whiteSmoke' }}>
      <Grid container alignItems="center">
        <Grid item xs={8}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <HomeIcon fontSize="small"/>
              Home
            </a>
            <a href={pageHref} style={{ textDecoration: 'none', color: 'inherit' }}>
              {pageName}
            </a>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div" style={{ display: 'inline-flex', alignItems: 'center', color: 'darkBlue' }}>
              <AccountCircleIcon fontSize="small" style={{ marginRight: '3px' }} />
              {localStorage.getItem('username')}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleLogOut(navigate, setUserName, setPassWord)}
              style={{ marginLeft: '15px' }}
            >
              Log Out
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PageHeader;
