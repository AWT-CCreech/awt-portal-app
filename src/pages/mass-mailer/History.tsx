import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    TableRow,
    TableCell
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { MassMailHistory } from '../../models/MassMailHistory';
import MassMailerUser from '../../models/MassMailer/MassMailerUser';
import agent from '../../app/api/agent';
import '../../shared/styles/mass-mailer/History.scss';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';

interface HistoryModalProps {
    open: boolean;
    onClose: () => void;
    // List of MassMailerUsers (active users who have sent a mass mail)
    massMailerUsers: MassMailerUser[];
    // Default username (current user's username)
    defaultUsername: string;
    // Optionally, filter by a specific MassMailer record ID (allow for dive into details)
    massMailId?: number;
}

const History: React.FC<HistoryModalProps> = ({
    open,
    onClose,
    massMailerUsers,
    defaultUsername,
    massMailId,
}) => {
    // Use the provided defaultUsername if it exists in the list;
    // otherwise, default to the first available user's userName.
    const [selectedUsername, setSelectedUsername] = useState<string>(defaultUsername);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [records, setRecords] = useState<MassMailHistory[]>([]);

    // Update selectedUsername when the modal opens or defaultUsername changes.
    useEffect(() => {
        if (open && massMailerUsers.length > 0) {
            const found = massMailerUsers.find(
                u => u.userName.toLowerCase() === defaultUsername.toLowerCase()
            );
            setSelectedUsername(found ? found.userName : massMailerUsers[0].userName);
        }
    }, [open, massMailerUsers, defaultUsername]);

    // Fetch history records whenever the modal is open and the selected user changes.
    useEffect(() => {
        if (open && selectedUsername) {
            setLoading(true);
            setError(null);
            // Use selectedUsername to fetch history records
            agent.MassMailerHistory.getByUser(selectedUsername)
                .then((data: MassMailHistory[]) => {
                    const filteredRecords = massMailId
                        ? data.filter(record => record.massMailId === massMailId)
                        : data;
                    setRecords(filteredRecords);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError('Failed to fetch history records.');
                    setLoading(false);
                });
        }
    }, [open, selectedUsername, massMailId]);

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        setSelectedUsername(event.target.value);
    };

    // Custom row renderer to display a single history record.
    const renderRow = (row: MassMailHistory, hoverColor: string) => (
        <TableRow key={row.id} hover style={{ backgroundColor: hoverColor }}>
            <TableCell>{row.massMailId}</TableCell>
            <TableCell>{row.companyName}</TableCell>
            <TableCell>{row.contactName}</TableCell>
            <TableCell>{row.partNum}</TableCell>
            <TableCell>{row.partDesc}</TableCell>
            <TableCell>{row.qty}</TableCell>
            <TableCell>
                {row.dateSent ? new Date(row.dateSent).toLocaleString() : ''}
            </TableCell>
            <TableCell>{row.respondedTo ? 'Yes' : 'No'}</TableCell>
        </TableRow>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Mass Mail History</DialogTitle>
            <DialogContent dividers>
                {/* Dropdown for selecting a MassMailerUser */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="mass-mailer-user-select-label">Select User</InputLabel>
                    <Select
                        labelId="mass-mailer-user-select-label"
                        value={selectedUsername}
                        label="Select User"
                        onChange={handleUserChange}
                    >
                        {massMailerUsers.map((user, index) => (
                            <MenuItem key={index} value={user.userName}>
                                {user.userName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading && (
                    <div className="history-loading-container">
                        <CircularProgress />
                    </div>
                )}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && records.length === 0 && (
                    <Typography>No history records found.</Typography>
                )}
                {!loading && !error && records.length > 0 && (
                    <PaginatedSortableTable
                        tableData={records}
                        columns={[
                            'massMailId',
                            'companyName',
                            'contactName',
                            'partNum',
                            'partDesc',
                            'qty',
                            'dateSent',
                            'respondedTo',
                        ]}
                        columnNames={[
                            'ID',
                            'Company',
                            'Contact',
                            'Part Number',
                            'Description',
                            'Quantity',
                            'Date Sent',
                            'Responded',
                        ]}
                        headerBackgroundColor="#384959"
                        hoverColor="#f5f5f5"
                        tableHeight={400}
                        func={renderRow}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default History;
