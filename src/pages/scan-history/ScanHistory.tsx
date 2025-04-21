import React, { useState, useCallback, useEffect } from 'react';
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

// models
import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { ScanHistory } from '../../models/ScanHistory';
import { User } from '../../models/User';

const ScanHistoryPage: React.FC = () => {
    const [scanUsers, setScanUsers] = useState<User[]>([]);
    const [searchParams, setSearchParams] = useState<SearchScansDto>(createDefaultSearchScansDto());
    const [results, setResults] = useState<ScanHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    // 1) fetch warehouse users once
    useEffect(() => {
        Modules.Users.getWarehouseUsers()
            .then(users => {
                console.log('warehouse users →', users);
                setScanUsers(users);
            })
            .catch(err => console.error('Failed to load scan users', err));
    }, []);

    const fetchScans = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await Modules.ScanHistory.searchScans(searchParams);
            setResults(Array.isArray(data) ? data : []);
            setSuccess('Scan search completed successfully.');
        } catch (err: any) {
            console.error('Error fetching scan history:', err);
            setResults([]);
            setError('Failed to fetch scan history.');
        } finally {
            setLoading(false);
            setSearched(true);
        }
    }, [searchParams]);

    const handleSearch = useCallback(() => {
        fetchScans();
    }, [fetchScans]);

    return (
        <div>
            <PageHeader
                pageName="Scan History"
                pageHref={ROUTE_PATHS.OPERATIONS.SCAN_HISTORY}
            />

            <Container maxWidth={false} sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <SearchBox
                            scanUsers={scanUsers}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
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
