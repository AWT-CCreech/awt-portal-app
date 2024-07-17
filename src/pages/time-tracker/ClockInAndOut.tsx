import React, { useState, useEffect } from 'react';
import agent from '../../app/api/agent';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface IProps {
  todayTimeTrack: TimeTracker;
  setTodayTimeTrack: (tt: TimeTracker) => void;
}

const ClockInAndOut: React.FC<IProps> = ({ todayTimeTrack, setTodayTimeTrack }) => {
  const [secondsCount, setSecondsCount] = useState<number>(0);

  useEffect(() => {
    if (todayTimeTrack?.isWorking)
      setSecondsCount(secondsOfWorkSoFar(todayTimeTrack));
    else setSecondsCount(todayTimeTrack?.workTimeInSeconds!);
  }, [todayTimeTrack]);

  useEffect(() => {
    if (todayTimeTrack?.isWorking) {
      setTimeout(() => {
        setSecondsCount(secondsOfWorkSoFar(todayTimeTrack));
      }, 1000);
    }
  }, [secondsCount, todayTimeTrack]);

  const secondsOfWorkSoFar = (todayTimeTrack: TimeTracker | undefined) => {
    if (todayTimeTrack === undefined) return 0;
    if (todayTimeTrack.timeTrack !== '') {
      const arr = todayTimeTrack.timeTrack.split(';');
      const lastClockedIn = new Date(arr[arr.length - 1]);
      return (
        todayTimeTrack?.workTimeInSeconds +
        Math.round((Date.now() - lastClockedIn.getTime()) / 1000)
      );
    } else {
      return 0;
    }
  };

  const handleClockInClockOut = () => {
    agent.TimeTrackers.get(localStorage.getItem('userid')!.trim()).then(timeTrack => {
      if (timeTrack.isWorking !== todayTimeTrack?.isWorking) {
        setTodayTimeTrack(timeTrack);
        alert('There is an error from user. Please Clock In/Out again!!');
      } else {
        agent.TimeTrackers.update(timeTrack).then(response => setTodayTimeTrack(response));
      }
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} textAlign="right">
        <Button
          disabled={todayTimeTrack?.isWorking}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClockInClockOut}
          startIcon={<BadgeIcon />}
        >
          Clock In
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          disabled={!todayTimeTrack?.isWorking}
          variant="contained"
          color="primary"
          size="large"
          onClick={handleClockInClockOut}
          startIcon={<BadgeIcon />}
        >
          Clock Out
        </Button>
      </Grid>
      <Grid item xs={6} textAlign="right">
        <Typography variant="h6">
          Current Status
          <IconButton color="success">
            <BadgeIcon fontSize="large" />
          </IconButton>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {todayTimeTrack?.isWorking ? (
          <Chip
            icon={<CheckCircleIcon />}
            label="Clocked In"
            color="success"
          />
        ) : (
          <Chip
            icon={<CloseIcon />}
            label="Clocked Out"
            color="error"
          />
        )}
      </Grid>
      <Grid item xs={6} textAlign="right">
        <Typography variant="h6">
          Today Hours
          <IconButton color="success">
            <AccessTimeIcon fontSize="large" />
          </IconButton>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1">
          {Math.floor(secondsCount! / 3600)} hour(s) and {Math.floor(secondsCount / 60) % 60} minute(s)
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ClockInAndOut;
