import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { useNavigate, useLocation, useRoutes } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../../shared/themes/theme';
import UserInfoContext from '../../shared/stores/userInfo';
import InactivityModal from '../../shared/components/InactivityModal';
import agent from '../../app/api/agent';
import { isAuthenticated, handleLogOut } from '../../shared/utils/authentication';
import { routes } from '../../routes';
import setDocumentTitle from '../../shared/utils/setDocumentTitle';

const MODAL_COUNTDOWN_S = 60;  // seconds

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserName, setPassWord } = useContext(UserInfoContext);

  // central logout logic
  const handleLogout = useCallback(async () => {
    setModalOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const rt = localStorage.getItem('refreshToken');
    if (rt) {
      try { await agent.UserLogins.logout(rt); } catch { }
    }
    handleLogOut(navigate, setUserName, setPassWord);
  }, [navigate, setUserName, setPassWord]);

  // schedule the inactivity warning at (tokenExp - countdown)
  const scheduleWarning = useCallback(() => {
    if (!isAuthenticated()) {
      return handleLogout();
    }

    const raw = localStorage.getItem('token');
    if (!raw) {
      return handleLogout();
    }

    let expMs: number;
    try {
      expMs = JSON.parse(atob(raw.split('.')[1])).exp * 1000;
    } catch {
      return handleLogout();
    }

    const now = Date.now();
    const msUntilWarning = expMs - now - MODAL_COUNTDOWN_S * 1000;

    if (msUntilWarning <= 0) {
      setModalOpen(true);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setModalOpen(true);
    }, msUntilWarning);
  }, [handleLogout]);

  // reset on user activity
  useEffect(() => {
    if (!isAuthenticated()) return;

    setDocumentTitle(location.pathname);
    const events: Array<keyof WindowEventMap> = [
      'mousemove', 'keydown', 'scroll', 'click',
    ];
    events.forEach(e => window.addEventListener(e, scheduleWarning));
    return () => {
      events.forEach(e => window.removeEventListener(e, scheduleWarning));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname, scheduleWarning]);

  // start the first schedule on mount
  useEffect(() => {
    scheduleWarning();
  }, [scheduleWarning]);

  // user clicked “Keep Working”
  const handleStayLoggedIn = useCallback(async () => {
    setModalOpen(false);

    const token = localStorage.getItem('token')!;
    const refreshToken = localStorage.getItem('refreshToken')!;

    try {
      const resp = await agent.UserLogins.refreshToken({
        token,
        refreshToken,
      });
      localStorage.setItem('token', resp.Token);
      localStorage.setItem('refreshToken', resp.RefreshToken);
    } catch {
      return handleLogout();
    }

    scheduleWarning();
  }, [handleLogout, scheduleWarning]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <InactivityModal
        open={modalOpen}
        countdown={MODAL_COUNTDOWN_S}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />

      {useRoutes(routes)}
    </ThemeProvider>
  );
};

export default App;