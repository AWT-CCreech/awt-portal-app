import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { InactivityModalProps } from '../models/Security/InactivityModal';
import { handleAutoLogout } from '../utils/authentication';

const InactivityModal: React.FC<InactivityModalProps> = ({
  open,
  countdown,
  onStayLoggedIn,
  onLogout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  const hasLoggedOut = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const currentToken = localStorage.getItem('token');

    if (open && currentToken) {
      setSecondsLeft(countdown);
      hasLoggedOut.current = false;

      const tokenPayload = JSON.parse(atob(currentToken.split('.')[1]));
      const expiresAt = tokenPayload.exp * 1000;

      if (Date.now() >= expiresAt) {
        handleAutoLogout(navigate, onLogout, () => { });
        return;
      }

      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer!);

            if (!hasLoggedOut.current) {
              handleAutoLogout(navigate, onLogout, () => { });
              hasLoggedOut.current = true;
            }

            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, countdown, navigate, onLogout]);

  const handleStayLoggedIn = () => {
    if (!hasLoggedOut.current) {
      onStayLoggedIn();
      hasLoggedOut.current = true;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { }}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 3,
          boxShadow: 3,
        },
      }}
      slotProps={{
        backdrop: { style: { pointerEvents: 'none' } },
      }}
    >
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h5" gutterBottom>
            Are you still there?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginBottom: 2 }}
          >
            For your security, you will be logged out in
          </Typography>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={(secondsLeft / countdown) * 100}
              size={80}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" component="div" color="text.primary">
                {secondsLeft}s
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={handleStayLoggedIn}
          color="primary"
          variant="contained"
          sx={{ borderRadius: 2, paddingX: 3 }}
        >
          Keep Working
        </Button>
        <Button
          onClick={() => handleAutoLogout(navigate, onLogout, () => { })}
          color="error"
          variant="outlined"
          sx={{ borderRadius: 2, paddingX: 3 }}
        >
          Logout Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;
