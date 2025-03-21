import React, { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import { isNumber } from 'lodash';
import LoadingIconButton from '../../shared/components/LoadingIconButton';

import Grid2 from '@mui/material/Grid2';

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
  getResultSets: () => Promise<void>;
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
  const searchInput1Ref = useRef<HTMLInputElement>(null);
  const searchInput2Ref = useRef<HTMLInputElement>(null);

  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const searchInput =
      searchFor === 4 ? searchInput2Ref.current : searchInput1Ref.current;
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 0);
    }
  }, [
    searchFor,
    searchValue,
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
  ]);

  useEffect(() => {
    if (searchFor === 2) {
      setChkSONo(false);
      setChkPONo(false);
      setChkMfg(false);
      setChkInvNo(false);
    }
  }, [searchFor, setChkInvNo, setChkMfg, setChkPONo, setChkSONo]);

  const handleGetResultSets = async () => {
    setLoadingState(true);
    try {
      await getResultSets();
    } catch (error) {
      console.error('Error fetching result sets:', error);
      alert('An error occurred while fetching results. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

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
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, md: 4 }}>
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
        </Grid2>
        {(() => {
          if ([1, 2, 3].includes(searchFor))
            return (
              <>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <FormLabel>With:</FormLabel>
                    <Input
                      id="searchInput1"
                      inputRef={searchInput1Ref}
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      autoComplete="off"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGetResultSets();
                        }
                      }}
                    />
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
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
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
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
                      {searchFor !== 2 && (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={chkSONo}
                                onChange={() => setChkSONo(!chkSONo)}
                              />
                            }
                            label="SO No"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={chkPONo}
                                onChange={() => setChkPONo(!chkPONo)}
                              />
                            }
                            label="PO No"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={chkMfg}
                                onChange={() => setChkMfg(!chkMfg)}
                              />
                            }
                            label="Mfg"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={chkInvNo}
                                onChange={() => setChkInvNo(!chkInvNo)}
                              />
                            }
                            label="Inv No"
                          />
                        </>
                      )}
                    </FormGroup>
                  </FormControl>
                </Grid2>
              </>
            );
          else if (searchFor === 4)
            return (
              <>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <FormLabel>Name:</FormLabel>
                    <Input
                      id="searchInput2"
                      inputRef={searchInput2Ref}
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      autoComplete="off"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGetResultSets();
                        }
                      }}
                    />
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={chkActive}
                        onChange={() => setChkActive(!chkActive)}
                      />
                    }
                    label="Active"
                  />
                </Grid2>
              </>
            );
        })()}
        <Grid2 size={{ xs: 12 }}>
          <LoadingIconButton
            text="Submit"
            icon={SearchIcon} // Optionally, use a different icon
            loading={loadingState}
            onClick={handleGetResultSets}
            sx={{
              minWidth: '150px',
              height: '42px',
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SearchBox;
