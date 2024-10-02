import React, { ChangeEvent, useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import Modules from '../../app/api/agent';
import { ActiveSalesReps } from '../../models/Data/ActiveSalesReps';
import { SearchInput } from '../../models/PODeliveryLog/SearchInput';

interface SearchBoxProps {
  searchParams: SearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchInput>>;
  onSearch: () => void;
  loading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchParams, setSearchParams, onSearch, loading }) => {
  const [salesReps, setSalesReps] = useState<ActiveSalesReps[]>([]);
  const [purchasingReps, setPurchasingReps] = useState<any[]>([]);

  useEffect(() => {
    const fetchReps = async () => {
      try {
        const [salesRepsData, purchasingRepsData] = await Promise.all([
          Modules.DataFetch.fetchActiveSalesReps(),
          Modules.DataFetch.fetchPurchasingReps(),
        ]);
        setSalesReps(salesRepsData);
        setPurchasingReps(purchasingRepsData);
      } catch (error) {
        console.error('Error fetching reps', error);
      }
    };

    fetchReps();
  }, []);

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
          <FormControl fullWidth>
            <InputLabel id="issuedBy-label">Issued By</InputLabel>
            <Select
              labelId="issuedBy-label"
              name="IssuedBy"
              value={searchParams.IssuedBy || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              {purchasingReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.uname}>
                  {rep.uname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <FormControl fullWidth>
            <InputLabel id="salesRep-label">Sales Rep</InputLabel>
            <Select
              labelId="salesRep-label"
              name="xSalesRep"
              value={searchParams.xSalesRep || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              {salesReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.uname}>
                  {rep.uname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select
              name="CompanyID"
              value={searchParams.CompanyID}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="AIR">AIR</MenuItem>
              <MenuItem value="SOL">SOL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Year"
            name="YearRange"
            type="number"
            value={searchParams.YearRange}
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
            disabled={loading} // Disable button when loading
            startIcon={!loading && <Search />} // Magnifying glass icon
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
