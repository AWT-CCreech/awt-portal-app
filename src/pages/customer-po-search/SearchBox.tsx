import React, { ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingIconButton from '../../shared/components/LoadingIconButton';

export interface CustomerPOSearchParams {
    poNumber: string;
}

interface SearchBoxProps {
    searchParams: CustomerPOSearchParams;
    setSearchParams: React.Dispatch<React.SetStateAction<CustomerPOSearchParams>>;
    onSearch: () => void;
    loading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    searchParams,
    setSearchParams,
    onSearch,
    loading,
}) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchParams({ poNumber: e.target.value });
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
                }}
            >
                <TextField
                    label="Customer PO"
                    value={searchParams.poNumber}
                    onChange={handleInputChange}
                    required
                    sx={{ width: 200 }}
                />
                <LoadingIconButton
                    text="Search"
                    loading={loading}
                    type="submit"
                    color="primary"
                    variant="contained"
                />
            </Box>
        </form>
    );
};

export default SearchBox;
