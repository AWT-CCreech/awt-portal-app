import React, { ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { DailyGoalTotals } from '../../models/DailyGoalsReport/DailyGoalTotals';
import { formatAmount } from '../../shared/utils/dataManipulation';
import LoadingIconButton from '../../shared/components/LoadingIconButton'; // adjust the path as needed

export interface DailyGoalsSearchParams {
    month: string;
    year: string;
}

interface SearchBoxProps {
    searchParams: DailyGoalsSearchParams;
    setSearchParams: React.Dispatch<React.SetStateAction<DailyGoalsSearchParams>>;
    onSearch: () => void;
    loading: boolean;
    totals?: DailyGoalTotals;
}

const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
];

const SearchBox: React.FC<SearchBoxProps> = ({
    searchParams,
    setSearchParams,
    onSearch,
    loading,
    totals
}) => {
    const handleMonthChange = (e: SelectChangeEvent<string>): void => {
        setSearchParams(prev => ({ ...prev, month: e.target.value }));
    };

    const handleYearChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchParams(prev => ({ ...prev, year: e.target.value }));
    };

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <FormControl sx={{ width: 120 }}>
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <Select
                        labelId="month-select-label"
                        id="month-select"
                        name="month"
                        value={searchParams.month}
                        label="Month"
                        onChange={handleMonthChange}
                    >
                        {months.map((m) => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Year"
                    name="year"
                    type="number"
                    value={searchParams.year}
                    onChange={handleYearChange}
                    sx={{ width: 120 }}
                />
                <LoadingIconButton
                    text="Search"
                    loading={loading}
                    type="submit"
                    color="primary"
                    variant="contained"
                // The onClick here is optional since the form's onSubmit will handle the search.
                //onClick={onSearch}
                />
                {totals && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 'auto' }}>
                        <Chip
                            label={
                                <span>
                                    <strong>Sold:</strong> {formatAmount(totals.totalSold)}
                                </span>
                            }
                            sx={{ backgroundColor: '#34c759', color: '#fff' }}
                        />
                        <Chip
                            label={
                                <span>
                                    <strong>Shipped:</strong> {formatAmount(totals.totalShipped)}
                                </span>
                            }
                            sx={{ backgroundColor: '#007aff', color: '#fff' }}
                        />
                        <Chip
                            label={
                                <span>
                                    <strong>Back Order:</strong> {formatAmount(totals.totalBackOrder)}
                                </span>
                            }
                            sx={{ backgroundColor: '#ff9500', color: '#fff' }}
                        />
                        <Chip
                            label={
                                <span>
                                    <strong>SO Batch:</strong> {formatAmount(totals.soBatchTotal)}
                                </span>
                            }
                            sx={{ backgroundColor: '#cecece', color: '#fff' }}
                        />
                    </Box>

                )}
            </Box>
        </form>
    );
};

export default SearchBox;
