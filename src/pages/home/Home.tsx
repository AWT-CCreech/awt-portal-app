import React from 'react';
import { Navigate, useNavigate } from 'react-router';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import { isAuthenticated } from '../../shared/utils/authentication';
import { ROUTE_PATHS } from '../../routes';

const Home: React.FC = () => {
  const navigate = useNavigate();
  if (!isAuthenticated()) return <Navigate to={ROUTE_PATHS.LOGIN} replace />;

  const btn = (path: string, label: string) => (
    <Grid2 size={{ xs: 3 }} textAlign="center">
      <Button variant="contained" onClick={() => navigate(path)}>
        {label}
      </Button>
    </Grid2>
  );

  return (
    <Container sx={{ pt: 20 }}>
      <Grid2 container spacing={4} justifyContent="center" alignContent={'center'}>
        {btn(ROUTE_PATHS.SALES.CUSTOMER_PO_SEARCH, 'Customer PO Search')}
        {btn(ROUTE_PATHS.ACCOUNTING.DAILY_GOALS, 'Daily Goals')}
        {btn(ROUTE_PATHS.PURCHASING.DROPSHIP, 'Drop Ship')}
        {btn(ROUTE_PATHS.SALES.EVENT_SEARCH, 'Event Search')}
        {btn(ROUTE_PATHS.PURCHASING.MASS_MAILER, 'Mass Mailer')}
        {btn(ROUTE_PATHS.MASTER_SEARCH, 'Master Search')}
        {btn(ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG, 'PO Delivery Log')}
        {btn(ROUTE_PATHS.SALES.OPEN_SO_REPORT, 'Open SO Report')}
        {btn(ROUTE_PATHS.SALES.SALES_ORDER_WB, 'SO Workbench')}
        {btn(ROUTE_PATHS.USER_LIST, 'User List')}
      </Grid2>
    </Container>
  );
};

export default Home;
