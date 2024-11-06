// React and Hooks
import React, { ChangeEvent, useEffect, useCallback } from 'react';

// API
import Modules from '../../app/api/agent';

// Models
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import { Rep } from '../../models/Data/Rep';

// MUI Components
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { Search } from '@mui/icons-material';

// Define the allowed names for select fields
type SelectFieldName = 'status' | 'salesRep';

// Define the allowed names for text fields
type TextFieldName = 'fromDate' | 'toDate' | 'company' | 'contact' | 'projectName';

// Define configuration interfaces
interface TextFieldConfig {
    label: string;
    name: TextFieldName;
    type: 'date' | 'text';
}

interface SelectFieldConfig {
    label: string;
    name: SelectFieldName;
    options: string[];
}

// Configuration for Text Fields
const textFieldsConfig: TextFieldConfig[] = [
    { label: 'From Date', name: 'fromDate', type: 'date' },
    { label: 'To Date', name: 'toDate', type: 'date' },
    { label: 'Company', name: 'company', type: 'text' },
    { label: 'Contact', name: 'contact', type: 'text' },
    { label: 'Project Name', name: 'projectName', type: 'text' },
];

// Configuration for Select Fields
const selectFieldsConfig: SelectFieldConfig[] = [
    {
        label: 'Status',
        name: 'status',
        options: ['All', 'Canceled', 'Sold', 'Lost', 'Pending'],
    },
    {
        label: 'Sales Rep',
        name: 'salesRep',
        options: [], // Removed 'All' from options to prevent duplication
    },
];

interface SearchBoxProps {
    searchParams: EquipReqSearchCriteria;
    setSearchParams: React.Dispatch<React.SetStateAction<EquipReqSearchCriteria>>;
    onSearch: () => void;
    loading: boolean;
}

// Custom Hook for Fetching Sales Reps
const useSalesReps = (): Rep[] => {
    const [salesReps, setSalesReps] = React.useState<Rep[]>([]);

    useEffect(() => {
        const fetchReps = async () => {
            try {
                const reps = await Modules.DataFetch.fetchActiveSalesReps();
                setSalesReps(reps);
            } catch (error) {
                console.error('Error fetching sales reps:', error);
            }
        };
        fetchReps();
    }, []);

    return salesReps;
};

const SearchBox: React.FC<SearchBoxProps> = ({
    searchParams,
    setSearchParams,
    onSearch,
    loading,
}) => {
    const salesReps = useSalesReps();

    // Set default dates on mount
    useEffect(() => {
        const today = new Date();
        const pastMonth = new Date();
        pastMonth.setMonth(today.getMonth() - 1);

        setSearchParams((prev) => ({
            ...prev,
            fromDate: pastMonth,
            toDate: today,
        }));
    }, [setSearchParams]);

    // Handle input changes for text fields
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]:
                name === 'fromDate' || name === 'toDate' ? new Date(value) : value,
        }));
    };

    // Handle select changes with explicit type annotations
    const handleSelectChange = useCallback(
        (e: SelectChangeEvent<string>, child: React.ReactNode): void => {
            const { name, value } = e.target;
            setSearchParams((prev) => ({
                ...prev,
                [name as string]: value,
            }));
        },
        [setSearchParams]
    );

    // Handle form submission
    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                }}
            >
                <Grid container spacing={2}>
                    {/* Render Text Fields */}
                    {textFieldsConfig.map((field) => (
                        <Grid item xs={12} sm={6} md={3} key={field.name}>
                            <TextField
                                fullWidth
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={
                                    field.type === 'date' && searchParams[field.name] instanceof Date
                                        ? (searchParams[field.name] as Date).toISOString().split('T')[0]
                                        : (searchParams[field.name] as string) || ''
                                }
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: field.type === 'date' ? true : undefined,
                                }}
                            />
                        </Grid>
                    ))}

                    {/* Render Select Fields */}
                    {selectFieldsConfig.map((field) => (
                        <Grid item xs={12} sm={6} md={3} key={field.name}>
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select<string>
                                    name={field.name}
                                    value={(searchParams[field.name] as string) || 'All'}
                                    onChange={handleSelectChange}
                                    label={field.label}
                                >
                                    {field.name === 'salesRep' && (
                                        <MenuItem value="All">All</MenuItem>
                                    )}
                                    {field.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                    {field.name === 'salesRep' &&
                                        salesReps.map((rep) => (
                                            <MenuItem key={rep.id} value={rep.uname}>
                                                {rep.uname}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    ))}

                    {/* Search Button */}
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
                            sx={{
                                mr: 2,
                                position: 'relative',
                                minWidth: '150px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '40px', // Reserve space for icon/spinner
                                paddingRight: '12px',
                            }}
                            aria-label="Search Events"
                        >
                            {/* Absolute Positioned Icon/Spinner */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '24px',
                                    height: '24px',
                                }}
                            >
                                {!loading && <Search />}
                                {loading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: 'white',
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Search Text */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Search
                            </Box>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
};

export default SearchBox;
