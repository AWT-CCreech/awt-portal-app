import React, { useEffect, useContext, useState, useCallback } from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import { isAuthenticated } from '../../utils/authentication';

const App: React.FC = () => {
  const userInfo = useContext(UserInfoContext);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [inactivityTimeout, setInactivityTimeout] = useState<NodeJS.Timeout | null>(null);

  // Function for logging out
  const handleAutoLogout = useCallback((): void => {
    console.log('Auto logout triggered due to inactivity');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('userid');
    localStorage.removeItem('expiresAt');
    userInfo.setUserName('');
    userInfo.setPassWord('');
    setIsModalOpen(false);
    setCountdown(30);
    window.location.href = '/login';
  }, [userInfo]);

  // Function to refresh the token
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

        console.log('Token refreshed automatically');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      handleAutoLogout();
    }
  }, [handleAutoLogout]);

  // Function to reset inactivity timeout
  const resetInactivityTimeout = useCallback((): void => {
    if (!isAuthenticated()) return; // Skip inactivity timeout if user is not authenticated

    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      const expiryTime = parseInt(expiresAt, 10);
      const currentTime = Date.now();

      const timeLeftUntilExpiration = expiryTime - currentTime;
      const timeToAutoRefresh = 5 * 60 * 1000; // 5 minutes before expiration in milliseconds

      if (timeLeftUntilExpiration > timeToAutoRefresh) {
        // Set timeout to auto-refresh token 5 minutes before expiration
        const timeoutId = setTimeout(() => {
          refreshToken();
        }, timeLeftUntilExpiration - timeToAutoRefresh);

        setInactivityTimeout(timeoutId);
      } else if (timeLeftUntilExpiration > 0) {
        // If token is within 5 minutes of expiration, refresh immediately
        refreshToken();
      } else {
        handleAutoLogout();
      }
    }
  }, [refreshToken, handleAutoLogout]); 

  // Effect to manage inactivity timeout based on user activity
  useEffect(() => {
    if (!isAuthenticated()) return;

    setDocumentTitle(location.pathname);

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    const resetHandler = () => {
      resetInactivityTimeout();
    };

    events.forEach((event) => window.addEventListener(event, resetHandler));

    // Cleanup event listeners on component unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetHandler));
    };
  }, [location.pathname, resetInactivityTimeout]); // Correct dependencies to avoid re-renders

  // Effect to reset inactivity timeout on initial mount and when dependencies change
  useEffect(() => {
    resetInactivityTimeout();
  }, [resetInactivityTimeout]); // Ensure it runs once and when dependencies change

  return (
    <>
      {isAuthenticated() && isModalOpen && (
        <InactivityModal
          open={isModalOpen}
          countdown={countdown}
          onStayLoggedIn={refreshToken}
          onLogout={handleAutoLogout}
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
          <Route path="/userlist" element={<UserListPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
