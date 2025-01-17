import React, { useContext } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { TrackerReport } from '../../models/TimeTracker/TrackerReport';
import agent from '../../app/api/agent';
import AppState from '../../shared/stores/app';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';

interface SuperviseeOption {
  key: string;
  value: string;
  text: string;
}

interface IProps {
  openConfirmation: boolean;
  setOpenConfirmation: (oc: boolean) => void;
  report: TrackerReport[];
  setReport: (r: TrackerReport[]) => void;
  superviseeOptions: SuperviseeOption[];
  previousPeriod: boolean;
  setTrackersInPeriod: (trackersInPeriod: TimeTracker[]) => void;
  setSelectedSuperviseeId: (id: string) => void;
}

const ReportConfirmation: React.FC<IProps> = ({
  openConfirmation,
  setOpenConfirmation,
  report,
  setReport,
  superviseeOptions,
  previousPeriod,
  setTrackersInPeriod,
  setSelectedSuperviseeId,
}) => {
  const { setPageLoading } = useContext(AppState);
  const confirmationContent = () => {
    if (report.length === 0)
      return 'No employee was approved. Please click Cancel!';
    else if (report.length === superviseeOptions.length)
      return 'You have approved all of hourly workers. Do you want to send the report?';
    else
      return `You have approved: ${report.map((r) => r.fullName).join(', ')}. Do you want to send the report?`;
  };

  const handleConfirm = () => {
    setOpenConfirmation(false);
    if (report.length > 0) {
      let body =
        '<html><body><h3>Total hours from %%STARTDATE%% to %%ENDDATE%%:</h3>';
      body +=
        '<table style=\'width: 20%\' border=\'1\'><tr><th>Name</th><th>Hours</th></tr>';
      report.forEach(
        (r) =>
        (body += `<tr><td style='text-align: center'>${r.fullName}</td>
                                            <td style='text-align: center'>${r.hours}</td></tr>`)
      );
      body += '</table></body></html>';

      setPageLoading(true);
      agent.TimeTrackers.sendEmailReport({
        body,
        userName: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
        previousPeriod,
      }).then((response) => {
        if (response === 'sent') {
          setPageLoading(false);
          setReport([]);
          setTrackersInPeriod([]);
          setSelectedSuperviseeId('0');
        } else {
          alert('Fail to send email! Contact IT department for support!');
        }
      });

      agent.TimeTrackers.approve({
        userIds: report.map((r) => parseInt(r.userId)),
        previousPeriods: report.map((r) => r.previousPeriod),
      });
    }
  };

  const handleCancel = () => setOpenConfirmation(false);
  return (
    <Dialog
      open={openConfirmation}
      onClose={handleCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {`Approval Status: ${report.length} out of ${superviseeOptions.length}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {confirmationContent()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportConfirmation;
