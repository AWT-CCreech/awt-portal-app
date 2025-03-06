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
import PrivateRoute from './shared/components/PrivateRoute';
import TimeTrackerPage from './pages/time-tracker/TimeTrackerPage';
import EventSearch from './pages/event-search/EventSearch';
import SalesOrderWB from './pages/sales-order-workbench/SalesOrderWB';
import DailyGoalsReportPage from './pages/daily-goals/DailyGoalsReport';
import DailyGoalsDetail from './pages/daily-goals/DailyGoalsDetail';

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
    EVENT_SEARCH: '/sales/eventsearch',
    OPEN_SO_REPORT: '/sales/opensalesorderreport',
    SALES_ORDER_WB: '/sales/salesorderworkbench',
  },
  MASTER_SEARCH: '/mastersearch',
  TIME_TRACKER: '/timetracker',
  USER_LIST: '/userlist',
  ACCOUNTING: {
    DAILY_GOALS: '/accounting/dailygoals',
  },
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
        path: ROUTE_PATHS.SALES.EVENT_SEARCH,
        element: <EventSearch />,
      },
      {
        path: ROUTE_PATHS.SALES.OPEN_SO_REPORT,
        element: <OpenSalesOrderReport />,
      },
      {
        path: ROUTE_PATHS.SALES.SALES_ORDER_WB,
        element: <SalesOrderWB />,
      },
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
      {
        path: ROUTE_PATHS.ACCOUNTING.DAILY_GOALS,
        element: <DailyGoalsReportPage />,
      },
      {
        path: `${ROUTE_PATHS.ACCOUNTING.DAILY_GOALS}/detail`,
        element: <DailyGoalsDetail />,
      },
      // Add other routes as needed
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
