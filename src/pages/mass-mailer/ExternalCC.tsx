import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Grid2 from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';

import MassMailerUser from '../../models/MassMailer/MassMailerUser';

interface IProps {
  CC: MassMailerUser[];
  setCC: (users: MassMailerUser[]) => void;
}

const ExternalCC: React.FC<IProps> = ({ CC, setCC }) => {
  const [open, setOpen] = useState(false);
  const [uname, setUname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const addCC = () => {
    setCC([...CC, { userName: uname, fullName: name, email }]);
    setUname('');
    setEmail('');
    setName('');
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setOpen(true)}
      >
        Add CC (external)
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>External CC</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} direction="column" alignItems="center">
            <Grid2 size={{ xs: 12 }} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Button variant="contained" color="secondary" onClick={addCC}>
                Add
              </Button>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2} justifyContent="flex-start" sx={{ mt: 2 }}>
            {CC.map((selected, index) => (
              <Grid2 key={index} size="auto">
                <Chip
                  label={
                    selected.fullName.trim() === '' ? selected.email : selected.fullName
                  }
                  color="success"
                  onDelete={() => setCC(CC.filter((c) => c.email !== selected.email))}
                  deleteIcon={<DeleteIcon />}
                  style={{ margin: '8px' }}
                />
              </Grid2>
            ))}
          </Grid2>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExternalCC;
