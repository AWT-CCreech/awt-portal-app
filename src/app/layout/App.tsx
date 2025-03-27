import React, { useEffect, useCallback, useRef, useContext } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../../shared/themes/theme';
import UserInfoContext from '../../shared/stores/userInfo';
import InactivityModal from '../../shared/components/InactivityModal';
import agent from '../../app/api/agent';
import { isAuthenticated, handleLogOut } from '../../shared/utils/authentication';
import { routes } from '../../routes';
import setDocumentTitle from '../../shared/utils/setDocumentTitle';
import { usePopover } from '../../shared/hooks/use-popover';

const MODAL_INACTIVITY_MS = 30 * 60 * 1000;
const MODAL_COUNTDOWN_S = 60;

const App: React.FC = () => {
  const { open: isModalOpen, handleOpen, handleClose } = usePopover<HTMLElement>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserName, setPassWord } = useContext(UserInfoContext);

  const handleLogout = useCallback(async () => {
    handleClose();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) await agent.UserLogins.logout(refreshToken);
    handleLogOut(navigate, setUserName, setPassWord);
  }, [navigate, setUserName, setPassWord, handleClose]);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated()) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleOpen, MODAL_INACTIVITY_MS);
  }, [handleOpen]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    setDocumentTitle(location.pathname);
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));
    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname, resetTimer]);

  useEffect(resetTimer, [resetTimer]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated() && (
        <InactivityModal
          open={isModalOpen}
          countdown={MODAL_COUNTDOWN_S}
          onStayLoggedIn={async () => {
            handleClose();
            const token = localStorage.getItem('token')!;
            const refreshToken = localStorage.getItem('refreshToken')!;
            const response = await agent.UserLogins.refreshToken({ token, refreshToken });
            localStorage.setItem('token', response.Token);
            localStorage.setItem('refreshToken', response.RefreshToken);
            resetTimer();
          }}
          onLogout={handleLogout}
        />
      )}
      {useRoutes(routes)}
    </ThemeProvider>
  );
};

export default App;