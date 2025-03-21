import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import LoadingIconButton from '../../shared/components/LoadingIconButton';
import Modules from '../../app/api/agent';

interface Rep {
    id: number;
    uname: string;
}

interface SearchBoxProps {
    onSearch: (
        salesRepId: number | 'all',
        billToCompany: string,
        eventId: number | ''
    ) => Promise<void>;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
    const [salesRepId, setSalesRepId] = useState<number | 'all'>('all');
    const [billToCompany, setBillToCompany] = useState<string>('');
    const [eventId, setEventId] = useState<number | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [salesReps, setSalesReps] = useState<Rep[]>([]); // State for fetched sales reps

    // Fetch sales reps on component mount
    useEffect(() => {
        const fetchSalesReps = async () => {
            try {
                const reps = await Modules.DataFetch.fetchActiveSalesReps();
                setSalesReps(reps);
            } catch (error) {
                console.error('Error fetching sales reps:', error);
            }
        };

        fetchSalesReps();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            await onSearch(salesRepId, billToCompany, eventId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" gap={2} mb={3} alignItems="center">
            <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                <InputLabel>Sales Rep</InputLabel>
                <Select
                    value={salesRepId}
                    onChange={(e) => setSalesRepId(e.target.value as number | 'all')}
                    label="Sales Rep"
                >
                    <MenuItem value="all">All</MenuItem>
                    {salesReps.map((rep) => (
                        <MenuItem key={rep.id} value={rep.id}>
                            {rep.uname}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Bill To"
                value={billToCompany}
                onChange={(e) => setBillToCompany(e.target.value)}
                variant="outlined"
                sx={{ minWidth: 200 }}
            />
            <TextField
                label="Event ID"
                value={eventId}
                onChange={(e) => setEventId(Number(e.target.value) || '')}
                type="number"
                variant="outlined"
                sx={{ minWidth: 150 }}
            />
            <LoadingIconButton
                text="Search"
                icon={SearchIcon}
                loading={loading}
                onClick={handleSearch}
                sx={{
                    height: 56,
                    minWidth: 120,
                    display: 'flex',
                    alignItems: 'center',
                }}
            />
        </Box>
    );
};

export default SearchBox;