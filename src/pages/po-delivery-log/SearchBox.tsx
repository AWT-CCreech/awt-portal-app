import React, { useEffect, useState, ChangeEvent } from 'react';
import { Grid, TextField, MenuItem, Typography, Autocomplete, CircularProgress, Box } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import Modules from '../../app/api/agent';
import SearchInput from '../../models/PODeliveryLog/SearchInput';
import LoadingIconButton from '../../components/LoadingIconButton'; // Import the LoadingIconButton

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
  const [salesReps, setSalesReps] = useState<{ id: number; uname: string }[]>([]);
  const [purchasingReps, setPurchasingReps] = useState<{ id: number; uname: string }[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [vendorLoading, setVendorLoading] = useState<boolean>(false);

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

  const fetchVendors = debounce(async (params: SearchInput) => {
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
  }, 500);

  useEffect(() => {
    fetchVendors(searchParams);
  }, [searchParams.Vendor, searchParams.PONum, searchParams.PartNum, searchParams.IssuedBy, searchParams.SONum, searchParams.xSalesRep]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name as string]: value as string,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
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
            />
          </Grid>

          {/* Purchasing Rep (Issued By) */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Purch Rep"
              name="IssuedBy"
              value={searchParams.IssuedBy || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              {purchasingReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.uname}>
                  {rep.uname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Part Number */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Part Number"
              name="PartNum"
              value={searchParams.PartNum}
              onChange={handleInputChange}
            />
          </Grid>

          {/* PO Status */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="PO Status"
              name="POStatus"
              value={searchParams.POStatus}
              onChange={handleSelectChange}
            >
              <MenuItem value="Not Complete">Not Complete</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </TextField>
          </Grid>

          {/* SO Number */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="SO Number"
              name="SONum"
              value={searchParams.SONum}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Sales Rep */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Sales Rep"
              name="xSalesRep"
              value={searchParams.xSalesRep || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              {salesReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.uname}>
                  {rep.uname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Vendor Picker */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              fullWidth
              options={vendors}
              getOptionLabel={(option: string) => option}
              value={searchParams.Vendor || ''}
              onChange={(event, newValue) => {
                setSearchParams((prevParams) => ({
                  ...prevParams,
                  Vendor: newValue || '',
                }));
              }}
              onInputChange={(event, newInputValue) => {
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
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {vendorLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
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
            <TextField
              select
              fullWidth
              label="Equipment Type"
              name="EquipType"
              value={searchParams.EquipType}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="ANC">ANC</MenuItem>
              <MenuItem value="FNE">FNE</MenuItem>
            </TextField>
          </Grid>

          {/* Company ID */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Company ID"
              name="CompanyID"
              value={searchParams.CompanyID}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="AIR">AIR</MenuItem>
              <MenuItem value="SOL">SOL</MenuItem>
            </TextField>
          </Grid>

          {/* Year Range */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Year Range"
              name="YearRange"
              type="number"
              value={searchParams.YearRange}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sm={6} md={6} container spacing={1} alignItems="center">
            <Grid item>
              <LoadingIconButton
                text={loading ? 'Searching' : 'Search'}
                icon={SearchIcon}
                loading={loading}
                onClick={onSearch}
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit" // Ensures form submission
              />
            </Grid>
            <Grid item>
              <LoadingIconButton
                text={loadingExport ? 'Exporting' : 'Export'}
                icon={GetAppIcon}
                loading={loadingExport}
                onClick={handleExport}
                variant="outlined"
                color="secondary"
                disabled={loadingExport || loading || searchResultLength === 0}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default SearchBox;
