import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

// Use Grid2 from the unstable package.
import Grid2 from '@mui/material/Grid2';

import agent from '../../app/api/agent';
import { MassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import '../../shared/styles/mass-mailer/PartTable.scss';

interface IProps {
  selectedpartItems: MassMailerPartItem[];
  setSelectedPartItems: (item: MassMailerPartItem[]) => void;
}

const PartTable: React.FC<IProps> = ({ selectedpartItems, setSelectedPartItems }) => {
  const [partItems, setPartItems] = useState<MassMailerPartItem[]>([]);

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
        <Grid2 container spacing={1}>
          {/* Table Headers */}
          <Grid2 container size={12} sx={{ backgroundColor: '#f5f5f5', padding: '8px 0' }}>
            <Grid2 size={1.5}>
              <Typography variant="subtitle2">Select</Typography>
            </Grid2>
            <Grid2 size={2}>
              <Typography variant="subtitle2">AWT P/N</Typography>
            </Grid2>
            <Grid2 size={2}>
              <Typography variant="subtitle2">MFG P/N</Typography>
            </Grid2>
            <Grid2 size={3}>
              <Typography variant="subtitle2">Description</Typography>
            </Grid2>
            <Grid2 size={1}>
              <Typography variant="subtitle2">Qty</Typography>
            </Grid2>
            <Grid2 size={1.5}>
              <Typography variant="subtitle2">Company</Typography>
            </Grid2>
            <Grid2 size={1.5}>
              <Typography variant="subtitle2">Manufacturer</Typography>
            </Grid2>
            <Grid2 size={1.5}>
              <Typography variant="subtitle2">Rev</Typography>
            </Grid2>
          </Grid2>

          {/* Part Items Rows */}
          {partItems.map((item, index) => (
            <Grid2 container size={12} key={index} alignItems="center" spacing={1}>
              {/* Checkbox */}
              <Grid2 size={1.5}>
                <Checkbox
                  checked={selectedpartItems.some((selected) => selected.id === item.id)}
                  onChange={(event) => handleCheckbox(item.id, event.target.checked)}
                  color="primary"
                  inputProps={{ 'aria-label': 'select part item' }}
                />
              </Grid2>

              {/* Airway Part Number */}
              <Grid2 size={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.partNum}
                  onChange={(e) => handleInputChange(item.id, 'partNum', e.target.value)}
                  fullWidth
                  placeholder="Airway Part #"
                />
              </Grid2>

              {/* Mfg Part Number */}
              <Grid2 size={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.altPartNum}
                  onChange={(e) => handleInputChange(item.id, 'altPartNum', e.target.value)}
                  fullWidth
                  placeholder="Mfg Part #"
                />
              </Grid2>

              {/* Part Description */}
              <Grid2 size={3}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.partDesc}
                  onChange={(e) => handleInputChange(item.id, 'partDesc', e.target.value)}
                  fullWidth
                  placeholder="Description"
                />
              </Grid2>

              {/* Quantity */}
              <Grid2 size={1}>
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
              </Grid2>

              {/* Company */}
              <Grid2 size={1.5}>
                <Typography variant="body2">{item.company}</Typography>
              </Grid2>

              {/* Manufacturer */}
              <Grid2 size={1.5}>
                <Typography variant="body2">{item.manufacturer}</Typography>
              </Grid2>

              {/* Revision */}
              <Grid2 size={1.5}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={item.revision}
                  onChange={(e) => handleInputChange(item.id, 'revision', e.target.value)}
                  fullWidth
                  placeholder="Rev"
                />
              </Grid2>
            </Grid2>
          ))}
        </Grid2>
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
