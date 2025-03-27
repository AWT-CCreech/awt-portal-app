import React, { useEffect, useState, useContext } from 'react';
import ClockInAndOut from './ClockInAndOut';
import TimeSheet from './TimeSheet';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import { observer } from 'mobx-react-lite';
import agent from '../../app/api/agent';
import PageHeader from '../../shared/components/PageHeader';
import SupervisorApproval from './SupervisorApproval';
import AppState from '../../shared/stores/app';
import { useNavigate } from 'react-router';

const TimeTrackerPage: React.FC = () => {
  const { pageLoading } = useContext(AppState);
  const navigate = useNavigate();
  const [todayTimeTrack, setTodayTimeTrack] = useState<TimeTracker>({
    id: 0,
    userId: parseInt(localStorage.getItem('userid') ?? '0'),
    uName: localStorage.getItem('username') ?? '',
    recordDate: new Date(),
    timeTrack: '',
    isWorking: false,
    workTimeInSeconds: 0,
  });
  const [trackersInPeriod, setTrackersInPeriod] = useState<TimeTracker[]>([]);
  const [previousPeriod, setPreviousPeriod] = useState(false);
  const [selectedSuperviseeId, setSelectedSuperviseeId] = useState<string>(
    localStorage.getItem('userid')!
  );
  const [supervisorIds, setSupervisorIds] = useState<string[]>([
    '23',
    '40',
    '59',
    '178',
    '223',
    '224',
  ]);

  useEffect(() => {
    const userid = localStorage.getItem('userid');
    if (userid !== null && !supervisorIds.includes(userid)) {
      agent.TimeTrackers.get(localStorage.getItem('userid')!.trim()).then(
        (response) => setTodayTimeTrack(response)
      );
    } else {
      setPreviousPeriod(true);
    }
  }, [supervisorIds]);

  useEffect(() => {
    if (!supervisorIds.includes(selectedSuperviseeId)) {
      agent.TimeTrackers.getAllInPeriod(
        selectedSuperviseeId,
        previousPeriod
      ).then((response) => setTrackersInPeriod(response));
    }
  }, [todayTimeTrack, previousPeriod, selectedSuperviseeId, supervisorIds]);

  if (!pageLoading) {
    return (
      <div>
        <PageHeader pageName="Time Tracker" pageHref="/timetracker" />
        <Container maxWidth="xl" sx={{ padding: '40px 100px 150px 100px' }}>
          {supervisorIds.includes(localStorage.getItem('userid') ?? '') ? (
            <SupervisorApproval
              previousPeriod={previousPeriod}
              selectedSuperviseeId={selectedSuperviseeId}
              setSelectedSuperviseeId={setSelectedSuperviseeId}
              trackersInPeriod={trackersInPeriod}
              setTrackersInPeriod={setTrackersInPeriod}
            />
          ) : (
            <ClockInAndOut
              todayTimeTrack={todayTimeTrack}
              setTodayTimeTrack={setTodayTimeTrack}
            />
          )}

          <TimeSheet
            trackersInPeriod={trackersInPeriod}
            previousPeriod={previousPeriod}
            setPreviousPeriod={setPreviousPeriod}
            selectedSuperviseeId={selectedSuperviseeId}
          />
        </Container>
      </div>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size="large" />
      </Box>
    );
  }
};

export default observer(TimeTrackerPage);
