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
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { InactivityModalProps } from '../models/Security/InactivityModal';
import { handleAutoLogout } from '../utils/authentication';

const InactivityModal: React.FC<InactivityModalProps> = ({
  open,
  countdown,
  onStayLoggedIn,
  onLogout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  const hasLoggedOut = useRef(false); // Ref to track if logout has already been triggered
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (open) {
      // Reset countdown when the modal opens
      setSecondsLeft(countdown);
      hasLoggedOut.current = false; // Reset the logout flag

      // Start countdown
      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer!);

            // Ensure logout is only called once when countdown reaches zero
            if (!hasLoggedOut.current) {
              handleAutoLogout(navigate, onLogout, () => {}); // Use navigate in handleAutoLogout
              hasLoggedOut.current = true;
            }

            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    // Cleanup timer when the modal is closed or component is unmounted
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
      onClose={() => {}} // Prevent closing on backdrop click or escape key
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 3,
          boxShadow: 3,
        },
      }}
      slotProps={{
        backdrop: { style: { pointerEvents: 'none' } }, // Prevent closing on backdrop click
      }}
    >
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Typography variant="h5" gutterBottom>
            Are you still there?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
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
          color="success"
          variant="contained"
          sx={{ borderRadius: 2, paddingX: 3 }}
        >
          Keep Working
        </Button>
        <Button
          onClick={() => handleAutoLogout(navigate, onLogout, () => {})} // Trigger logout manually
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
