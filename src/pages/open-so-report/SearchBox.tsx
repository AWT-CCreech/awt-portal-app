import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import LoadingIconButton from '../../shared/components/LoadingIconButton';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { AccountNumbers } from '../../models/Data/AccountNumbers';
import { Rep } from '../../models/Data/Rep';
import { ActiveSalesTeams } from '../../models/Data/ActiveSalesTeams';
import { ItemCategories } from '../../models/Data/ItemCategories';
import Modules from '../../app/api/agent';
import { formatAmount } from '../../shared/utils/dataManipulation';

// Import Grid2 from MUI
import Grid2 from '@mui/material/Grid2';

interface SearchBoxProps {
  searchParams: OpenSalesOrderSearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<OpenSalesOrderSearchInput>>;
  getResultSets: () => void;
  handleExport: () => void;
  searchResultLength: number;
  loading: boolean;
  loadingExport: boolean;
  summary?: {
    totalAmount: number;
    uniqueSalesOrders: number;
    totalItems: number;
  };
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchParams,
  setSearchParams,
  getResultSets,
  handleExport,
  searchResultLength,
  loading,
  loadingExport,
  summary,
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
    const todayStr = today.toISOString().substring(0, 10);
    const lastYearStr = lastYear.toISOString().substring(0, 10);
    console.log('Setting default date range:', { date1: lastYearStr, date2: todayStr });
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
    (event: SelectChangeEvent<string>) => {
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
        borderRadius: 2,
      }}
    >
      {/* Summary Display */}
      {summary && (
        <Box sx={{ mb: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ backgroundColor: grey[100], height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="subtitle1">
                    {formatAmount(summary.totalAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ backgroundColor: grey[100], height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sales Orders
                  </Typography>
                  <Typography variant="subtitle1">{summary.uniqueSalesOrders}</Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ backgroundColor: grey[100], height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="subtitle1">{summary.totalItems}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      )}

      {/* Existing Search Fields */}
      <Grid2 container spacing={2} onKeyDown={handleKeyDown}>
        {/* Date Filter Type */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="dateFilterType-label">Date Filter Type</InputLabel>
            <Select
              labelId="dateFilterType-label"
              name="dateFilterType"
              value={searchParams.dateFilterType || 'OrderDate'}
              onChange={handleSelectChange}
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
        </Grid2>
        {/* Start Date */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
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
        </Grid2>
        {/* End Date */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
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
        </Grid2>
        {/* Req Date Status */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="reqDateStatus-label">Req Date Status</InputLabel>
            <Select
              labelId="reqDateStatus-label"
              name="reqDateStatus"
              value={searchParams.reqDateStatus || 'All'}
              onChange={handleSelectChange}
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
        </Grid2>
        {/* Sales Team */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="salesTeam-label">Sales Team</InputLabel>
            <Select
              labelId="salesTeam-label"
              name="salesTeam"
              value={searchParams.salesTeam || 'All'}
              onChange={handleSelectChange}
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
        </Grid2>
        {/* Sales Rep */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="salesRep-label">Sales Rep</InputLabel>
            <Select
              labelId="salesRep-label"
              name="salesRep"
              value={searchParams.salesRep || 'All'}
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
        </Grid2>
        {/* AirWay SO */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="AirWay SO"
            name="soNum"
            value={searchParams.soNum || ''}
            onChange={handleInputChange}
          />
        </Grid2>
        {/* Part Number */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Part Number"
            name="partNum"
            value={searchParams.partNum || ''}
            onChange={handleInputChange}
          />
        </Grid2>
        {/* Account Number */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="accountNumber-label">Account Number</InputLabel>
            <Select
              labelId="accountNumber-label"
              name="accountNo"
              value={searchParams.accountNo || 'All'}
              onChange={handleSelectChange}
              label="Account Number"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              {accountNumbers.map((accountNumber) => (
                <MenuItem key={accountNumber.accountNo} value={accountNumber.accountNo}>
                  {accountNumber.accountNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        {/* Category */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={searchParams.category || 'All'}
              onChange={handleSelectChange}
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
        </Grid2>
        {/* AirWay PO */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="AirWay PO"
            name="poNum"
            value={searchParams.poNum || ''}
            onChange={handleInputChange}
          />
        </Grid2>
        {/* Customer PO */}
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <TextField
            fullWidth
            label="Customer PO"
            name="custPO"
            value={searchParams.custPO || ''}
            onChange={handleInputChange}
          />
        </Grid2>
        {/* Customer */}
        <Grid2 size={{ xs: 12, sm: 9 }}>
          <TextField
            fullWidth
            label="Customer"
            name="customer"
            value={searchParams.customer || ''}
            onChange={handleInputChange}
          />
        </Grid2>
        {/* Buttons */}
        <Grid2
          size={{ xs: 12, sm: 3 }}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <LoadingIconButton
            text="Search"
            icon={SearchIcon}
            loading={loading}
            onClick={getResultSets}
            color="primary"
            variant="contained"
            sx={{ width: 'auto', height: 'auto', mr: 2 }}
          />
          <LoadingIconButton
            text="Export"
            icon={GetAppIcon}
            loading={loadingExport}
            onClick={handleExport}
            color="secondary"
            variant="outlined"
            sx={{ width: 'auto', height: 'auto' }}
            disabled={searchResultLength === 0 || loadingExport || loading}
          />
        </Grid2>
        {/* Checkboxes */}
        <Grid2
          size={{ xs: 12 }}
          sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
        >
          <Grid2 size={{ xs: 12, sm: 12 }}>
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
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SearchBox;
