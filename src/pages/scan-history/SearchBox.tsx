import React, { ChangeEvent, useEffect, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import LoadingIconButton from '../../shared/components/LoadingIconButton';
import SharedDateRangePicker from '../../shared/components/DateRangePicker';

import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { User } from '../../models/User';

interface SearchBoxProps {
    scanUsers: User[];
    searchParams: SearchScansDto;
    setSearchParams: React.Dispatch<React.SetStateAction<SearchScansDto>>;
    onSearch: () => void;
    loading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    scanUsers,
    searchParams,
    setSearchParams,
    onSearch,
    loading
}) => {
    const [dateRange, setDateRange] = useState({
        startDate: searchParams.scanDateRangeStart,
        endDate: searchParams.scanDateRangeEnd,
    });

    const handleDateRangeChange = (newRange: { startDate: Date; endDate: Date }) => {
        setDateRange(newRange);
        setSearchParams(prev => ({
            ...prev,
            scanDateRangeStart: newRange.startDate,
            scanDateRangeEnd: newRange.endDate,
        }));
    };

    useEffect(() => {
        setSearchParams(createDefaultSearchScansDto());
    }, [setSearchParams]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: name === 'limit' ? parseInt(value, 10) : value
        }));
    };

    const handleSelectChange = useCallback(
        (e: SelectChangeEvent<string>) => {
            const { name, value } = e.target;
            setSearchParams(prev => ({ ...prev, [name]: value }));
        },
        [setSearchParams]
    );

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    const validUsers = Array.isArray(scanUsers)
        ? scanUsers.filter(u => u.uname)
        : [];

    return (
        <form onSubmit={handleFormSubmit}>
            <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Grid2 container spacing={2} columns={{ xs: 12, sm: 4, md: 4 }}>

                    {/* 1) Date Range Picker */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <SharedDateRangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            startLabel="Scan Start"
                            endLabel="Scan End"
                        />
                    </Grid2>

                    {/* 2) Scan User */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="scanUser-label">Scan User</InputLabel>
                            <Select
                                labelId="scanUser-label"
                                name="scanUser"
                                value={searchParams.scanUser}
                                onChange={handleSelectChange}
                                label="Scan User"
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {validUsers.map(u => (
                                    <MenuItem key={u.id} value={u.uname!.toLowerCase()}>
                                        {u.uname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>

                    {/* 3) Order Type + No */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="order-no-input">Order</InputLabel>
                            <OutlinedInput
                                id="order-no-input"
                                name="orderNum"
                                value={searchParams.orderNum}
                                onChange={handleInputChange}
                                label="Order"
                                startAdornment={
                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                        <Select
                                            name="orderType"
                                            value={searchParams.orderType}
                                            onChange={handleSelectChange}
                                            displayEmpty
                                            size="small"
                                            sx={{ '& .MuiSelect-select': { py: 1 } }}
                                            renderValue={(v) => v || 'All'}
                                        >
                                            <MenuItem value=""><em>All</em></MenuItem>
                                            {['SO', 'PO', 'RMA', 'RTV/C'].map(opt => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </Select>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid2>

                    {/* 4) Part No */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Part No"
                            name="partNo"
                            value={searchParams.partNo}
                            onChange={handleInputChange}
                        />
                    </Grid2>

                    {/* 5) Serial Identifier */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="serial-no-input">Serial Identifier</InputLabel>
                            <OutlinedInput
                                id="serial-no-input"
                                name="serialNo"
                                value={searchParams.serialNo}
                                onChange={handleInputChange}
                                label="Serial Identifier"
                                startAdornment={
                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                        <Select
                                            name="snField"
                                            value={searchParams.snField}
                                            onChange={handleSelectChange}
                                            displayEmpty
                                            size="small"
                                            sx={{ '& .MuiSelect-select': { py: 1 } }}
                                            renderValue={(v) => v || 'All'}
                                        >
                                            <MenuItem value=""><em>All</em></MenuItem>
                                            {['HeciCode', 'SerialNo', 'SerialNoB'].map(opt => (
                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                            ))}
                                        </Select>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid2>

                    {/* 6) MNS Company */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="mnsCo-label">MNS Company</InputLabel>
                            <Select
                                labelId="mnsCo-label"
                                name="mnsCo"
                                value={searchParams.mnsCo}
                                onChange={handleSelectChange}
                                label="MNS Company"
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {['Supply', 'Services'].map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>

                    {/* 7) Result Limit */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Result Limit"
                            name="limit"
                            type="number"
                            value={searchParams.limit}
                            onChange={handleInputChange}
                        />
                    </Grid2>

                    {/* 8) Search Button (wraps to its own row) */}
                    <Grid2
                        size={{ xs: 12, sm: 4, md: 4 }}
                        sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}
                    >
                        <LoadingIconButton
                            type="submit"
                            text="Search"
                            icon={SearchIcon}
                            loading={loading}
                            size="medium"
                            sx={{ minWidth: 150, height: 40 }}
                        />
                    </Grid2>
                </Grid2>
            </Box>
        </form>
    );
};

export default SearchBox;