import { useState, useEffect, useContext, useCallback, FC, memo } from 'react';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Grid2 from '@mui/material/Grid2';
import Modules from '../../app/api/agent';
import UserInfoContext from '../../shared/stores/userInfo';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { PODetailUpdateDto } from '../../models/PODeliveryLog/PODetailUpdateDto';
import { formatPhoneNumber } from '../../shared/utils/dataManipulation';
import { CamContact } from '../../models/CamContact';

// NOTE: Ideally, the NoteDto interface should reside in its own file.
interface NoteDto {
  Note: string;
  EnteredBy: string;
}

interface PODetailProps {
  poDetail: PODetailUpdateDto | null;
  onClose: () => void;
  loading: boolean;
  onUpdate: () => void;
}

interface PreviousNote {
  date: string;
  enteredBy: string;
  note: string;
}

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
  const [contactQuery, setContactQuery] = useState<string>('');
  const [contactSuggestions, setContactSuggestions] = useState<CamContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<CamContact | null>(null);

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

  useEffect(() => {
    if (poDetail && poDetail.contactName && !selectedContact) {
      setSelectedContact({
        id: poDetail.contactID,
        contact: poDetail.contactName,
        company: poDetail.company,
        phoneDirect: poDetail.phone,
        title: poDetail.title,
      } as CamContact);
      setContactQuery(poDetail.contactName);
    }
  }, [poDetail, selectedContact]);

  const fetchContactSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length <= 2) return;
      try {
        const response = await Modules.CamSearch.searchContacts({
          searchText: query,
          username: userInfo.username,
          searchBy: 'Contact',
          activeOnly: true,
          orderBy: 'Contact',
          companyId: 'AIR',
        });
        setContactSuggestions(response);
      } catch (error) {
        console.error('Error fetching contact suggestions:', error);
      }
    },
    [userInfo.username]
  );

  const handleNoteSubmit = async () => {
    if (!notes.trim() || !poDetail) return;

    try {
      // Optimistically update UI
      const newNote: PreviousNote = {
        date: new Date().toLocaleDateString(),
        enteredBy: userInfo.username,
        note: notes.trim(),
      };
      setPreviousNotes(prev => [newNote, ...prev]);

      const noteDto: NoteDto = {
        Note: notes.trim(),
        EnteredBy: userInfo.username,
      };

      await Modules.PODeliveryLogService.addNote(poDetail.id, noteDto);
      setNotes('');
      await fetchPreviousNotes();
    } catch (err) {
      console.error('Error submitting note:', err);
      setError('Failed to submit note. Please try again.');
      setPreviousNotes(prev => prev.filter(note => note.note !== notes.trim()));
    }
  };

  const handleUpdatePO = async () => {
    setError(null);
    if (!poDetail?.soNum) {
      throw new Error('SO Number is required');
    }
    try {
      const updateDto: PODetailUpdateDto = {
        ...poDetail,
        soNum: poDetail.soNum,
        newNote: '', // Note updates are handled separately.
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        userId: parseInt(userInfo.userid, 10),
        userName: userInfo.username,
        password: userInfo.password,
        updateAllDates: updateAllDates,
        urgentEmail: urgentEmail,
        contactID: selectedContact ? selectedContact.id : poDetail.contactID,
        contactName: selectedContact ? selectedContact.contact || '' : poDetail.contactName,
        company: selectedContact ? selectedContact.company || '' : poDetail.company,
        title: selectedContact ? selectedContact.title || '' : poDetail.title,
        phone: selectedContact
          ? formatPhoneNumber(
            selectedContact.phoneDirect || (selectedContact as any).phoneMain || ''
          )
          : formatPhoneNumber(poDetail.phone || ''),
      };

      await Modules.PODeliveryLogService.updatePODetail(poDetail.id, updateDto);
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating PO:', err);
      setError('Failed to update PO. Please try again.');
    }
  };

  const columns = ['date', 'enteredBy', 'note'];
  const columnNames = ['Date', 'Entered By', 'Note'];

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
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              boxShadow: 1,
              marginTop: 2,
            }}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                {loading ? (
                  <Skeleton variant="text" width="80%" animation="wave" />
                ) : (
                  <Autocomplete
                    freeSolo
                    options={contactSuggestions}
                    getOptionLabel={(option) =>
                      typeof option === 'string' ? option : option.contact || ''
                    }
                    inputValue={contactQuery}
                    onInputChange={(event, newValue) => {
                      setContactQuery(newValue);
                      if (newValue.length > 2) {
                        fetchContactSuggestions(newValue);
                      }
                    }}
                    onChange={(event, value) => {
                      if (value && typeof value !== 'string') {
                        setSelectedContact(value);
                        setContactQuery(value.contact || '');
                      } else {
                        setSelectedContact(null);
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.contact} - {option.title} ({option.company})
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Contact" placeholder="Search Contact" fullWidth />
                    )}
                  />
                )}
              </Grid2>
              <Grid2 size={4}>
                {loading ? (
                  <Skeleton variant="text" width="34%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    <strong>Company:</strong>{' '}
                    {selectedContact ? selectedContact.company : poDetail?.company}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={4}>
                {loading ? (
                  <Skeleton variant="text" width="33%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    <strong>Title:</strong>{' '}
                    {selectedContact ? selectedContact.title : poDetail?.title}
                  </Typography>
                )}
              </Grid2>
              <Grid2 size={4}>
                {loading ? (
                  <Skeleton variant="text" width="33%" animation="wave" />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'right' }}>
                    <strong>Phone:</strong>{' '}
                    {selectedContact
                      ? formatPhoneNumber(
                        selectedContact.phoneDirect || (selectedContact as any).phoneMain || ''
                      )
                      : formatPhoneNumber(poDetail?.phone || '')}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          </Box>
        </Grid2>

        <Grid2 size={12}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              boxShadow: 1,
              marginTop: 2,
            }}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
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
              </Grid2>
              <Grid2 size={6}>
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
              </Grid2>
              <Grid2 size={6}>
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
              </Grid2>
              <Grid2 size={6}>
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
              </Grid2>
              <Grid2 size={6}>
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
              </Grid2>
              <Grid2 size={6}>
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
              </Grid2>
            </Grid2>
          </Box>
        </Grid2>

        <Grid2 size={12}>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size="auto">
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="text" width={150} sx={{ marginLeft: 1 }} animation="wave" />
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
            </Grid2>
            <Grid2 size="auto">
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="text" width={120} sx={{ marginLeft: 1 }} animation="wave" />
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
            </Grid2>
          </Grid2>
        </Grid2>

        {error && (
          <Grid2 size={12}>
            <Typography color="error">{error}</Typography>
          </Grid2>
        )}

        <Grid2 size={12}>
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
                <Skeleton variant="rectangular" width="100%" height={100} animation="wave" />
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
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <TextField
                label="Add note..."
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'background.paper', flexGrow: 1 }}
              />
              <IconButton
                color="primary"
                onClick={handleNoteSubmit}
                disabled={!notes.trim() || loading}
                sx={{ ml: 1 }}
                aria-label="Send note"
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdatePO}>
            Update PO
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default PODetail;
