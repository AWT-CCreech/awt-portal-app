import React, { useState } from 'react';
import { Button, Modal, Grid, List, ListItem, ListItemText, IconButton, Input, Chip, Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';

interface IProps {
  recipients: IMassMailerUser[];
  setRecipients: (users: IMassMailerUser[]) => void;
  salesReps: IMassMailerUser[];
}

const RecipientPopUp: React.FC<IProps> = ({ recipients, setRecipients, salesReps }) => {
  const [searchRecipient, setSearchRecipient] = useState<string>("");

  const handleSelectRecipient = (email: string) => {
    setRecipients([...recipients, ...salesReps.filter(u => u.email === email)]);
  };

  const handleSearchRecipient = (): IMassMailerUser[] => {
    if (searchRecipient !== "")
      return salesReps.filter(user => user.fullName.toLowerCase().includes(searchRecipient) || user.email.toLowerCase().includes(searchRecipient));
    else
      return salesReps;
  };

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
        Add Rep
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, width: '50%', margin: 'auto', mt: '5%' }}>
          <Typography variant="h6" component="h2" mb={2}>
            Add Recipient
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder="Search..."
                value={searchRecipient}
                onChange={(e) => setSearchRecipient(e.target.value.toLowerCase())}
              />
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {handleSearchRecipient().map((user, i) => (
                  <ListItem key={i} secondaryAction={
                    <IconButton edge="end" aria-label="add" color="success" onClick={() => handleSelectRecipient(user.email)}>
                      <AddCircleIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={user.fullName} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {recipients.map((selected, index) => {
                  if (selected.fullName.trim() === "") selected.fullName = selected.email;
                  return (
                    <Chip
                      key={index}
                      label={selected.fullName}
                      color="success"
                      onDelete={() => setRecipients(recipients.filter(c => c.email !== selected.email))}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 1 }}
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="primary" onClick={() => { setOpen(false); setSearchRecipient(""); }}>
              Done
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default RecipientPopUp;
