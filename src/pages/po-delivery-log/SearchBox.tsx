import React, { ChangeEvent } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { SearchInput } from '../../models/PODeliveryLog/SearchInput';

interface SearchBoxProps {
  searchParams: SearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchInput>>;
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchParams, setSearchParams, onSearch }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams: SearchInput) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams: SearchInput) => ({
      ...prevParams,
      [name as string]: value as string,
    }));
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="PO Number"
            name="PONum"
            value={searchParams.PONum}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Vendor"
            name="Vendor"
            value={searchParams.Vendor}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Part Number"
            name="PartNum"
            value={searchParams.PartNum}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Issued By"
            name="IssuedBy"
            value={searchParams.IssuedBy}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Sales Order Number"
            name="SONum"
            value={searchParams.SONum}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Sales Representative"
            name="xSalesRep"
            value={searchParams.xSalesRep}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>PO Status</InputLabel>
            <Select
              name="POStatus"
              value={searchParams.POStatus}
              onChange={handleSelectChange}
            >
              <MenuItem value="Not Complete">Not Complete</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
              <MenuItem value="Due w/n 2 Days">Due within 2 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              name="EquipType"
              value={searchParams.EquipType}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Ancillary">Ancillary</MenuItem>
              <MenuItem value="FNE">FNE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Company ID"
            name="CompanyID"
            value={searchParams.CompanyID}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Last Year"
            name="lstYear"
            type="number"
            value={searchParams.lstYear}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSearch}
            fullWidth
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
