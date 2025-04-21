// src/components/ScanHistory/SearchBox.tsx
import React, { ChangeEvent, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import LoadingIconButton from '../../shared/components/LoadingIconButton';

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
    useEffect(() => {
        setSearchParams(createDefaultSearchScansDto());
    }, [setSearchParams]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: name === 'limit'
                ? parseInt(value, 10)
                : (name === 'scanDateRangeStart' || name === 'scanDateRangeEnd')
                    ? new Date(value)
                    : value
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
                <Grid2 container spacing={2} columns={{ xs: 12, sm: 5, md: 5 }}>

                    {/* Row 1: Scan Start, Scan End, Scan User, Order Type, Order No */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Scan Start Date"
                            name="scanDateRangeStart"
                            type="date"
                            value={searchParams.scanDateRangeStart.toISOString().split('T')[0]}
                            onChange={handleInputChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Scan End Date"
                            name="scanDateRangeEnd"
                            type="date"
                            value={searchParams.scanDateRangeEnd.toISOString().split('T')[0]}
                            onChange={handleInputChange}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid2>
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
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="orderType-label">Order Type</InputLabel>
                            <Select
                                labelId="orderType-label"
                                name="orderType"
                                value={searchParams.orderType}
                                onChange={handleSelectChange}
                                label="Order Type"
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {['SO', 'PO', 'RMA', 'RTV/C'].map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Order No"
                            name="orderNum"
                            type="text"
                            value={searchParams.orderNum}
                            onChange={handleInputChange}
                        />
                    </Grid2>

                    {/* Row 2: Part No, Serial Number Field, Serial No, MNS Company, Result Limit */}
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Part No"
                            name="partNo"
                            type="text"
                            value={searchParams.partNo}
                            onChange={handleInputChange}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="snField-label">Serial Number Field</InputLabel>
                            <Select
                                labelId="snField-label"
                                name="snField"
                                value={searchParams.snField}
                                onChange={handleSelectChange}
                                label="Serial Number Field"
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {['HeciCode', 'SerialNo', 'SerialNoB'].map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 1, md: 1 }}>
                        <TextField
                            fullWidth
                            label="Serial No"
                            name="serialNo"
                            type="text"
                            value={searchParams.serialNo}
                            onChange={handleInputChange}
                        />
                    </Grid2>
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

                    {/* Search button (unchanged) */}
                    <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
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
