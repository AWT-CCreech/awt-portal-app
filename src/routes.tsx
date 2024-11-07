import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import your page components
import Home from './pages/home/Home';
import LoginPage from './pages/login/LoginPage';
import DropShip from './pages/dropship/DropShip';
import MassMailer from './pages/mass-mailer/MassMailer';
import PODeliveryLog from './pages/po-delivery-log/PODeliveryLog';
import OpenSalesOrderReport from './pages/open-so-report/OpenSalesOrderReport';
import MasterSearch from './pages/master-search/MasterSearch';
import UserListPage from './pages/user-list/UserListPage';
import NotFound from './pages/exception-pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import TimeTrackerPage from './pages/time-tracker/TimeTrackerPage';
//import SalesOrderWB from './pages/sales-order-workbench/SalesOrderWB';

// Define constants for paths
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  PURCHASING: {
    DROPSHIP: '/purchasing/dropship',
    MASS_MAILER: '/purchasing/massmailer',
    PO_DELIVERY_LOG: '/purchasing/podeliverylog',
  },
  SALES: {
    OPEN_SO_REPORT: '/sales/opensalesorderreport',
    SO_WORKBENCH: '/sales/salesorderworkbench',
  },
  MASTER_SEARCH: '/mastersearch',
  TIME_TRACKER: '/timetracker',
  USER_LIST: '/userlist',
  // Add other paths as needed
};

// Define route configurations
export const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTE_PATHS.HOME,
        element: <Home />,
      },
      {
        path: ROUTE_PATHS.PURCHASING.DROPSHIP,
        element: <DropShip />,
      },
      {
        path: ROUTE_PATHS.PURCHASING.MASS_MAILER,
        element: <MassMailer />,
      },
      {
        path: ROUTE_PATHS.PURCHASING.PO_DELIVERY_LOG,
        element: <PODeliveryLog />,
      },
      {
        path: ROUTE_PATHS.SALES.OPEN_SO_REPORT,
        element: <OpenSalesOrderReport />,
      },
      // {
      //   path: ROUTE_PATHS.SALES.SO_WORKBENCH,
      //   element: <SalesOrderWB />,
      // },
      {
        path: ROUTE_PATHS.MASTER_SEARCH,
        element: <MasterSearch />,
      },
      {
        path: ROUTE_PATHS.TIME_TRACKER,
        element: <TimeTrackerPage />,
      },
      {
        path: ROUTE_PATHS.USER_LIST,
        element: <UserListPage />,
      },
      // Add other routes as needed
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
