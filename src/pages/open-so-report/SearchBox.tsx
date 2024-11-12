// src/pages/open-so-report/SearchBox.tsx

import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  CircularProgress,
  SelectChangeEvent, // Import SelectChangeEvent
} from '@mui/material';
import LoadingIconButton from '../../components/LoadingIconButton'; // Adjust the path as necessary
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { AccountNumbers } from '../../models/Data/AccountNumbers';
import { Rep } from '../../models/Data/Rep';
import { ActiveSalesTeams } from '../../models/Data/ActiveSalesTeams';
import { ItemCategories } from '../../models/Data/ItemCategories';
import Modules from '../../app/api/agent';

interface SearchBoxProps {
  searchParams: OpenSalesOrderSearchInput;
  setSearchParams: React.Dispatch<
    React.SetStateAction<OpenSalesOrderSearchInput>
  >;
  getResultSets: () => void;
  handleExport: () => void;
  searchResultLength: number;
  loading: boolean;
  loadingExport: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchParams,
  setSearchParams,
  getResultSets,
  handleExport,
  searchResultLength,
  loading,
  loadingExport,
}) => {
  const [salesReps, setSalesReps] = useState<Rep[]>([]);
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

    // Set default date range from one year ago to today
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    // Format dates to 'YYYY-MM-DD' for the input fields
    const todayStr = today.toISOString().substring(0, 10); // 'YYYY-MM-DD'
    const lastYearStr = lastYear.toISOString().substring(0, 10); // 'YYYY-MM-DD'

    console.log('Setting default date range:', {
      date1: lastYearStr,
      date2: todayStr,
    });

    setSearchParams((prevParams) => ({
      ...prevParams,
      date1: lastYearStr,
      date2: todayStr,
    }));
  }, [setSearchParams]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      console.log(`Input Change - ${name}:`, value);
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]: value || null,
      }));
    },
    [setSearchParams]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => { // Updated type
      const { name, value } = event.target;
      console.log(`Select Change - ${name}:`, value);
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name!]: value as string,
      }));
    },
    [setSearchParams]
  );

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      console.log(`Checkbox Change - ${name}:`, checked);
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]: checked,
      }));
    },
    [setSearchParams]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed - triggering search');
        getResultSets();
      }
    },
    [getResultSets]
  );

  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 1, md: 2 },
        boxShadow: 3,
        bgcolor: 'background.paper',
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={2} onKeyDown={handleKeyDown}>
        {/* Date Filter Type */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="dateFilterType-label">Date Filter Type</InputLabel>
            <Select
              labelId="dateFilterType-label"
              name="dateFilterType"
              value={searchParams.dateFilterType || 'OrderDate'}
              onChange={handleSelectChange} // Correct handler
              label="Date Filter Type"
            >
              <MenuItem key="OrderDate" value="OrderDate">
                Sales Order Date
              </MenuItem>
              <MenuItem key="ExpectedDelivery" value="ExpectedDelivery">
                Expected Delivery Date
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Start Date */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            name="date1"
            value={searchParams.date1 || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: '2000-01-01', max: '2030-12-31' }}
          />
        </Grid>
        {/* End Date */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            name="date2"
            value={searchParams.date2 || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: '2000-01-01', max: '2030-12-31' }}
          />
        </Grid>
        {/* Req Date Status */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="reqDateStatus-label">Req Date Status</InputLabel>
            <Select
              labelId="reqDateStatus-label"
              name="reqDateStatus"
              value={searchParams.reqDateStatus || 'All'}
              onChange={handleSelectChange} // Correct handler
              label="Req Date Status"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              <MenuItem key="Late" value="Late">
                Late
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Sales Team */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="salesTeam-label">Sales Team</InputLabel>
            <Select
              labelId="salesTeam-label"
              name="salesTeam"
              value={searchParams.salesTeam || 'All'}
              onChange={handleSelectChange} // Correct handler
              label="Sales Team"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              {salesTeams.map((team) => (
                <MenuItem key={team.id} value={team.litem}>
                  {team.litem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Sales Rep */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="salesRep-label">Sales Rep</InputLabel>
            <Select
              labelId="salesRep-label"
              name="salesRep"
              value={searchParams.salesRep || 'All'}
              onChange={handleSelectChange} // Correct handler
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
        {/* AirWay SO */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="AirWay SO"
            name="soNum"
            value={searchParams.soNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Part Number */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Part Number"
            name="partNum"
            value={searchParams.partNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Account Number */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="accountNumber-label">Account Number</InputLabel>
            <Select
              labelId="accountNumber-label"
              name="accountNo"
              value={searchParams.accountNo || 'All'}
              onChange={handleSelectChange} // Correct handler
              label="Account Number"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              {accountNumbers.map((accountNumber) => (
                <MenuItem
                  key={accountNumber.accountNo}
                  value={accountNumber.accountNo}
                >
                  {accountNumber.accountNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Category */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={searchParams.category || 'All'}
              onChange={handleSelectChange} // Correct handler
              label="Category"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              {itemCategories.map((category) => (
                <MenuItem key={category.id} value={category.litem}>
                  {category.litem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* AirWay PO */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="AirWay PO"
            name="poNum"
            value={searchParams.poNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Customer PO */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Customer PO"
            name="custPO"
            value={searchParams.custPO || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Customer */}
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            label="Customer"
            name="customer"
            value={searchParams.customer || ''}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Buttons */}
        <Grid
          item
          xs={3}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <LoadingIconButton
            text="Search"
            icon={SearchIcon}
            loading={loading}
            onClick={getResultSets}
            color="primary"
            variant="contained"
            sx={{ width: '150px', height: '42px', mr: 2 }}
          />
          <LoadingIconButton
            text="Export"
            icon={GetAppIcon}
            loading={loadingExport}
            onClick={handleExport}
            color="secondary"
            variant="outlined"
            sx={{ width: '150px', height: '42px' }}
            disabled={searchResultLength === 0 || loadingExport || loading} // Now valid
          />
        </Grid>

        {/* Checkboxes */}
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* Checkboxes */}
          <Grid item xs={12} sm={3}>
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
                  checked={searchParams.chkGroupBySo || false}
                  onChange={handleCheckboxChange}
                  name="chkGroupBySo"
                />
              }
              label="Group by SO"
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
