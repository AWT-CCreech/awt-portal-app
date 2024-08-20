import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import agent from '../../app/api/agent';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import VendorListItem from './components/VendorListItem';
import SelectedVendor from './components/SelectedVendor';
import '../styles/mass-mailer/EmailRecipient.css';

interface IProps {
  selectedVendors: IMassMailerVendor[];
  setSelectedVendors: (vendor: IMassMailerVendor[]) => void;
}

interface MfgOption {
  key: string;
  value: string;
  text: string;
}

const EmailRecipient: React.FC<IProps> = ({ selectedVendors, setSelectedVendors }) => {
  const [mfgOptions, setMfgOptions] = useState<MfgOption[]>([]);
  const [vendorsToSelect, setVendorsToSelect] = useState<IMassMailerVendor[]>([]);
  const [vendorListSelectedPage, setVendorListSelectedPage] = useState<number>(1);
  const [mfg, setMfg] = useState<string>('All');
  const [anc, setAnc] = useState<boolean>(false);
  const [fne, setFne] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch initial vendors and manufacturer options
    agent.MassMailer.Vendors.vendorList('All', false, false).then((response) => {
      setVendorsToSelect(response);
    });

    agent.MassMailer.Manufacturers.manufacturerList().then((response) => {
      const options = response.map((mfg: string) => ({
        key: mfg,
        value: mfg,
        text: mfg,
      }));
      setMfgOptions([{ key: 'All', value: 'All', text: 'All' }, ...options]);
      setLoading(false);
    });
  }, []);

  const handleMfgChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setCurrentPage(1);
    setMfg(value);
    agent.MassMailer.Vendors.vendorList(value, anc, fne).then((response) => {
      setVendorsToSelect(response);
    });
  };

  const handleAncChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setAnc(checked);
    agent.MassMailer.Vendors.vendorList(mfg, checked, fne).then((response) => {
      setVendorsToSelect(response);
    });
  };

  const handleFneChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFne(checked);
    agent.MassMailer.Vendors.vendorList(mfg, anc, checked).then((response) => {
      setVendorsToSelect(response);
    });
  };

  const handleSelectPage = (event: any, value: number) => {
    setCurrentPage(value);
  };

  const handleSelectItem = (vendorId: number) => {
    const index = vendorsToSelect.findIndex((vendor) => vendor.id === vendorId);
    setSelectedVendors([...selectedVendors, vendorsToSelect[index]]);
    vendorsToSelect.splice(index, 1);
  };

  const handleUnselectVendor = (vendorId: number) => {
    const unselectedItem = selectedVendors.find((vendor) => vendor.id === vendorId);
    if (unselectedItem !== undefined) {
      setVendorsToSelect([unselectedItem, ...vendorsToSelect]);
    }
    setSelectedVendors(selectedVendors.filter((vendor) => vendor.id !== vendorId));
  };

  const getSearchValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentPage(1);
    setSearchValue(event.target.value);
  };

  const handleSearch = (): IMassMailerVendor[] => {
    if (searchValue !== '') {
      return vendorsToSelect.filter((vendor) => {
        const name = (vendor.company + ' ' + vendor.contact).toLowerCase();
        const email = vendor.email.toLowerCase();
        return name.includes(searchValue.toLowerCase()) || email.includes(searchValue.toLowerCase());
      });
    } else {
      return vendorsToSelect;
    }
  };

  const handleSelectAll = () => {
    if (searchValue === '' && vendorsToSelect.length <= 25) {
      setSelectedVendors([...selectedVendors, ...vendorsToSelect]);
      setVendorsToSelect([]);
    } else if (handleSearch().length <= 25) {
      const selected = [...selectedVendors, ...handleSearch()];
      setSelectedVendors(selected);
      let toSelect = vendorsToSelect;
      selected.forEach((s) => {
        toSelect = toSelect.filter((v) => v.id !== s.id);
      });
      setVendorsToSelect(toSelect);
    } else {
      alert('The number of recipients exceeds 25. Please try to send to less than 25 recipients!');
    }
  };

  const handleClearAll = () => {
    setVendorsToSelect([...selectedVendors, ...vendorsToSelect]);
    setSelectedVendors([]);
  };

  useEffect(() => {
    setVendorListSelectedPage(currentPage);
  }, [currentPage]);

  return (
    <Box className="email-recipient-container">
      <Box sx={{ paddingBottom: 2 }}>
        <Typography variant="h6">Select Who Should Receive This Mailer</Typography>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ textDecoration: 'none' }}>List by Mfg</InputLabel>
              {loading ? (
                <Select id="massmailer-mfg" value="" disabled>
                  <MenuItem value="" disabled>
                    Loading...
                  </MenuItem>
                </Select>
              ) : (
                <Select
                  id="massmailer-mfg"
                  value={mfg}
                  onChange={handleMfgChange}
                >
                  {mfgOptions.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.text}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Box>
              <FormControlLabel
                control={<Checkbox checked={anc} onChange={handleAncChange} />}
                label="Ancillary"
              />
              <FormControlLabel
                control={<Checkbox checked={fne} onChange={handleFneChange} />}
                label="FNE"
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Container>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchValue}
                onChange={getSearchValue}
              />
            </Container>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ paddingY: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {handleSearch().map((vendor, index) => {
                if ((vendorListSelectedPage - 1) * 100 <= index && index < vendorListSelectedPage * 100) {
                  return (
                    <VendorListItem
                      key={vendor.id}
                      keyValue={vendor.id}
                      vendorId={vendor.id}
                      name={`${vendor.company} ( ${vendor.contact} )`}
                      isMainVendor={vendor.mainVendor}
                      handleSelect={handleSelectItem}
                    />
                  );
                }
                return null;
              })}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
              <Pagination
                count={Math.ceil(vendorsToSelect.length / 100)}
                page={currentPage}
                onChange={handleSelectPage}
                renderItem={(item) => (
                  <PaginationItem
                    component="div"
                    {...item}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ maxHeight: 314, overflow: 'auto' }}>
            {selectedVendors.map((vendor) => (
              <SelectedVendor
                key={vendor.id}
                vendorName={`${vendor.company} (${vendor.contact})`}
                vendorId={vendor.id}
                unselect={handleUnselectVendor}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ paddingTop: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSelectAll}>
              Select All Vendors
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleClearAll}>
              Clear All Selected Vendors
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmailRecipient;
