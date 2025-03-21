import React, { useState, useEffect } from 'react';
import agent from '../../app/api/agent';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import SelectPayPeriodForm from './SelectPayPeriodForm';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import '../../shared/styles/time-tracker/TimeSheet.scss';

// Import Grid2 from MUI
import Grid2 from '@mui/material/Grid2';

interface IProps {
  trackersInPeriod: TimeTracker[];
  previousPeriod: boolean;
  setPreviousPeriod: (pp: boolean) => void;
  selectedSuperviseeId: string | null;
}

const TimeSheet: React.FC<IProps> = ({
  trackersInPeriod,
  previousPeriod,
  setPreviousPeriod,
  selectedSuperviseeId,
}) => {
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const calculateTotalHours = (arr: TimeTracker[]) => {
    let totalSeconds = 0;
    for (let i = 0; i < arr.length; ++i) {
      totalSeconds += arr[i].workTimeInSeconds;
    }
    return Math.round((totalSeconds / 3600) * 100) / 100;
  };

  useEffect(() => {
    if (selectedSuperviseeId !== null)
      agent.TimeTrackers.isApproved(selectedSuperviseeId, previousPeriod).then(
        (response) => setIsApproved(response)
      );
  }, [trackersInPeriod, selectedSuperviseeId, previousPeriod]);

  const generateTableInfo = (tt: TimeTracker) => {
    let inAndOutString = '';
    let inAndOutComponent: React.ReactNode;
    if (tt !== undefined && tt.timeTrack !== '' && tt.timeTrack !== undefined) {
      const inAndOut = tt.timeTrack
        .split('+')
        .join('In:')
        .split('-')
        .join('Out:');
      inAndOutString = inAndOut
        .split(';')
        .map((iao) => {
          const arr = iao.split(' ');
          const temp = arr[2].split(':');
          temp.splice(2, 1);
          arr[2] = temp.join(':');
          arr.splice(1, 1);
          return arr.join(' ');
        })
        .join('; ');

      inAndOutComponent = tt.timeTrack
        .split(';')
        .map<React.ReactNode>((t) => {
          const arr = t.split(' ');
          const temp = arr[2].split(':');
          temp.splice(2, 1);
          arr[2] = temp.join(':');

          if (t[0] === '+')
            return (
              <span key={t} className="in-out-span">
                <b>In: </b> {`${arr[2]} ${arr[3]}`}
              </span>
            );
          else if (t[0] === '-')
            return (
              <span key={t} className="in-out-span">
                <b>Out: </b> {`${arr[2]} ${arr[3]}`}
              </span>
            );
          else return <span key={t}></span>;
        })
        .reduce((prev, curr) => [prev, '; ', curr]);
    }
    return {
      inAndOutString,
      inAndOutComponent,
      date: new Date(tt.recordDate).toDateString(),
      hours: Math.floor(tt.workTimeInSeconds / 3600),
      minutes: Math.floor(tt.workTimeInSeconds / 60) % 60,
    };
  };

  const exportTimeSheetToExcel = (tts: TimeTracker[]) => {
    if (tts !== undefined && tts.length !== 0) {
      let table =
        '<table border="1px" style="font-size:20px"><tr><th>Date</th><th>In and Out</th><th>Hours</th></tr>';
      for (let i = 0; i < tts.length; ++i) {
        const row = generateTableInfo(tts[i]);
        table += `<tr><td>${row.date}</td><td>${row.inAndOutString}</td><td>${row.hours} hour(s) ${row.minutes} minute(s)</td></tr>`;
      }
      table += `<tr><td></td><td style="text-align: right">Total:</td><td>${calculateTotalHours(tts)} hour(s)</td></tr></table>`;

      const content = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                            xmlns:x="urn:schemas-microsoft-com:office:excel" 
                            xmlns="http://www.w3.org/TR/REC-html40">
                                <head><!--[if gte mso 9]>
                                    <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}
                                        </x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
                                    </xml><![endif]-->
                                    </head><body>${table}</body></html>`;

      const temp = generateTableInfo(tts[0]).date.split(' ');
      temp.shift();
      const title = 'TimeSheet' + temp.join(' ');

      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:application/vnd.ms-excel,' + encodeURIComponent(content)
      );
      element.setAttribute('download', title);
      element.className = 'hidden-download-link';
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <Box className="time-sheet-container">
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <SelectPayPeriodForm
            previousPeriod={previousPeriod}
            setPreviousPeriod={setPreviousPeriod}
          />
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportTimeSheetToExcel(trackersInPeriod)}
          >
            Export to Excel
          </Button>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper} className="time-sheet-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>In and Out</TableCell>
              <TableCell>Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackersInPeriod.map((tt) => {
              const info = generateTableInfo(tt);
              return (
                <TableRow key={tt.id}>
                  <TableCell>{info.date}</TableCell>
                  <TableCell>{info.inAndOutComponent}</TableCell>
                  <TableCell>
                    {info.hours} hour(s) {info.minutes} minute(s)
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={2} align="right">
                <b>Total:</b>
              </TableCell>
              <TableCell>
                {calculateTotalHours(trackersInPeriod)} hours (
                <b>{isApproved ? 'Approved' : 'Pending...'}</b>)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeSheet;
