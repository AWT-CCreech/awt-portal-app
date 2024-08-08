import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Modules from '../../app/api/agent';
import { TrkSoNote } from '../../models/TrkSoNote'; 
import { CamContact } from '../../models/CamContact';

interface NoteModalProps {
  soNum: string;
  partNum: string;
  notes: TrkSoNote[];
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ soNum, partNum, notes, onClose }) => {
  const [noteText, setNoteText] = useState<string>('');
  const [contact, setContact] = useState<CamContact>({ id: 0, contact: '', company: '' });
  const [noteList, setNoteList] = useState<TrkSoNote[]>(notes);
  const [warehouseNote, setWarehouseNote] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

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

  const saveNote = async () => {
    if (warehouseNote || contact.contact) {
      try {
        const newNote: TrkSoNote = {
          id: 0, // Assuming this will be overwritten by the backend
          entryDate: new Date(),
          enteredBy: username,
          modDate: new Date(),
          modBy: username,
          contactId: contact.id,
          notes: noteText,
          orderNo: soNum,
          partNo: partNum,
          noteType: warehouseNote ? 'warehouse' : '',
        };

        console.log('Sending note:', newNote);  // Log the payload

        await Modules.OpenSalesOrderNotes.addNote(newNote);
        setNoteText('');
        setContact({ id: 0, contact: '', company: '' });

        // Update the note list with the new note
        setNoteList([...noteList, newNote]);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    } else {
      alert('You must select a contact before saving!');
    }
  };

  const handleContactChange = (field: keyof CamContact, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

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
        Notes for SO#{soNum}{partNum && ` - Part # ${partNum}`}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Note</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noteList.map((note, index) => (
              <TableRow key={note.id ?? index}>
                <TableCell>{note.notes}</TableCell>
                <TableCell>{note.contactId}</TableCell>
                <TableCell>{note.entryDate ? new Date(note.entryDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{note.enteredBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="h6" component="h3">
          Add Note
        </Typography>
        {!warehouseNote && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Contact"
              value={contact.contact}
              onChange={e => handleContactChange('contact', e.target.value)}
              placeholder="Enter contact name"
              fullWidth
            />
            <TextField
              label="Company"
              value={contact.company}
              onChange={e => handleContactChange('company', e.target.value)}
              placeholder="Enter company name"
              fullWidth
            />
          </Box>
        )}
        <TextField
          id="noteTextarea"
          label="Note"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Enter your note here"
          multiline
          rows={5}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={saveNote}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NoteModal;
