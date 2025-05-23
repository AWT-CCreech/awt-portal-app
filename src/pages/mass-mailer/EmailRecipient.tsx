import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Grid2 from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';

import agent from '../../app/api/agent';
import { MassMailerVendor } from '../../models/MassMailer/MassMailerVendor';

import '../../shared/styles/mass-mailer/EmailRecipient.scss';

interface IProps {
  selectedVendors: MassMailerVendor[];
  setSelectedVendors: (vendor: MassMailerVendor[]) => void;
  resetRecipients: boolean; // New prop to trigger reset
}

interface MfgOption {
  key: string;
  value: string;
  text: string;
}

const EmailRecipient: React.FC<IProps> = ({
  selectedVendors,
  setSelectedVendors,
  resetRecipients,
}) => {
  // Initialize mfgOptions with 'All' to prevent initial render issues
  const [mfgOptions, setMfgOptions] = useState<MfgOption[]>([
    { key: 'All', value: 'All', text: 'All' },
  ]);
  const [vendorsToSelect, setVendorsToSelect] = useState<MassMailerVendor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mfg, setMfg] = useState<string>('All');
  const [anc, setAnc] = useState<boolean>(false);
  const [fne, setFne] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const vendorsPerPage = 4; // Reduced items per page for better performance

  // Fetch vendors and manufacturers when component mounts or when resetRecipients changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vendorsResponse, manufacturersResponse] = await Promise.all([
          agent.MassMailer.Vendors.vendorList('All', false, false),
          agent.MassMailer.Manufacturers.manufacturerList(),
        ]);

        setVendorsToSelect(vendorsResponse);

        const options: MfgOption[] = manufacturersResponse.map((mfg: string) => ({
          key: mfg,
          value: mfg,
          text: mfg,
        }));
        setMfgOptions([{ key: 'All', value: 'All', text: 'All' }, ...options]);

        // Reset filters and search input after options are set
        setMfg('All');
        setAnc(false);
        setFne(false);
        setSearchValue('');
        setCurrentPage(1);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load vendors. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [resetRecipients]); // Dependency on resetRecipients

  const handleMfgChange = async (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setCurrentPage(1);
    setMfg(value);
    setLoading(true);
    try {
      const response = await agent.MassMailer.Vendors.vendorList(value, anc, fne);
      setVendorsToSelect(response);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vendors. Please try again.');
      setLoading(false);
    }
  };

  const handleAncChange = async (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setAnc(checked);
    setCurrentPage(1);
    setLoading(true);
    try {
      const response = await agent.MassMailer.Vendors.vendorList(mfg, checked, fne);
      setVendorsToSelect(response);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vendors. Please try again.');
      setLoading(false);
    }
  };

  const handleFneChange = async (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setFne(checked);
    setCurrentPage(1);
    setLoading(true);
    try {
      const response = await agent.MassMailer.Vendors.vendorList(mfg, anc, checked);
      setVendorsToSelect(response);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vendors. Please try again.');
      setLoading(false);
    }
  };

  const handleSelectPage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSelectItem = (vendorId: number) => {
    const vendor = vendorsToSelect.find((v) => v.id === vendorId);
    if (vendor && selectedVendors.length < 25) {
      setSelectedVendors([...selectedVendors, vendor]);
      setVendorsToSelect(vendorsToSelect.filter((v) => v.id !== vendorId));
    } else if (selectedVendors.length >= 25) {
      alert('The number of recipients exceeds 25. Please select less than 25 recipients!');
    }
  };

  const handleUnselectVendor = (vendorId: number) => {
    const unselectedItem = selectedVendors.find((vendor) => vendor.id === vendorId);
    if (unselectedItem) {
      setVendorsToSelect([unselectedItem, ...vendorsToSelect]);
      setSelectedVendors(selectedVendors.filter((vendor) => vendor.id !== vendorId));
    }
  };

  // Debounce the search input to optimize performance
  const debouncedSetSearchValue = useMemo(
    () =>
      debounce((value: string) => {
        setCurrentPage(1);
        setSearchValue(value);
      }, 300),
    []
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchValue(event.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchValue.cancel();
    };
  }, [debouncedSetSearchValue]);

  const filteredVendors = vendorsToSelect.filter((vendor) => {
    const searchLower = searchValue.toLowerCase();
    const name = `${vendor.company} ${vendor.contact}`.toLowerCase();
    const email = vendor.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const handleSelectAll = () => {
    const vendorsToAdd = filteredVendors.slice(0, 25 - selectedVendors.length);
    if (vendorsToAdd.length + selectedVendors.length > 25) {
      alert('The number of recipients exceeds 25. Please select less than 25 recipients!');
      return;
    }
    setSelectedVendors([...selectedVendors, ...vendorsToAdd]);
    setVendorsToSelect(vendorsToSelect.filter((v) => !vendorsToAdd.includes(v)));
  };

  const handleClearAll = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const confirmClearAll = () => {
    setVendorsToSelect([...selectedVendors, ...vendorsToSelect]);
    setSelectedVendors([]);
    setDialogOpen(false);
  };

  return (
    <Box className="email-recipient-container" sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Recipients
      </Typography>

      {/* Filters Section */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Grid2 container spacing={2} alignItems="center">
          {/* Manufacturer Filter */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="mfg-select-label">Manufacturer</InputLabel>
              <Select
                labelId="mfg-select-label"
                id="mfg-select"
                value={mfg}
                label="Manufacturer"
                onChange={handleMfgChange}
              >
                {mfgOptions.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          {/* Ancillary & FNE Filters */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <FormControlLabel
              control={<Checkbox checked={anc} onChange={handleAncChange} color="primary" />}
              label="Ancillary"
            />
            <FormControlLabel
              control={<Checkbox checked={fne} onChange={handleFneChange} color="primary" />}
              label="FNE"
            />
          </Grid2>

          {/* Search Bar */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Search Vendors"
              variant="outlined"
              fullWidth
              value={searchValue}
              onChange={handleSearchChange}
            />
          </Grid2>
        </Grid2>
      </Paper>

      {/* Vendors List and Selected Vendors */}
      <Grid2 container spacing={2}>
        {/* Available Vendors */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ padding: 2, height: '500px', overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Available Vendors</Typography>
              <Tooltip title="Select All Filtered Vendors">
                <span>
                  <IconButton
                    color="primary"
                    onClick={handleSelectAll}
                    disabled={selectedVendors.length >= 25 || filteredVendors.length === 0}
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : filteredVendors.length === 0 ? (
              <Typography>No vendors found.</Typography>
            ) : (
              <List>
                {filteredVendors
                  .slice((currentPage - 1) * vendorsPerPage, currentPage * vendorsPerPage)
                  .map((vendor) => (
                    <ListItem
                      key={vendor.id}
                      secondaryAction={
                        <Tooltip title="Select Vendor">
                          <span>
                            <IconButton
                              edge="end"
                              color="primary"
                              onClick={() => handleSelectItem(vendor.id)}
                              disabled={selectedVendors.length >= 25}
                            >
                              <AddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>{vendor.company.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${vendor.company} (${vendor.contact})`}
                        secondary={vendor.email}
                      />
                    </ListItem>
                  ))}
              </List>
            )}

            {/* Pagination */}
            {filteredVendors.length > vendorsPerPage && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(filteredVendors.length / vendorsPerPage)}
                  page={currentPage}
                  onChange={handleSelectPage}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        </Grid2>

        {/* Selected Vendors */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ padding: 2, height: '500px', overflowY: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Selected Vendors</Typography>
              <Tooltip title="Clear All Selected Vendors">
                <span>
                  <IconButton
                    color="error"
                    onClick={handleClearAll}
                    disabled={selectedVendors.length === 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            {selectedVendors.length === 0 ? (
              <Typography>No vendors selected.</Typography>
            ) : (
              <List>
                {selectedVendors.map((vendor) => (
                  <ListItem
                    key={vendor.id}
                    secondaryAction={
                      <Tooltip title="Unselect Vendor">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleUnselectVendor(vendor.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{vendor.company.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${vendor.company} (${vendor.contact})`}
                      secondary={vendor.email}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid2>
      </Grid2>

      {/* Confirmation Dialog for Clearing All */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-clear-all-title"
        aria-describedby="confirm-clear-all-description"
      >
        <DialogTitle id="confirm-clear-all-title">Confirm Clear All</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-clear-all-description">
            Are you sure you want to clear all selected vendors? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmClearAll} color="error" autoFocus>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailRecipient;
