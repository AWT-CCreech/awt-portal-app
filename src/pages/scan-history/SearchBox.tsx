import React, { ChangeEvent, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import { SelectChangeEvent } from '@mui/material/Select';

// Import the SearchScansDto and its factory function.
import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';

interface SearchBoxProps {
    searchParams: SearchScansDto;
    setSearchParams: React.Dispatch<React.SetStateAction<SearchScansDto>>;
    onSearch: () => void;
    loading: boolean;
}

// Optional configuration interfaces for fields
interface TextFieldConfig {
    label: string;
    name: keyof SearchScansDto;
    type: 'date' | 'text' | 'number';
}

interface SelectFieldConfig {
    label: string;
    name: keyof SearchScansDto;
    options: string[];
}

const textFieldsConfig: TextFieldConfig[] = [
    { label: 'Scan Start Date', name: 'scanDateRangeStart', type: 'date' },
    { label: 'Scan End Date', name: 'scanDateRangeEnd', type: 'date' },
    { label: 'SO No', name: 'soNo', type: 'text' },
    { label: 'PO No', name: 'poNo', type: 'text' },
    { label: 'RMA No', name: 'rmano', type: 'text' },
    { label: 'Part No', name: 'partNo', type: 'text' },
    { label: 'Serial No', name: 'serialNo', type: 'text' },
    { label: 'Scan User', name: 'scanUser', type: 'text' },
    { label: 'Order Type', name: 'orderType', type: 'text' },
    { label: 'MNS Company', name: 'mnsCo', type: 'text' },
    { label: 'Result Limit', name: 'limit', type: 'number' },
];

const selectFieldsConfig: SelectFieldConfig[] = [
    {
        label: 'Serial Number Field',
        name: 'snField',
        options: ['SerialNo', 'SerialNoB'],
    },
];

const SearchBox: React.FC<SearchBoxProps> = ({
    searchParams,
    setSearchParams,
    onSearch,
    loading,
}) => {
    // On initial mount, initialize searchParams with defaults.
    useEffect(() => {
        setSearchParams(createDefaultSearchScansDto());
    }, [setSearchParams]);

    // Handle changes to text and number fields.
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]:
                name === 'scanDateRangeStart' || name === 'scanDateRangeEnd'
                    ? new Date(value)
                    : name === 'limit'
                        ? parseInt(value, 10)
                        : value,
        }));
    };

    // Handle changes for select fields using the MUI-provided SelectChangeEvent.
    const handleSelectChange = useCallback(
        (event: SelectChangeEvent<string>, child: React.ReactNode) => {
            const { name, value } = event.target;
            if (name) {
                setSearchParams((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        },
        [setSearchParams]
    );

    // Form submission handler.
    const handleFormSubmit = (e: React.FormEvent) => {
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
                <Grid2 container spacing={2}>
                    {textFieldsConfig.map((field) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={field.name}>
                            <TextField
                                fullWidth
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={
                                    field.type === 'date' && searchParams[field.name] instanceof Date
                                        ? (searchParams[field.name] as Date).toISOString().split('T')[0]
                                        : (searchParams[field.name] as string | number) || ''
                                }
                                onChange={handleInputChange}
                                slotProps={{
                                    inputLabel: {
                                        shrink: field.type === 'date' ? true : undefined,
                                    },
                                }}
                            />
                        </Grid2>
                    ))}

                    {selectFieldsConfig.map((field) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={field.name}>
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    name={field.name}
                                    value={(searchParams[field.name] as string) || field.options[0]}
                                    label={field.label}
                                    onChange={handleSelectChange}
                                >
                                    {field.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                    ))}

                    {/* Search Button */}
                    <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SearchIcon />}
                            disabled={loading}
                            sx={{ minWidth: '150px', height: '40px' }}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </form>
    );
};

export default SearchBox;
