// React and Hooks
import React, { useEffect, useState } from 'react';

// MUI Components
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

// API
import agent from '../../app/api/agent';

// Models
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';

// Styles
import '../../styles/mass-mailer/PartTable.scss';

interface IProps {
  selectedpartItems: IMassMailerPartItem[];
  setSelectedPartItems: (item: IMassMailerPartItem[]) => void;
}

const PartTable: React.FC<IProps> = ({
  selectedpartItems,
  setSelectedPartItems,
}) => {
  const [partItems, setPartItems] = useState<IMassMailerPartItem[]>([]);

  useEffect(() => {
    const userid = localStorage.getItem('userid');
    if (userid !== null) {
      agent.MassMailer.PartItems.partItemsForUser(userid).then((response) => {
        setPartItems(response);
        setSelectedPartItems(response);
      });
    }
  }, [setSelectedPartItems]);

  const handleCheckbox = (
    id: string | number | undefined,
    checked: boolean | undefined
  ) => {
    if (checked === false) {
      setSelectedPartItems(selectedpartItems.filter((item) => item.id !== id));
    } else if (checked === true) {
      const newItem = partItems.find((item) => item.id === id);
      if (newItem && !selectedpartItems.some((item) => item.id === id)) {
        setSelectedPartItems([...selectedpartItems, newItem]);
      }
    }
  };

  const handleInputChange = (id: string | number | undefined, field: string, value: string) => {
    const updatedPartItems = partItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: field === 'qty' ? Number(value) : value };
      }
      return item;
    });
    setPartItems(updatedPartItems);

    const updatedSelectedItems = selectedpartItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: field === 'qty' ? Number(value) : value };
      }
      return item;
    });
    setSelectedPartItems(updatedSelectedItems);
  };

  const handleClearMailers = () => {
    const userid = localStorage.getItem('userid') ?? '';
    agent.MassMailer.ClearPartItems.clear(userid).then(() => window.location.reload());
  };

  return (
    <Box className="part-table-container" sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ padding: 2, overflowX: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Part Items
        </Typography>
        <Grid container spacing={1}>
          {/* Table Headers */}
          <Grid container item xs={12} sx={{ backgroundColor: '#f5f5f5', padding: '8px 0' }}>
            <Grid item xs={1.5}>
              <Typography variant="subtitle2">Select</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">Airway Part Number</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2">Mfg Part Number</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle2">Part Description</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="subtitle2">Qty</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography variant="subtitle2">Company</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography variant="subtitle2">Manufacturer</Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography variant="subtitle2">Rev</Typography>
            </Grid>
          </Grid>

          {/* Part Items Rows */}
          {partItems.map((item) => (
            <Grid container item xs={12} key={item.id} alignItems="center" spacing={1}>
              {/* Checkbox */}
              <Grid item xs={1.5}>
                <Checkbox
                  checked={selectedpartItems.some((selected) => selected.id === item.id)}
                  onChange={(event) => handleCheckbox(item.id, event.target.checked)}
                  color="primary"
                  inputProps={{ 'aria-label': 'select part item' }}
                />
              </Grid>

              {/* Airway Part Number */}
              <Grid item xs={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.partNum}
                  onChange={(e) => handleInputChange(item.id, 'partNum', e.target.value)}
                  fullWidth
                  placeholder="Airway Part #"
                />
              </Grid>

              {/* Mfg Part Number */}
              <Grid item xs={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.altPartNum}
                  onChange={(e) => handleInputChange(item.id, 'altPartNum', e.target.value)}
                  fullWidth
                  placeholder="Mfg Part #"
                />
              </Grid>

              {/* Part Description */}
              <Grid item xs={3}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.partDesc}
                  onChange={(e) => handleInputChange(item.id, 'partDesc', e.target.value)}
                  fullWidth
                  placeholder="Description"
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={1}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleInputChange(item.id, 'qty', e.target.value)}
                  fullWidth
                  inputProps={{ min: 0 }}
                  placeholder="Qty"
                />
              </Grid>

              {/* Company */}
              <Grid item xs={1.5}>
                <Typography variant="body2">{item.company}</Typography>
              </Grid>

              {/* Manufacturer */}
              <Grid item xs={1.5}>
                <Typography variant="body2">{item.manufacturer}</Typography>
              </Grid>

              {/* Revision */}
              <Grid item xs={1.5}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.revision}
                  onChange={(e) => handleInputChange(item.id, 'revision', e.target.value)}
                  fullWidth
                  placeholder="Rev"
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-start" marginTop={2}>
        <Tooltip title="Clear all selected mailers">
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearMailers}
          >
            Unmark Mailers
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PartTable;