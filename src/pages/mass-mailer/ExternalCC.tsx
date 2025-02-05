// React and Hooks
import React, { useState } from 'react';

// MUI Components and Icons
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Models
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
    setCC([...CC, { userName: uname, fullName: name, email: email }]);
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
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item marginTop={1}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={addCC}>
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-start" mt={2}>
            {CC.map((selected, index) => (
              <Grid item key={index}>
                <Chip
                  label={selected.fullName || selected.email}
                  color="success"
                  onDelete={() =>
                    setCC(CC.filter((c) => c.email !== selected.email))
                  }
                  deleteIcon={<DeleteIcon />}
                  style={{ margin: '8px' }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExternalCC;
