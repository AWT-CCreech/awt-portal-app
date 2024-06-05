import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { isNumber } from 'lodash';

interface IProps {
  searchValue: string;
  searchFor: number;
  viewBy: string;
  chkID: boolean;
  chkSONo: boolean;
  chkPartNo: boolean;
  chkPartDesc: boolean;
  chkPONo: boolean;
  chkMfg: boolean;
  chkCompany: boolean;
  chkInvNo: boolean;
  chkActive: boolean;
  setSearchValue: (value: string) => void;
  setSearchFor: (search: number) => void;
  setViewBy: (view: string) => void;
  setChkID: (value: boolean) => void;
  setChkSONo: (value: boolean) => void;
  setChkPartNo: (value: boolean) => void;
  setChkPartDesc: (value: boolean) => void;
  setChkPONo: (value: boolean) => void;
  setChkMfg: (value: boolean) => void;
  setChkCompany: (value: boolean) => void;
  setChkInvNo: (value: boolean) => void;
  setChkActive: (value: boolean) => void;
  getResultSets: () => void;
}

const SearchBox: React.FC<IProps> = ({
  searchValue,
  setSearchValue,
  searchFor,
  viewBy,
  chkID,
  chkSONo,
  chkPartNo,
  chkPartDesc,
  chkPONo,
  chkMfg,
  chkCompany,
  chkInvNo,
  chkActive,
  setSearchFor,
  setViewBy,
  setChkID,
  setChkSONo,
  setChkPartNo,
  setChkPartDesc,
  setChkPONo,
  setChkMfg,
  setChkCompany,
  setChkInvNo,
  setChkActive,
  getResultSets,
}) => {
  useEffect(() => {
    document.getElementById('searchInput1')?.focus();
    document.getElementById('searchInput2')?.focus();
  }, [searchFor, viewBy, chkID, chkSONo, chkPartNo, chkPartDesc, chkPONo, chkMfg, chkCompany, chkInvNo, chkActive]);

  useEffect(() => {
    if (searchFor === 2) {
      setChkSONo(false);
      setChkPONo(false);
      setChkMfg(false);
      setChkInvNo(false);
    }
  }, [searchFor, setChkInvNo, setChkMfg, setChkPONo, setChkSONo]);

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 2 }, boxShadow: 3, bgcolor: 'background.paper', boxSizing: 'border-box' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <FormLabel>Search For:</FormLabel>
            <Select
              value={searchFor.toString()}
              onChange={(e: SelectChangeEvent<string>) => {
                const value = parseInt(e.target.value);
                if (isNumber(value)) setSearchFor(value);
              }}
            >
              <MenuItem value="1">Sell Opps</MenuItem>
              <MenuItem value="2">Buy Opps</MenuItem>
              <MenuItem value="3">Buy/Sell Opps</MenuItem>
              <MenuItem value="4">Contact</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {(() => {
          if ([1, 2, 3].includes(searchFor))
            return (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>With:</FormLabel>
                    <Input
                      id="searchInput1"
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      autoFocus
                      autoComplete="off"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel>Type:</FormLabel>
                    <RadioGroup
                      row
                      value={viewBy}
                      onChange={(e) => setViewBy(e.target.value)}
                    >
                      <FormControlLabel
                        value="event"
                        control={<Radio />}
                        label="Event"
                      />
                      <FormControlLabel
                        value="detail"
                        control={<Radio />}
                        label="Detail"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel>In:</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={chkID}
                            onChange={() => setChkID(!chkID)}
                          />
                        }
                        label="ID"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={chkPartNo}
                            onChange={() => setChkPartNo(!chkPartNo)}
                          />
                        }
                        label="Part No"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={chkPartDesc}
                            onChange={() => setChkPartDesc(!chkPartDesc)}
                          />
                        }
                        label="Part Desc"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={chkCompany}
                            onChange={() => setChkCompany(!chkCompany)}
                          />
                        }
                        label="Company"
                      />
                      {(() => {
                        if (searchFor !== 2)
                          return [
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={chkSONo}
                                  onChange={() => setChkSONo(!chkSONo)}
                                />
                              }
                              label="SO No"
                              key="SO No"
                            />,
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={chkPONo}
                                  onChange={() => setChkPONo(!chkPONo)}
                                />
                              }
                              label="PO No"
                              key="PO No"
                            />,
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={chkMfg}
                                  onChange={() => setChkMfg(!chkMfg)}
                                />
                              }
                              label="Mfg"
                              key="Mfg"
                            />,
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={chkInvNo}
                                  onChange={() => setChkInvNo(!chkInvNo)}
                                />
                              }
                              label="Inv No"
                              key="Inv No"
                            />,
                          ];
                      })()}
                    </FormGroup>
                  </FormControl>
                </Grid>
              </>
            );
          else if (searchFor === 4)
            return (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Name:</FormLabel>
                    <Input
                      id="searchInput2"
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      autoFocus
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={chkActive}
                        onChange={() => setChkActive(!chkActive)}
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </>
            );
        })()}
        <Grid item xs={12}>
          <Button variant="contained" color="success" onClick={getResultSets}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBox;
