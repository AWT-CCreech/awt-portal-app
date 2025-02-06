// React and Hooks
import React, { useState } from 'react';

// MUI Components and Icons
import {
  Button,
  Modal,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Input,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

// Models
import MassMailerUser from '../../models/MassMailer/MassMailerUser';

interface IProps {
  recipients: MassMailerUser[];
  setRecipients: (users: MassMailerUser[]) => void;
  salesReps: MassMailerUser[];
}

const RecipientModal: React.FC<IProps> = ({ recipients, setRecipients, salesReps }) => {
  const [searchRecipient, setSearchRecipient] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSelectRecipient = (email: string) => {
    setRecipients([
      ...recipients,
      ...salesReps.filter((u) => u.email === email),
    ]);
  };

  const handleSearchRecipient = (): MassMailerUser[] => {
    if (searchRecipient !== '')
      return salesReps.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchRecipient) ||
          user.email.toLowerCase().includes(searchRecipient)
      );
    else return salesReps;
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setOpen(true)}
      >
        Add Rep
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            width: '50%',
            margin: 'auto',
            mt: '5%',
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Add Recipient
          </Typography>
          <Grid2 container spacing={2}>
            {/* Left Side */}
            <Grid2 size={{ xs: 6 }}>
              <Input
                fullWidth
                placeholder="Search..."
                value={searchRecipient}
                onChange={(e) =>
                  setSearchRecipient(e.target.value.toLowerCase())
                }
              />
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {handleSearchRecipient().map((user, i) => (
                  <ListItem key={i} divider>
                    <ListItemText primary={user.fullName} />
                    <IconButton
                      edge="end"
                      aria-label="add"
                      color="success"
                      onClick={() => handleSelectRecipient(user.email)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Grid2>
            {/* Right Side */}
            <Grid2 size={{ xs: 6 }}>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {recipients.map((selected, index) => {
                  // Fallback: if fullName is empty, use email
                  if (selected.fullName.trim() === '')
                    selected.fullName = selected.email;
                  return (
                    <Chip
                      key={index}
                      label={selected.fullName}
                      color="success"
                      onDelete={() =>
                        setRecipients(
                          recipients.filter((c) => c.email !== selected.email)
                        )
                      }
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 1 }}
                    />
                  );
                })}
              </Box>
            </Grid2>
          </Grid2>
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpen(false);
                setSearchRecipient('');
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default RecipientModal;
