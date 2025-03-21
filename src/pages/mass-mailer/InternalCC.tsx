import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import MassMailerUser from '../../models/MassMailer/MassMailerUser';

interface IProps {
  CC: MassMailerUser[];
  setCC: (users: MassMailerUser[]) => void;
  allUsers: MassMailerUser[];
}

const InternalCC: React.FC<IProps> = ({ CC, setCC, allUsers }) => {
  const [searchCC, setSearchCC] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSelectCC = (email: string) => {
    setCC([...CC, ...allUsers.filter((u) => u.email === email)]);
  };

  const handleSearchCC = (): MassMailerUser[] => {
    if (searchCC !== '')
      return allUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchCC) ||
          user.email.toLowerCase().includes(searchCC)
      );
    else return allUsers;
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setOpen(true)}
      >
        Add CC (internal)
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Select CC on Email</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            {/* Left side: Search & List */}
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchCC}
                onChange={(e) => setSearchCC(e.target.value.toLowerCase())}
              />
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {handleSearchCC().map((user, i) => (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="success"
                        onClick={() => handleSelectCC(user.email)}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={user.fullName} />
                  </ListItem>
                ))}
              </List>
            </Grid2>
            {/* Right side: Selected CC */}
            <Grid2 size={{ xs: 6 }}>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {CC.map((selected, index) => {
                  if (selected.fullName.trim() === '') {
                    selected.fullName = selected.email;
                  }
                  return (
                    <Chip
                      key={index}
                      label={selected.fullName}
                      color="success"
                      onDelete={() =>
                        setCC(CC.filter((c) => c.email !== selected.email))
                      }
                      deleteIcon={<DeleteIcon />}
                      sx={{ margin: '8px' }}
                    />
                  );
                })}
              </Box>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setSearchCC('');
            }}
            color="primary"
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InternalCC;
