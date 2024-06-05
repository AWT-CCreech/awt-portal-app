import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, FormControl, Select, InputLabel, Button, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { TimeTracker } from '../../models/TimeTracker/TimeTracker';
import { TrackerReport } from '../../models/TimeTracker/TrackerReport';
import ReportConfirmation from './ReportConfirmation';

interface IProps {
    selectedSuperviseeId: string | null;
    setSelectedSuperviseeId: (id: string) => void;
    trackersInPeriod: TimeTracker[];
    setTrackersInPeriod: (trackersInPeriod: TimeTracker[]) => void;
    previousPeriod: boolean;
}

// Define the option type for Material-UI Select
interface SuperviseeOption {
    key: string;
    value: string;
    text: string;  // Added 'text' property
}

const SupervisorApproval: React.FC<IProps> = ({
    selectedSuperviseeId, setSelectedSuperviseeId, trackersInPeriod, setTrackersInPeriod, previousPeriod
}) => {
    const superviseeOptionsMap = new Map<string, SuperviseeOption[]>();

    // Kevin's supervisee(s)
    superviseeOptionsMap.set(
        '40', [
            { key: '141', value: '141-Kurt Davis', text: 'Kurt Davis' },
            { key: '82', value: '82-Robin Delaney', text: 'Robin Delaney' },
            { key: '234', value: '234-Edward Quezada', text: 'Edward Quezada' },
            { key: '235', value: '235-Brent Voss', text: 'Brent Voss' },
            { key: '237', value: '237-Jason Phillips', text: 'Jason Phillips' }
        ]);

    // Shem's supervisee(s)
    superviseeOptionsMap.set(
        '59', [
            { key: '141', value: '141-Kurt Davis', text: 'Kurt Davis' },
            { key: '82', value: '82-Robin Delaney', text: 'Robin Delaney' },
            { key: '234', value: '234-Edward Quezada', text: 'Edward Quezada' },
            { key: '235', value: '235-Brent Voss', text: 'Brent Voss' },
            { key: '237', value: '237-Jason Phillips', text: 'Jason Phillips' }
        ]);

    // Teresa's supervisee(s)
    superviseeOptionsMap.set(
        '178', [
            { key: '158', value: '158-Karen Bowling', text: 'Karen Bowling' }
        ]);

    // Tom's supervisee(s)
    superviseeOptionsMap.set(
        '223', [
            { key: '141', value: '141-Kurt Davis', text: 'Kurt Davis' },
            { key: '82', value: '82-Robin Delaney', text: 'Robin Delaney' },
            { key: '234', value: '234-Edward Quezada', text: 'Edward Quezada' },
            { key: '235', value: '235-Brent Voss', text: 'Brent Voss' },
            { key: '237', value: '237-Jason Phillips', text: 'Jason Phillips' }
        ]);

    // Amanda's supervisee(s)
    superviseeOptionsMap.set(
        '224', [
            { key: '141', value: '141-Kurt Davis', text: 'Kurt Davis' },
            { key: '82', value: '82-Robin Delaney', text: 'Robin Delaney' },
            { key: '234', value: '234-Edward Quezada', text: 'Edward Quezada' },
            { key: '235', value: '235-Brent Voss', text: 'Brent Voss' },
            { key: '237', value: '237-Jason Phillips', text: 'Jason Phillips' }
        ]);

    const [superviseeOptions, setSuperviseeOptions] = 
        useState<SuperviseeOption[]>(superviseeOptionsMap.get(localStorage.getItem('userid')!) || []);

    const [fullName, setFullName] = useState<string>("");
    const [checkBoxValue, setCheckBoxValue] = useState<boolean>(false);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [report, setReport] = useState<TrackerReport[]>([]); // this contains all the approved employees

    const handleSelectChange = (value: string): void => {
        setSelectedSuperviseeId(value.split('-')[0]);
        setFullName(value.split('-')[1]);
    };

    useEffect(() => {
        setCheckBoxValue(
            report.find(tr => tr.userId === selectedSuperviseeId) !== undefined
        );
    }, [selectedSuperviseeId, report]);

    const handleApprovalChange = (checked: boolean): void => {
        if (selectedSuperviseeId !== null) {
            if (checked) {
                var seconds = 0;
                for (let i = 0; i < trackersInPeriod.length; ++i) {
                    seconds += trackersInPeriod[i].workTimeInSeconds;
                }
                setReport([...report, { userId: selectedSuperviseeId, fullName, hours: Math.round((seconds / 3600) * 100) / 100, previousPeriod }]);
            } else {
                setReport(report.filter(tr => tr.userId !== selectedSuperviseeId));
            }
        }
        setCheckBoxValue(!checkBoxValue);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <h3>Select employee:</h3>
                    <FormControl fullWidth>
                        <InputLabel id="supervisee-select-label">Employee</InputLabel>
                        <Select
                            labelId="supervisee-select-label"
                            value={selectedSuperviseeId || ''}
                            onChange={(e) => handleSelectChange(e.target.value)}
                        >
                            {superviseeOptions.map(option => (
                                <MenuItem key={option.key} value={option.value}>{option.text}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <FormControlLabel
                        control={<Checkbox checked={checkBoxValue} onChange={(e) => handleApprovalChange(e.target.checked)} />}
                        label="Check box to approve"
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={2} container justifyContent="flex-end" alignItems="center">
                <Button variant="contained" color="primary" size="large" onClick={() => setOpenConfirmation(true)}>
                    Send Report
                </Button>
            </Grid>
            <ReportConfirmation
                openConfirmation={openConfirmation}
                setOpenConfirmation={setOpenConfirmation}
                report={report}
                setReport={setReport}
                superviseeOptions={superviseeOptions}
                previousPeriod={previousPeriod}
                setTrackersInPeriod={setTrackersInPeriod}
                setSelectedSuperviseeId={setSelectedSuperviseeId}
            />
        </Grid>
    );
};

export default SupervisorApproval;
