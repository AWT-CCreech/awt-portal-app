import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../styles/themes/theme';

import UserInfoContext from '../../stores/userInfo';
import InactivityModal from '../../components/InactivityModal';
import agent from '../../app/api/agent';
import { isAuthenticated, handleAutoLogout } from '../../utils/authentication';
import { routes } from '../../routes'; // Import the centralized routes
import setDocumentTitle from '../../utils/setDocumentTitle';

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
      const timeToShowModal = 1 * 60 * 1000;

      if (timeLeftUntilExpiration <= 0) {
        handleLogout();
      } else if (timeLeftUntilExpiration > timeToShowModal) {
        inactivityTimeoutRef.current = setTimeout(() => {
          resetInactivityTimeout();
        }, timeLeftUntilExpiration - timeToShowModal);
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
        setCountdown(Math.floor(timeLeftUntilExpiration / 1000));
      }
    } else {
      handleLogout();
    }
  }, [handleLogout]);

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

  useEffect(() => {
    resetInactivityTimeout();

    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [resetInactivityTimeout]);

  // Use the centralized routes with useRoutes
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated() && isModalOpen && (
        <InactivityModal
          open={isModalOpen}
          countdown={countdown}
          onStayLoggedIn={async () => {
            setIsModalOpen(false);
            await refreshToken();
            resetInactivityTimeout();
          }}
          onLogout={handleLogout}
        />
      )}
      {routing}
    </ThemeProvider>
  );
};

export default App;
