import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { InactivityModalProps } from '../models/InactivityModal';

const InactivityModal: React.FC<InactivityModalProps> = ({ open, countdown, onStayLoggedIn, onLogout }) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (open) {
      // Reset countdown when the modal opens
      setSecondsLeft(countdown);

      // Start countdown
      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer!);
            onLogout(); // Logout when countdown reaches zero
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
  }, [open, countdown, onLogout]);

  return (
    <Dialog open={open} onClose={onLogout}>
      <DialogContent>
        <Typography variant="h6">You have been inactive for a while.</Typography>
        <Typography variant="body1">
          You will be automatically logged out in {secondsLeft} seconds.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStayLoggedIn} color="primary">
          Stay Logged In
        </Button>
        <Button onClick={onLogout} color="secondary">
          Logout Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;
