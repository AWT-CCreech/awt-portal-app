import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from '../../pages/login/LoginPage';
import Home from '../../pages/home/Home';
import NotFound from '../../pages/exception-pages/NotFound';
import UserInfoContext from '../../stores/userInfo';
import PrivateRoute from '../../components/PrivateRoute';
import MassMailer from '../../pages/mass-mailer/MassMailer';
import MasterSearch from '../../pages/master-search/MasterSearch';
import OpenSalesOrderReport from '../../pages/open-so-report/OpenSalesOrderReport';
import DropShip from '../../pages/dropship/DropShip';
import UserListPage from '../../pages/user-list/UserListPage';
import setDocumentTitle from '../../utils/setDocumentTitle';
import InactivityModal from '../../components/InactivityModal';
import agent from '../../app/api/agent';
import { isAuthenticated, handleAutoLogout } from '../../utils/authentication';
import PODeliveryLog from '../../pages/po-delivery-log/PODeliveryLog';

const App: React.FC = () => {
  const userInfo = useContext(UserInfoContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback((): void => {
    handleAutoLogout(navigate, userInfo.setUserName, userInfo.setPassWord);
  }, [navigate, userInfo.setUserName, userInfo.setPassWord]);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        const refreshResponse = await agent.UserLogins.refreshToken({ token: currentToken });
        const newToken = refreshResponse.token;
        localStorage.setItem('token', newToken);

        const tokenPayload = JSON.parse(atob(newToken.split('.')[1]));
        const expiresAt = tokenPayload.exp * 1000;
        localStorage.setItem('expiresAt', expiresAt.toString());

        const lastRefresh = Date.now();
        localStorage.setItem('lastRefresh', lastRefresh.toString());

        console.log('Token refreshed automatically');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      handleLogout();
    }
  }, [handleLogout]);

  const resetInactivityTimeout = useCallback((): void => {
    if (!isAuthenticated()) return;

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      const expiryTime = parseInt(expiresAt, 10);
      const currentTime = Date.now();

      const timeLeftUntilExpiration = expiryTime - currentTime;
      const timeToShowModal = 1 * 60 * 1000; // Show modal with 1 minute left

      if (timeLeftUntilExpiration > timeToShowModal) {
        // Automatically refresh the token without showing the modal
        inactivityTimeoutRef.current = setTimeout(() => {
          resetInactivityTimeout(); // Recheck after this interval
        }, timeLeftUntilExpiration - timeToShowModal);
        setIsModalOpen(false); // Ensure modal is closed
      } else if (timeLeftUntilExpiration > 0) {
        // Less than 1 minute left, show the modal
        setIsModalOpen(true);
        setCountdown(Math.floor(timeLeftUntilExpiration / 1000));
      } else {
        // Token has expired, log out the user
        handleLogout();
      }
    }
  }, [handleLogout]);


  // Effect to manage inactivity timeout
  useEffect(() => {
    if (!isAuthenticated()) return;

    setDocumentTitle(location.pathname);

    const resetHandler = () => {
      if (!isModalOpen) {
        resetInactivityTimeout();
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((event) => window.addEventListener(event, resetHandler));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetHandler));
    };
  }, [location.pathname, resetInactivityTimeout, isModalOpen]);

  // Effect to reset inactivity timeout on mount
  useEffect(() => {
    resetInactivityTimeout();

    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [resetInactivityTimeout]);

  return (
    <>
      {isAuthenticated() && isModalOpen && (
        <InactivityModal
          open={isModalOpen}
          countdown={countdown}
          onStayLoggedIn={async () => {
            setIsModalOpen(false);
            await refreshToken();  // Refresh the token when the user stays logged in
            resetInactivityTimeout();
          }}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dropship" element={<DropShip />} />
          <Route path="/massmailer" element={<MassMailer />} />
          <Route path="/mastersearch" element={<MasterSearch />} />
          <Route path="/opensalesorderreport" element={<OpenSalesOrderReport />} />
          <Route path="/podeliverylog" element={<PODeliveryLog />} />
          <Route path="/userlist" element={<UserListPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
