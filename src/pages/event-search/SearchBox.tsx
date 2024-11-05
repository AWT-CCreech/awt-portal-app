// React and Hooks
import React, { ChangeEvent, useEffect, useState } from 'react';

// MUI Components and Icons
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    Autocomplete,
} from '@mui/material';
import { GetApp, Search } from '@mui/icons-material';

// Utilities
import { debounce } from 'lodash';

// Models
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import { Rep } from '../../models/Data/Rep';

// API
import Modules from '../../app/api/agent';

interface SearchBoxProps {
    searchParams: EquipReqSearchCriteria;
    setSearchParams: React.Dispatch<React.SetStateAction<EquipReqSearchCriteria>>;
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
    const [salesReps, setSalesReps] = useState<Rep[]>([]);

    // Fetch sales reps and purchasing reps on component mount
    useEffect(() => {
        const fetchReps = async () => {
            try {
                const [salesRepsData] = await Promise.all([
                    Modules.DataFetch.fetchActiveSalesReps(),
                ]);
                setSalesReps(salesRepsData);
            } catch (error) {
                console.error('Error fetching reps', error);
            }
        };

        fetchReps();
    }, []);

    // Fetch vendors whenever relevant search parameters change
    useEffect(() => {
        // Prepare parameters for fetching vendors
        const params: EquipReqSearchCriteria = {

            company: searchParams.company,
            contact: searchParams.contact,
            projectName: searchParams.projectName,
            salesRep: searchParams.salesRep,
            status: searchParams.status,
            fromDate: searchParams.fromDate,
            toDate: searchParams.toDate,

        };


    }, [
        searchParams.company,
        searchParams.contact,
        searchParams.projectName,
        searchParams.salesRep,
        searchParams.status,
        searchParams.fromDate,
        searchParams.toDate,

    ]);

    // Handle input changes for text fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setSearchParams((prevParams: EquipReqSearchCriteria) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    // Handle changes for select fields
    const handleSelectChange = (e: SelectChangeEvent<string>): void => {
        const { name, value } = e.target;
        setSearchParams((prevParams: EquipReqSearchCriteria) => ({
            ...prevParams,
            [name as string]: value as string,
        }));
    };

    // Handle form submission
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Grid container spacing={2}>
                    {/* company */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Company"
                            name="company"
                            value={searchParams.company}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>

                    {/* contact */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Contact"
                            name="contact"
                            value={searchParams.contact}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>

                    {/* proj name */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            name="projectName"
                            value={searchParams.projectName}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={searchParams.status}
                                onChange={handleSelectChange}
                                label="Status"
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Sold">Sold</MenuItem>
                                <MenuItem value="Lost">Lost</MenuItem>
                                <MenuItem value="Canceled">Canceled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>


                    {/* Sales Rep */}
                    <Grid item xs={12} sm={6} md={3}>
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
                    </Grid>



                    {/* Search and Export Buttons */}
                    <Grid
                        item
                        xs={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            startIcon={!loading && <Search />}
                            sx={{ mr: 2 }} // Add some margin between buttons
                        >
                            {loading ? <CircularProgress size={24} /> : 'Search'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleExport}
                            disabled={loadingExport || searchResultLength === 0}
                            startIcon={
                                loadingExport ? <CircularProgress size={20} /> : <GetApp />
                            }
                        >
                            Export to Excel
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
};

export default SearchBox;