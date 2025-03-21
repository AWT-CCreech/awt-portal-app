import React, { useEffect, useCallback, useRef, useContext } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../../shared/themes/theme';
import UserInfoContext from '../../shared/stores/userInfo';
import InactivityModal from '../../shared/components/InactivityModal';
import agent from '../../app/api/agent';
import { isAuthenticated, handleAutoLogout } from '../../shared/utils/authentication';
import { routes } from '../../routes';
import setDocumentTitle from '../../shared/utils/setDocumentTitle';
import { usePopover } from '../../shared/hooks/use-popover';

const MODAL_INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
const MODAL_COUNTDOWN_S = 60;               // 60‑second warning

const App: React.FC = () => {
  const { open: isModalOpen, handleOpen, handleClose } = usePopover<HTMLElement>();
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserName, setPassWord } = useContext(UserInfoContext);

  const handleLogout = useCallback(() => {
    handleAutoLogout(navigate, setUserName, setPassWord);
  }, [navigate, setUserName, setPassWord]);

  const refreshToken = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        const { token: newToken } = await agent.UserLogins.refreshToken({ token: currentToken });
        localStorage.setItem('token', newToken);
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        localStorage.setItem('expiresAt', (payload.exp * 1000).toString());
        localStorage.setItem('lastRefresh', Date.now().toString());
      }
    } catch {
      handleLogout();
    }
  }, [handleLogout]);

  const resetInactivityTimeout = useCallback(() => {
    if (!isAuthenticated()) return;
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

    inactivityTimeoutRef.current = setTimeout(() => {
      handleOpen();
    }, MODAL_INACTIVITY_MS);
  }, [handleOpen]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    setDocumentTitle(location.pathname);
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(evt => window.addEventListener(evt, resetInactivityTimeout));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetInactivityTimeout));
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [location.pathname, resetInactivityTimeout]);

  useEffect(() => {
    resetInactivityTimeout();
  }, [resetInactivityTimeout]);

  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated() && (
        <InactivityModal
          open={isModalOpen}
          countdown={MODAL_COUNTDOWN_S}
          onStayLoggedIn={async () => {
            handleClose();
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
