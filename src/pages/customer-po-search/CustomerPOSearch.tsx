import React, { useState, useCallback } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox, { CustomerPOSearchParams } from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { CustomerPOSearchResult } from '../../models/CustomerPOSearch/CustomerPOSearchResult';

const CustomerPOSearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useState<CustomerPOSearchParams>({
        poNumber: '',
    });
    const [results, setResults] = useState<CustomerPOSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await Modules.CustomerPOSearch.searchByPONum(searchParams.poNumber);
            setResults(data);
            setSnackbarMsg('Search completed successfully.');
            setSnackbarSeverity('success');
        } catch (error: any) {
            console.error('Error fetching Customer PO:', error);
            setResults([]);
            setSnackbarMsg(error.response?.data || 'Failed to fetch Customer PO.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    return (
        <div>
            <PageHeader pageName="Customer PO Search" pageHref={ROUTE_PATHS.SALES.CUSTOMER_PO_SEARCH} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12 }}>
                        <SearchBox
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        {results.length > 0 ? (
                            <SearchResults items={results} />
                        ) : (
                            !loading && (
                                <Typography variant="h6" align="center">
                                    No data available. Please perform a search.
                                </Typography>
                            )
                        )}
                    </Grid2>
                </Grid2>
            </Container>
            <Snackbar
                open={Boolean(snackbarMsg)}
                autoHideDuration={3000}
                onClose={() => setSnackbarMsg(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CustomerPOSearchPage;
