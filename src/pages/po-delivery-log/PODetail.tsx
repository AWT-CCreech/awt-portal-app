import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Modules from '../../app/api/agent';
import UserInfoContext from '../../stores/userInfo';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';

interface PODetailProps {
  poDetail: PODetailUpdateDto;
  onClose: () => void;
}

const PODetail: React.FC<PODetailProps> = ({ poDetail, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [expectedDelivery, setExpectedDelivery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [urgentEmail, setUrgentEmail] = useState<boolean>(false);
  const [updateAllDates, setUpdateAllDates] = useState<boolean>(false);
  const [previousNotes, setPreviousNotes] = useState<{ date: string; enteredBy: string; note: string }[]>([]);

  const userInfo = useContext(UserInfoContext);

  const fetchPreviousNotes = useCallback(async () => {
    try {
      const notesData = await Modules.PODeliveryLogService.getPODetailByID(poDetail.id);
      if (notesData && Array.isArray(notesData.notesList)) {
        setPreviousNotes(
          notesData.notesList.map(note => {
            const [enteredBy, content, date] = note.split('::');
            return { date: date || 'No Date', enteredBy, note: content };
          })
        );
      }
    } catch (err) {
      console.error('Error fetching previous notes:', err);
      setPreviousNotes([]);
    }
  }, [poDetail.id]);

  useEffect(() => {
    if (poDetail) {
      setExpectedDelivery(poDetail.expectedDelivery ? new Date(poDetail.expectedDelivery).toISOString().split('T')[0] : '');
      setNotes(poDetail.newNote || '');
      fetchPreviousNotes();
    }
  }, [poDetail, fetchPreviousNotes]);

  const handleUpdatePO = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateDto: PODetailUpdateDto = {
        id: poDetail.id,
        poNum: poDetail.poNum,
        soNum: poDetail.soNum,
        partNum: poDetail.partNum,
        newNote: notes,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        userId: parseInt(userInfo.userid, 10),
        userName: userInfo.username,
        password: userInfo.password,
        contactID: poDetail.contactID ?? 0,
        updateAllDates: updateAllDates,
        urgentEmail: urgentEmail,
        notesList: previousNotes.map((note) => `${note.enteredBy}:${note.note}:${note.date}`),
      };

      await Modules.PODeliveryLogService.updatePODetail(poDetail.id, updateDto);
      onClose();
    } catch (err) {
      console.error('Error updating PO:', err);
      setError('Failed to update PO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {`PO#${poDetail.poNum} || P/N#${poDetail.partNum}`}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Expected Delivery"
            type="date"
            value={expectedDelivery}
            onChange={(e) => setExpectedDelivery(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sales Order Number"
            value={poDetail.soNum}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Item Number"
            value={poDetail.partNum}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity Ordered"
            value={poDetail.qtyOrdered}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity Received"
            value={poDetail.qtyReceived}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Checkbox
                checked={updateAllDates}
                onChange={(e) => setUpdateAllDates(e.target.checked)}
              />
              Update ALL PO Delivery Dates
            </Grid>
            <Grid item>
              <Checkbox
                checked={urgentEmail}
                onChange={(e) => setUrgentEmail(e.target.checked)}
              />
              Urgent Email Update
            </Grid>
          </Grid>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h6">PO Notes</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Entered By</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {previousNotes.map((note, index) => (
                <TableRow key={index}>
                  <TableCell>{note.date}</TableCell>
                  <TableCell>{note.enteredBy}</TableCell>
                  <TableCell>{note.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={`Notes for PO#${poDetail.poNum}`}
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdatePO} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update PO'}
          </Button>
          <Button variant="outlined" onClick={onClose} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PODetail;
