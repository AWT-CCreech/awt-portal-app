// React and Hooks
import React, { ChangeEvent, useEffect, useState } from 'react';

// MUI Components and Icons
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { GetApp, Search } from '@mui/icons-material';

// Utilities
import { debounce } from 'lodash';

// Models
import SearchInput from '../../models/PODeliveryLog/SearchInput';
import { Rep } from '../../models/Data/Rep';

// API
import Modules from '../../app/api/agent';

interface SearchBoxProps {
  searchParams: SearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchInput>>;
  onSearch: () => void;
  loading: boolean;
  handleExport: () => void;
  loadingExport: boolean;
  searchResultLength: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchParams,
  setSearchParams,
  onSearch,
  loading,
  handleExport,
  loadingExport,
  searchResultLength,
}) => {
  const [salesReps, setSalesReps] = useState<Rep[]>([]);
  const [purchasingReps, setPurchasingReps] = useState<Rep[]>([]);
  const [vendors, setVendors] = useState<string[]>([]); // State for vendor list
  const [vendorLoading, setVendorLoading] = useState<boolean>(false); // Loading state for vendors

  // Fetch sales reps and purchasing reps on component mount
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

  // Fetch vendors whenever relevant search parameters change
  useEffect(() => {
    // Prepare parameters for fetching vendors
    const params: SearchInput = {
      PONum: searchParams.PONum,
      Vendor: searchParams.Vendor,
      PartNum: searchParams.PartNum,
      IssuedBy: searchParams.IssuedBy,
      SONum: searchParams.SONum,
      xSalesRep: searchParams.xSalesRep,
      HasNotes: searchParams.HasNotes,
      POStatus: searchParams.POStatus,
      EquipType: searchParams.EquipType,
      CompanyID: searchParams.CompanyID,
      YearRange: searchParams.YearRange,
    };

    const debouncedFetchVendors = debounce(async () => {
      setVendorLoading(true);
      try {
        const vendorList = await Modules.PODeliveryLogService.getVendors(params);
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([]);
      } finally {
        setVendorLoading(false);
      }
    }, 500); // Debounce delay of 500ms

    debouncedFetchVendors();

    // Cleanup function to cancel debounce if the component unmounts or parameters change
    return () => {
      debouncedFetchVendors.cancel();
    };
  }, [
    searchParams.PONum,
    searchParams.Vendor,
    searchParams.PartNum,
    searchParams.IssuedBy,
    searchParams.SONum,
    searchParams.xSalesRep,
    searchParams.HasNotes,
    searchParams.POStatus,
    searchParams.EquipType,
    searchParams.CompanyID,
    searchParams.YearRange,
  ]);

  // Handle input changes for text fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSearchParams((prevParams: SearchInput) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // Handle changes for select fields
  const handleSelectChange = (e: SelectChangeEvent<string>): void => {
    const { name, value } = e.target;
    setSearchParams((prevParams: SearchInput) => ({
      ...prevParams,
      [name as string]: value as string,
    }));
  };

  // Handle notes change specifically
  const handleNotesChange = (e: SelectChangeEvent<string>): void => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      HasNotes: e.target.value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
        <Grid container spacing={2}>
          {/* PO Number */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="PO Number"
              name="PONum"
              value={searchParams.PONum}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Purchasing Rep */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="issuedBy-label">Purch Rep</InputLabel>
              <Select
                labelId="issuedBy-label"
                name="IssuedBy"
                value={searchParams.IssuedBy || 'All'}
                onChange={handleSelectChange}
                label="Purch Rep"
              >
                <MenuItem key="All" value="All">
                  All
                </MenuItem>
                {purchasingReps.map((rep) => (
                  <MenuItem key={rep.id} value={rep.uname}>
                    {rep.uname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Part Number */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Part Number"
              name="PartNum"
              value={searchParams.PartNum}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* PO Status */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>PO Status</InputLabel>
              <Select
                name="POStatus"
                value={searchParams.POStatus}
                onChange={handleSelectChange}
                label="PO Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
                <MenuItem value="Not Complete">Not Complete</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Due w/n 2 Days">Due w/n 2 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* SO Number */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="SO Number"
              name="SONum"
              value={searchParams.SONum}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          {/* Sales Rep */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="salesRep-label">Sales Rep</InputLabel>
              <Select
                labelId="salesRep-label"
                name="xSalesRep"
                value={searchParams.xSalesRep || 'All'}
                onChange={handleSelectChange}
                label="Sales Rep"
              >
                <MenuItem key="All" value="All">
                  All
                </MenuItem>
                {salesReps.map((rep) => (
                  <MenuItem key={rep.id} value={rep.uname}>
                    {rep.uname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Vendor Picker */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              fullWidth
              options={vendors}
              getOptionLabel={(option: string) => option}
              value={searchParams.Vendor || ''}
              onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                setSearchParams((prevParams) => ({
                  ...prevParams,
                  Vendor: newValue || '',
                }));
              }}
              onInputChange={(event: React.SyntheticEvent, newInputValue: string) => {
                setSearchParams((prevParams) => ({
                  ...prevParams,
                  Vendor: newInputValue || '',
                }));
              }}
              loading={vendorLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vendor"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {vendorLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Equipment Type */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Equipment Type</InputLabel>
              <Select
                name="EquipType"
                value={searchParams.EquipType}
                onChange={handleSelectChange}
                label="Equipment Type"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="ANC">ANC</MenuItem>
                <MenuItem value="FNE">FNE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                name="CompanyID"
                value={searchParams.CompanyID}
                onChange={handleSelectChange}
                label="Company"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="AIR">AIR</MenuItem>
                <MenuItem value="SOL">SOL</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Notes</InputLabel>
              <Select
                name="HasNotes"
                value={searchParams.HasNotes}
                onChange={handleNotesChange}
                label="Notes"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Year Range */}
          <Grid item xs={12} sm={6} md={3}>
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

          {/* Search and Export Buttons */}
          <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              startIcon={!loading && <Search />}
              sx={{ mr: 2 }} // Add some margin between buttons
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleExport}
              disabled={loadingExport || searchResultLength === 0}
              startIcon={loadingExport ? <CircularProgress size={20} /> : <GetApp />}
            >
              Export to Excel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default SearchBox;
