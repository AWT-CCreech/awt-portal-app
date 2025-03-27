import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router';
import { InactivityModalProps } from '../../models/Security/InactivityModal';

const InactivityModal: React.FC<InactivityModalProps> = ({
  open,
  countdown,
  onStayLoggedIn,
  onLogout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  const logoutTriggered = useRef(false);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(countdown);
    logoutTriggered.current = false;

    const token = localStorage.getItem('token');
    const expiresAt = token ? JSON.parse(atob(token.split('.')[1])).exp * 1000 : 0;
    if (Date.now() >= expiresAt) {
      logoutTriggered.current = true;
      onLogout();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!logoutTriggered.current) {
            logoutTriggered.current = true;
            onLogout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdown, onLogout]);

  const handleStay = async () => {
    if (!logoutTriggered.current) {
      await onStayLoggedIn();
      logoutTriggered.current = true;
    }
  };

  const handleLogoutNow = () => {
    if (!logoutTriggered.current) {
      logoutTriggered.current = true;
      onLogout();
    }
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogContent>
        <Box textAlign="center" py={3}>
          <Typography variant="h5" gutterBottom>Are you still there?</Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            You will be logged out in {secondsLeft}s
          </Typography>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={(secondsLeft / countdown) * 100}
              size={80}
            />
            <Box position="absolute" top={0} left={0} right={0} bottom={0}
              display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h6">{secondsLeft}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button variant="contained" onClick={handleStay}>Keep Working</Button>
        <Button variant="outlined" color="error" onClick={handleLogoutNow}>Logout Now</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;
