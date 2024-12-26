// React and Hooks
import React, { useState, useEffect, useCallback } from 'react';

// MUI Components and Icons
import {
  Box,
  Grid,
  TableCell,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';

// API
import Modules from '../../app/api/agent';

// Models
import { CamContact } from '../../models/CamContact';
import { NoteList } from '../../models/OpenSOReport/NoteList';
import { TrkSoNote } from '../../models/TrkSoNote';

// Components
import SortableTable from '../../shared/components/SortableTable';

interface NoteModalProps {
  soNum: string;
  partNum: string;
  notes: NoteList[];
  onClose: () => void;
  onNoteAdded: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({
  soNum,
  partNum,
  notes,
  onClose,
  onNoteAdded,
}) => {
  const [noteText, setNoteText] = useState<string>('');
  const [camContact, setCamContact] = useState<CamContact | null>(null);
  const [noteList, setNoteList] = useState<NoteList[]>(notes);
  const [username, setUsername] = useState<string>('');
  const [suggestions, setSuggestions] = useState<CamContact[]>([]);
  const [contactQuery, setContactQuery] = useState<string>('');
  const [companyQuery, setCompanyQuery] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'Contact' | 'Company'>('Contact');
  const [activeOnly, setActiveOnly] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsername = () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.warn('Username not found in local storage');
      }
    };

    fetchUsername();
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length <= 2) return; // Prevent fetching if the input is empty or too short
      try {
        const response = await Modules.CamSearch.searchContacts({
          searchText: query,
          username: username,
          searchBy: searchBy,
          activeOnly: activeOnly,
          orderBy: searchBy,
          companyId: 'AIR',
        });
        setSuggestions(response);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    },
    [username, activeOnly, searchBy]
  );

  useEffect(() => {
    if (contactQuery.length > 2 || companyQuery.length > 2) {
      fetchSuggestions(contactQuery || companyQuery);
    }
  }, [activeOnly, contactQuery, companyQuery, fetchSuggestions]);

  const handleContactInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setSearchBy('Contact');
    setContactQuery(value);
    if (!value) {
      setCompanyQuery(''); // Clear the company field when the contact field is cleared
      setCamContact(null); // Clear the selected contact
      setSuggestions([]); // Clear suggestions
    } else if (value.length > 2) {
      fetchSuggestions(value);
    }
  };

  const handleCompanyInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setSearchBy('Company');
    setCompanyQuery(value);
    if (!value) {
      setContactQuery(''); // Clear the contact field when the company field is cleared
      setCamContact(null); // Clear the selected contact
      setSuggestions([]); // Clear suggestions
    } else if (value.length > 2) {
      fetchSuggestions(value);
    }
  };

  const handleSelection = (
    event: React.SyntheticEvent,
    value: CamContact | string | null
  ) => {
    if (typeof value === 'object' && value !== null) {
      setCamContact(value);
      setContactQuery(value.contact || ''); // Update the contact field
      setCompanyQuery(value.company || ''); // Update the company field
    } else {
      setCamContact(null);
      setContactQuery(''); // Clear the contact field
      setCompanyQuery(''); // Clear the company field
    }
  };

  const saveNote = async () => {
    if (camContact && camContact.contact) {
      try {
        const newNote: TrkSoNote = {
          id: 0,
          entryDate: new Date(),
          enteredBy: username,
          modDate: new Date(),
          modBy: username,
          contactId: camContact?.id || 0,
          notes: noteText,
          orderNo: soNum,
          partNo: partNum,
          noteType: '',
        };

        const savedNote = await Modules.OpenSalesOrderNotes.addNote(newNote);

        // Update the note list with the newly saved note
        setNoteList([
          ...noteList,
          { ...savedNote, contactName: camContact?.contact || 'N/A' },
        ]);

        // Trigger the onNoteAdded callback to refetch notes in the parent component
        onNoteAdded();

        // Clear inputs but keep modal open
        setNoteText('');
        setCamContact(null);
        setContactQuery('');
        setCompanyQuery('');
        setSuggestions([]);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    } else {
      alert('You must select a contact before saving!');
    }
  };

  // Custom rendering function for the table rows
  const renderRow = (row: NoteList) => [
    <TableCell key="notes">{row.notes}</TableCell>,
    <TableCell key="contactName" sx={{ whiteSpace: 'nowrap' }}>
      {row.contactName || 'N/A'}
    </TableCell>,
    <TableCell key="entryDate">
      {row.entryDate ? new Date(row.entryDate).toLocaleDateString() : 'N/A'}
    </TableCell>,
    <TableCell key="enteredBy">{row.enteredBy}</TableCell>,
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        width: '100%',
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Notes for SO#{soNum}
        {partNum && ` - ${partNum}`}
      </Typography>

      <Box sx={{ width: '100%' }}>
        {' '}
        {/* Ensure consistent width */}
        {noteList.length > 0 ? (
          <SortableTable
            tableData={noteList}
            columns={['notes', 'contactName', 'entryDate', 'enteredBy']}
            columnNames={['Note', 'Contact', 'Date', 'By']}
            func={renderRow}
            headerBackgroundColor="#384959" // Customize as needed
            hoverColor="#f5f5f5" // Customize as needed
          />
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', padding: 2, color: 'gray' }}
          >
            No notes have been added.
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="h6" component="h3">
          Add Note
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) =>
                  typeof option === 'string'
                    ? option
                    : `${option.contact || ''} (${option.company || ''})`
                }
                inputValue={contactQuery}
                onInputChange={handleContactInputChange}
                onChange={handleSelection}
                value={camContact} // Bind the selected value to the input field
                renderOption={(props, option) => (
                  <li
                    {...props}
                    key={typeof option === 'string' ? option : option.id}
                  >
                    {typeof option === 'string'
                      ? option
                      : `${option.contact || ''} (${option.company || ''})`}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Contact"
                    placeholder="Enter contact name"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Checkbox
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                />
                <Typography variant="caption" sx={{ color: 'gray', mt: -1 }}>
                  Active Only
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) =>
              typeof option === 'string'
                ? option
                : `${option.company || ''} (${option.contact || ''})`
            }
            inputValue={companyQuery}
            onInputChange={handleCompanyInputChange}
            onChange={handleSelection}
            value={camContact} // Bind the selected value to the input field
            renderOption={(props, option) => (
              <li
                {...props}
                key={typeof option === 'string' ? option : option.id}
              >
                {typeof option === 'string'
                  ? option
                  : `${option.company || ''} (${option.contact || ''})`}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Company"
                placeholder="Enter company name"
                fullWidth
              />
            )}
          />
        </Box>
        <TextField
          id="noteTextarea"
          label="Note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note here"
          multiline
          rows={5}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <ButtonGroup>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Save />}
              onClick={saveNote}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Close />}
              onClick={onClose}
            >
              Close
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default NoteModal;
