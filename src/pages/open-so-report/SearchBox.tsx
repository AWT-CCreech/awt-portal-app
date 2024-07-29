import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Box, Button, TextField, Grid, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import OpenSalesOrderSearchInput from '../../models/OpenSOReport/SearchInput';
import { ActiveSalesReps } from '../../models/OpenSOReport/ActiveSalesReps';
import { ActiveSalesTeams } from '../../models/OpenSOReport/ActiveSalesTeams';
import Modules from '../../app/api/agent';

interface SearchBoxProps {
  searchParams: OpenSalesOrderSearchInput;
  setSearchParams: React.Dispatch<React.SetStateAction<OpenSalesOrderSearchInput>>;
  getResultSets: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchParams, setSearchParams, getResultSets }) => {
  const [salesReps, setSalesReps] = useState<ActiveSalesReps[]>([]);
  const [salesTeams, setSalesTeams] = useState<ActiveSalesTeams[]>([]);

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const reps = await Modules.SalesReps.fetchActiveSalesReps();
        console.log('Fetched sales reps:', reps); // Log the fetched data
        if (Array.isArray(reps)) {
          setSalesReps(reps);
        } else {
          console.error('Unexpected data format:', reps);
        }
      } catch (error) {
        console.error('Error fetching sales reps', error);
      }
    };

    const fetchSalesTeams = async () => {
      try {
        const teams = await Modules.SalesTeams.fetchActiveSalesTeams();
        console.log('Fetched sales teams:', teams);
        if(Array.isArray(teams)) {
          setSalesTeams(teams);
        } else {
          console.error('Unexpected data format:', teams);
        }
      } catch (error) {
        console.error('Error fetching sales teams', error);
      }
    };

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: name === 'date1' || name === 'date2' ? new Date(value) : value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name!]: value,
    }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: checked,
    }));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      getResultSets();
    }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 2 }, boxShadow: 3, bgcolor: 'background.paper', boxSizing: 'border-box' }}>
      <Grid container spacing={2} onKeyDown={handleKeyDown}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="dateFilterType-label">Date Filter Type</InputLabel>
            <Select
              labelId="dateFilterType-label"
              name="dateFilterType"
              value={searchParams.dateFilterType || 'OrderDate'}
              onChange={handleSelectChange}
            >
              <MenuItem value="OrderDate">Order Date</MenuItem>
              <MenuItem value="ExpectedDelivery">Expected Delivery</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
            <InputLabel id="salesTeam-label">Sales Team</InputLabel>
            <Select
              labelId="salesTeam-label"
              name="salesTeam"
              value={searchParams.salesTeam || 'All'}
              onChange={handleSelectChange}
            >
              {salesTeams.map((team) => (
                <MenuItem key={team.litem} value={team.litem}>
                  {team.litem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="SO Number"
            name="soNum"
            value={searchParams.soNum || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Part Number"
            name="partNum"
            value={searchParams.partNum || ''}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="salesRep-label">Sales Rep</InputLabel>
            <Select
              labelId="salesRep-label"
              name="salesRep"
              value={searchParams.salesRep || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              {salesReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.uname}>
                  {rep.uname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Customer PO"
            name="custPO"
            value={searchParams.custPO || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Airway PO"
            name="poNum"
            value={searchParams.poNum || ''}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="reqDateStatus-label">Req Date Status</InputLabel>
            <Select
              labelId="reqDateStatus-label"
              name="reqDateStatus"
              value={searchParams.reqDateStatus || 'All'}
              onChange={handleSelectChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Customer"
            name="customer"
            value={searchParams.customer || ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" onClick={getResultSets}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
