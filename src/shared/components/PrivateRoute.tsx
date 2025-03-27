import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/authentication';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  return isAuthenticated()
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;