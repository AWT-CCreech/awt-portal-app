import React, { useState, useEffect } from 'react';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import SelectPayPeriodForm from './SelectPayPeriodForm';
import agent from '../../app/api/agent';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Button, Paper } from '@mui/material';
import '../../styles/time-tracker/TimeSheet.scss'; // Import the SCSS file

interface IProps {
    trackersInPeriod: TimeTracker[],
    previousPeriod: boolean,
    setPreviousPeriod: (pp: boolean) => void,
    selectedSuperviseeId: string | null
}

const TimeSheet: React.FC<IProps> = ({ trackersInPeriod, previousPeriod, setPreviousPeriod, selectedSuperviseeId }) => {
    const [isApproved, setIsApproved] = useState<boolean>(false);

    const calculateTotalHours = (arr: TimeTracker[]) => {
        let totalSeconds = 0;
        for (let i = 0; i < arr.length; ++i){
            totalSeconds += arr[i].workTimeInSeconds;
        }
        return Math.round((totalSeconds/3600)*100)/100;
    }

    useEffect(() => {
        if (selectedSuperviseeId !== null)
            agent.TimeTrackers.isApproved(selectedSuperviseeId, previousPeriod)
                .then(response => setIsApproved(response));
    }, [trackersInPeriod, selectedSuperviseeId, previousPeriod])

    const generateTableInfo = (tt: TimeTracker) => {
        var inAndOutString = "";
        var inAndOutComponent: React.ReactNode;
        if (tt !== undefined && tt.timeTrack !== "" && tt.timeTrack !== undefined)
        {
            var inAndOut = tt.timeTrack.split('+').join("In:").split('-').join("Out:");
            inAndOutString = inAndOut.split(';').map(iao => {
                var arr = iao.split(' ');
                var temp = arr[2].split(":");
                temp.splice(2,1);
                arr[2] = temp.join(':');
                arr.splice(1,1);
                return arr.join(' ');
            }).join('; ');

            inAndOutComponent = tt.timeTrack.split(";").map<React.ReactNode>(t => {
                var arr = t.split(' ');
                var temp = arr[2].split(":");
                temp.splice(2,1);
                arr[2] = temp.join(':');
                
                if(t[0] === "+")
                    return (<span key={t} className="in-out-span"><b>In: </b> {`${arr[2]} ${arr[3]}`}</span>)
                else if (t[0] === "-")
                    return (<span key={t} className="in-out-span"><b>Out: </b> {`${arr[2]} ${arr[3]}`}</span>)
                else
                    return (<span key={t}></span>);
            }).reduce((prev, curr) => [prev, '; ', curr])
        }
        return {
            inAndOutString,
            inAndOutComponent,
            date: (new Date(tt.recordDate)).toDateString(),
            hours: Math.floor(tt.workTimeInSeconds/3600),
            minutes: Math.floor(tt.workTimeInSeconds/60) % 60
        };
    }

    const exportTimeSheetToExcel = (tts: TimeTracker[]) => {
        if (tts !== undefined && tts.length !== 0)
        {
            var table = '<table border="1px" style="font-size:20px"><tr><th>Date</th><th>In and Out</th><th>Hours</th></tr>';
            for (let i = 0; i < tts.length; ++i){
                var row = generateTableInfo(tts[i]);
                table += `<tr><td>${row.date}</td><td>${row.inAndOutString}</td><td>${row.hours} hour(s) ${row.minutes} minute(s)</td></tr>`;
            }
            table += `<tr><td></td><td style="text-align: right">Total:</td><td>${calculateTotalHours(tts)} hour(s)</td></tr></table>`;
            
            var content = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                            xmlns:x="urn:schemas-microsoft-com:office:excel" 
                            xmlns="http://www.w3.org/TR/REC-html40">
                                <head><!--[if gte mso 9]>
                                    <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}
                                        </x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
                                    </xml><![endif]-->
                                    </head><body>${table}</body></html>`;
            
            var temp = (generateTableInfo(tts[0]).date).split(' ');
            temp.shift();
            var title = 'TimeSheet' + temp.join(' ');

            var element = document.createElement('a');
            element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(content));
            element.setAttribute('download', title);
            element.className = 'hidden-download-link'; // Optional: for accessibility or additional styling
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    return (
        <div className="time-sheet-container">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <SelectPayPeriodForm 
                        previousPeriod={previousPeriod} 
                        setPreviousPeriod={setPreviousPeriod} 
                    />
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
                    <Button variant="contained" color="primary" onClick={() => exportTimeSheetToExcel(trackersInPeriod)}>
                        Export to Excel
                    </Button>
                </Grid>
            </Grid>

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
                        {trackersInPeriod.map(tt => {
                            const info = generateTableInfo(tt);
                            return (
                                <TableRow key={tt.id}>
                                    <TableCell>{info.date}</TableCell>
                                    <TableCell>{info.inAndOutComponent}</TableCell>
                                    <TableCell>{info.hours} hour(s) {info.minutes} minute(s)</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell colSpan={2} align="right"><b>Total:</b></TableCell>
                            <TableCell>{calculateTotalHours(trackersInPeriod)} hours (<b>{isApproved ? "Approved" : "Pending..."}</b>)</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TimeSheet;
