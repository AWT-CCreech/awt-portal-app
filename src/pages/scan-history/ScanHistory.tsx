import React, { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';

// Import your ScanHistory related models
import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { ScanHistory } from '../../models/ScanHistory';

const ScanHistoryPage: React.FC = () => {
    // Initialize search parameters using the default factory function.
    const [searchParams, setSearchParams] = useState<SearchScansDto>(createDefaultSearchScansDto());
    const [results, setResults] = useState<ScanHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searched, setSearched] = useState<boolean>(false);

    // Function to fetch scan history data.
    const fetchScans = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await Modules.ScanHistory.searchScans(searchParams);
            // Assume the API returns an array of ScanHistory records.
            setResults(Array.isArray(data) ? data : []);
            setSuccess("Scan search completed successfully.");
        } catch (err: any) {
            console.error("Error fetching scan history:", err);
            setResults([]);
            setError("Failed to fetch scan history.");
        } finally {
            setLoading(false);
            setSearched(true);
        }
    }, [searchParams]);

    // Callback triggered when the SearchBox form is submitted.
    const handleSearch = useCallback(() => {
        fetchScans();
    }, [fetchScans]);

    return (
        <div>
            <PageHeader pageName="Scan History" pageHref={ROUTE_PATHS.OPERATIONS.SCAN_HISTORY} />
            <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
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
                        {searched && results.length > 0 ? (
                            <SearchResults results={results} containerHeight="60vh" />
                        ) : searched && !loading ? (
                            <Typography variant="h6" align="center" mt={2}>
                                No scan history records found.
                            </Typography>
                        ) : null}
                    </Grid2>
                </Grid2>
            </Container>

            {/* Success Snackbar */}
            <Snackbar
                open={Boolean(success)}
                autoHideDuration={3000}
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={3000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ScanHistoryPage;
