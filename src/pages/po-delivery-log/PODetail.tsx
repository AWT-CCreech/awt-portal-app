import React, { useState, useEffect, useContext, useCallback, FC, memo } from 'react';
import {
  TableCell,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Checkbox,
  Skeleton,
  TableRow,
} from '@mui/material';
import Modules from '../../app/api/agent';
import UserInfoContext from '../../stores/userInfo';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import { formatPhoneNumber } from '../../shared/utils/dataManipulation';

interface PODetailProps {
  poDetail: PODetailUpdateDto | null;
  onClose: () => void;
  loading: boolean;
  onUpdate: () => void; // Notify parent component to refresh data
}

interface PreviousNote {
  date: string;
  enteredBy: string;
  note: string;
}

// Memoized Row Component
const PODetailRow = memo(({ row }: { row: PreviousNote }) => (
  <TableRow>
    <TableCell>{row.date}</TableCell>
    <TableCell>{row.enteredBy}</TableCell>
    <TableCell>{row.note}</TableCell>
  </TableRow>
));

const PODetail: FC<PODetailProps> = ({ poDetail, onClose, loading, onUpdate }) => {
  const [notes, setNotes] = useState(poDetail?.newNote || '');
  const [expectedDelivery, setExpectedDelivery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urgentEmail, setUrgentEmail] = useState(false);
  const [updateAllDates, setUpdateAllDates] = useState(false);
  const [previousNotes, setPreviousNotes] = useState<PreviousNote[]>([]);
  const userInfo = useContext(UserInfoContext);

  const fetchPreviousNotes = useCallback(async () => {
    if (!poDetail) return;

    try {
      const notesData = await Modules.PODeliveryLogService.getPODetailByID(poDetail.id);
      if (notesData?.notesList) {
        setPreviousNotes(
          notesData.notesList.map((note: string) => {
            const [enteredBy, content, date] = note.split('::');
            return { date: date || 'No Date', enteredBy, note: content };
          })
        );
      }
    } catch (err) {
      console.error('Error fetching previous notes:', err);
      setPreviousNotes([]);
    }
  }, [poDetail]);

  useEffect(() => {
    if (poDetail) {
      setExpectedDelivery(
        poDetail.expectedDelivery
          ? new Date(poDetail.expectedDelivery).toISOString().split('T')[0]
          : ''
      );
      setNotes(poDetail.newNote || '');
      fetchPreviousNotes();
    }
  }, [poDetail, fetchPreviousNotes]);

  const handleUpdatePO = async () => {
    setError(null);
    if (!poDetail?.soNum) {
      throw new Error('SO Number is required');
    }
    try {
      const updateDto: PODetailUpdateDto = {
        ...poDetail!,
        soNum: poDetail?.soNum,
        newNote: notes,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        userId: parseInt(userInfo.userid, 10),
        userName: userInfo.username,
        password: userInfo.password,
        updateAllDates,
        urgentEmail,
        notesList: previousNotes.map(
          (note) => `${note.enteredBy}::${note.note}::${note.date}`
        ),
      };

      await Modules.PODeliveryLogService.updatePODetail(poDetail!.id, updateDto);
      onUpdate(); // Notify parent to refresh data
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error updating PO:', err);
      setError('Failed to update PO. Please try again.');
    }
  };

  // Configure columns for the PaginatedSortableTable component
  const columns = ['date', 'enteredBy', 'note'];
  const columnNames = ['Date', 'Entered By', 'Note'];

  // Function to render each row in the table
  const renderRow = useCallback(
    (row: PreviousNote) => <PODetailRow key={`${row.date}-${row.enteredBy}`} row={row} />,
    []
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {loading ? (
          <Skeleton variant="text" width="60%" animation="wave" />
        ) : (
          <span>
            Update Info for <b>{poDetail?.partNum}</b> on <b>PO#{poDetail?.poNum}</b>
          </span>
        )}
      </Typography>
      <Grid container spacing={2}>
        {/* Contact Information */}
        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {loading ? (
                  <Skeleton variant="text" width="80%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    <strong>Contact:</strong> {poDetail?.contactName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {loading ? (
                  <Skeleton variant="text" width="80%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    <strong>Company:</strong> {poDetail?.company}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {loading ? (
                  <Skeleton variant="text" width="80%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'right' }}>
                    <strong>Phone:</strong> {formatPhoneNumber(poDetail?.phone || '')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Additional PO Details */}
        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              boxShadow: 1,
              marginTop: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    disabled
                    label="SO#"
                    sx={{ backgroundColor: 'background.paper' }}
                    value={poDetail?.soNum || ''}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    disabled
                    label="Receiver Number"
                    sx={{ backgroundColor: 'background.paper' }}
                    value={poDetail?.receiverNum || ''}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    disabled
                    label="Quantity Ordered"
                    sx={{ backgroundColor: 'background.paper' }}
                    value={poDetail?.qtyOrdered || '0'}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    disabled
                    label="Quantity Received"
                    sx={{ backgroundColor: 'background.paper' }}
                    value={poDetail?.qtyReceived || '0'}
                    fullWidth
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    label="Expected Delivery"
                    sx={{ backgroundColor: 'background.paper' }}
                    type="date"
                    value={expectedDelivery || ''}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                {!loading && poDetail?.expDelEditDate && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ marginTop: 1, display: 'block' }}
                  >
                    Edited by <b>{poDetail?.editedBy}</b> on{' '}
                    <b>{new Date(poDetail.expDelEditDate).toLocaleDateString()}</b>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                ) : (
                  <TextField
                    disabled
                    label="Delivery Date"
                    sx={{ backgroundColor: 'background.paper' }}
                    value={
                      poDetail?.dateDelivered
                        ? new Date(poDetail.dateDelivered).toLocaleDateString()
                        : ''
                    }
                    fullWidth
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Checkboxes */}
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton
                    variant="text"
                    width={150}
                    sx={{ marginLeft: 1 }}
                    animation="wave"
                  />
                </Box>
              ) : (
                <>
                  <Checkbox
                    checked={updateAllDates}
                    onChange={(e) => setUpdateAllDates(e.target.checked)}
                  />
                  <Typography component="span">Update All Delivery Dates</Typography>
                </>
              )}
            </Grid>
            <Grid item>
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton
                    variant="text"
                    width={120}
                    sx={{ marginLeft: 1 }}
                    animation="wave"
                  />
                </Box>
              ) : (
                <>
                  <Checkbox
                    checked={urgentEmail}
                    onChange={(e) => setUrgentEmail(e.target.checked)}
                  />
                  <Typography component="span">Urgent Email Update</Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Error Message */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        {/* Notes Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6">
              {loading ? (
                <Skeleton variant="text" width="40%" animation="wave" />
              ) : (
                `Notes for PO#${poDetail?.poNum}`
              )}
            </Typography>
            {loading ? (
              <>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={100}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={100}
                  animation="wave"
                  sx={{ marginTop: 2 }}
                />
              </>
            ) : (
              <PaginatedSortableTable
                columns={columns}
                columnNames={columnNames}
                tableData={previousNotes}
                func={renderRow}
                headerBackgroundColor="#384959"
                hoverColor="#f5f5f5"
              />
            )}
            <TextField
              label="Add note..."
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              sx={{ marginTop: 2, backgroundColor: 'background.paper' }}
            />
          </Box>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdatePO}>
            Update PO
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PODetail;