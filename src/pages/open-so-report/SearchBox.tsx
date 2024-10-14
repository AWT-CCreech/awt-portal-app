// React and Hooks
import React, { ChangeEvent, KeyboardEvent, useEffect, useCallback, useState } from 'react';

// MUI Components and Icons
import {
  Box,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { GetApp, Search } from '@mui/icons-material';

// Models
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { AccountNumbers } from '../../models/Data/AccountNumbers';
import { ActiveSalesReps } from '../../models/Data/ActiveSalesReps';
import { ActiveSalesTeams } from '../../models/Data/ActiveSalesTeams';
import { ItemCategories } from '../../models/Data/ItemCategories';

// API
import Modules from '../../app/api/agent';

interface SearchBoxProps {
  searchParams: OpenSalesOrderSearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<OpenSalesOrderSearchInput>>;
  getResultSets: () => void;
  handleExport: () => void;
  searchResultLength: number;
  loading: boolean;  // Add the loading prop to control the state of the button
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchParams, setSearchParams, getResultSets, handleExport, searchResultLength, loading }) => {
  const [salesReps, setSalesReps] = useState<ActiveSalesReps[]>([]);
  const [salesTeams, setSalesTeams] = useState<ActiveSalesTeams[]>([]);
  const [itemCategories, setItemCategories] = useState<ItemCategories[]>([]);
  const [accountNumbers, setAccountNumbers] = useState<AccountNumbers[]>([]);

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const reps = await Modules.DataFetch.fetchActiveSalesReps();
        setSalesReps(reps);
      } catch (error) {
        console.error('Error fetching sales reps', error);
      }
    };

    const fetchSalesTeams = async () => {
      try {
        const teams = await Modules.DataFetch.fetchActiveSalesTeams();
        setSalesTeams(teams);
      } catch (error) {
        console.error('Error fetching sales teams', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const accountNumbers = await Modules.DataFetch.fetchAccountNumbers();
        setAccountNumbers(accountNumbers);
      } catch (error) {
        console.error('Error fetching account numbers', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await Modules.DataFetch.fetchItemCategories();
        setItemCategories(categories);
      } catch (error) {
        console.error('Error fetching item categories', error);
      }
    };

    fetchAccounts();
    fetchCategories();
    fetchSalesReps();
    fetchSalesTeams();

    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    setSearchParams(prevParams => ({
      ...prevParams,
      date1: lastYear,
      date2: today,
    }));
  }, [setSearchParams]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: name === 'date1' || name === 'date2' ? (value ? new Date(value) : null) : value,
    }));
  }, [setSearchParams]);

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name!]: value as string,
    }));
  }, [setSearchParams]);

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: checked,
    }));
  }, [setSearchParams]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      getResultSets();
    }
  }, [getResultSets]);

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 2 }, boxShadow: 3, bgcolor: 'background.paper', boxSizing: 'border-box' }}>
      <Grid container spacing={2} onKeyDown={handleKeyDown}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="dateFilterType-label">Date Filter Type</InputLabel>
            <Select
              labelId="dateFilterType-label"
              name="dateFilterType"
              value={searchParams.dateFilterType || 'OrderDate'}
              onChange={handleSelectChange}
            >
              <MenuItem key="OrderDate" value="OrderDate">Sales Order Date</MenuItem>
              <MenuItem key="ExpectedDelivery" value="ExpectedDelivery">Expected Delivery Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            name="date1"
            value={searchParams.date1 ? new Date(searchParams.date1).toISOString().substring(0, 10) : ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            name="date2"
            value={searchParams.date2 ? new Date(searchParams.date2).toISOString().substring(0, 10) : ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="reqDateStatus-label">Req Date Status</InputLabel>
            <Select
              labelId="reqDateStatus-label"
              name="reqDateStatus"
              value={searchParams.reqDateStatus || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              <MenuItem key="Late" value="Late">Late</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="salesTeam-label">Sales Team</InputLabel>
            <Select
              labelId="salesTeam-label"
              name="salesTeam"
              value={searchParams.salesTeam || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              {salesTeams.map((team) => (
                <MenuItem key={team.id} value={team.litem}>
                  {team.litem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="salesRep-label">Sales Rep</InputLabel>
            <Select
              labelId="salesRep-label"
              name="salesRep"
              value={searchParams.salesRep || 'All'}
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
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="AirWay SO"
            name="soNum"
            value={searchParams.soNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Part Number"
            name="partNum"
            value={searchParams.partNum || ''}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="accountNumber-label">Account Number</InputLabel>
            <Select
              labelId="accountNumber-label"
              name="accountNo"
              value={searchParams.accountNo || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              {accountNumbers.map((accountNumber) => (
                <MenuItem key={accountNumber.accountNo} value={accountNumber.accountNo}>
                  {accountNumber.accountNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={searchParams.category || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem key="All" value="All">All</MenuItem>
              {itemCategories.map((category) => (
                <MenuItem key={category.id} value={category.litem}>
                  {category.litem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="AirWay PO"
            name="poNum"
            value={searchParams.poNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Customer PO"
            name="custPO"
            value={searchParams.custPO || ''}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            label="Customer"
            name="customer"
            value={searchParams.customer || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={searchParams.chkExcludeCo || false}
                onChange={handleCheckboxChange}
                name="chkExcludeCo"
              />
            }
            label="Exclude Customer"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={searchParams.chkAllHere || false}
                onChange={handleCheckboxChange}
                name="chkAllHere"
              />
            }
            label="All Here"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={searchParams.chkGroupBySo || false}
                onChange={handleCheckboxChange}
                name="chkGroupBySo"
              />
            }
            label="Group by SO"
          />
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-start" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={getResultSets}
            fullWidth
            disabled={loading}  // Disable the button when loading
            startIcon={!loading && <Search />}  // Add the magnifying glass icon only when not loading
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}  {/* Show CircularProgress when loading */}
          </Button>
          <Tooltip title="Export to Excel">
            <span>
              <IconButton color="success" onClick={handleExport} sx={{ ml: 2 }} disabled={searchResultLength === 0}>
                <GetApp />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
