// React and Hooks
import React, { useState, useCallback } from 'react';

// API
import Modules from '../../app/api/agent';

// Models
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import { EquipReqSearchResult } from '../../models/EventSearchPage/EquipReqSearchResult';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';

import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

import '../../shared/styles/user-list/UserListPage.scss';

const EventSearch: React.FC = () => {
    const [searchParams, setSearchParams] = useState<EquipReqSearchCriteria>({
        fromDate: null,
        toDate: null,
        projectName: '',
        company: '',
        contact: '',
        salesRep: 'All',
        status: 'Pending',
    });

    const [eventData, setEventData] = useState<EquipReqSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const fetchEventData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await Modules.EventSearchPage.getEventPageData(searchParams);
            setEventData(Array.isArray(data) ? data : []);
            setSuccess('Search completed successfully.');
        } catch (error) {
            console.error('Error fetching Event data:', error);
            setEventData([]);
            setError('Failed to fetch Event data.');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    const handleSearch = () => {
        setSearched(true);
        fetchEventData();
    };

    return (
        <div>
            <PageHeader
                pageName="Event Search"
                pageHref={ROUTE_PATHS.SALES.EVENT_SEARCH}
            />
            <Container
                maxWidth={false}
                sx={{ padding: { xs: '20px', md: '20px' } }}
            >
                <Grid2 container spacing={2} justifyContent="center">
                    <Grid2 size={12}>
                        <SearchBox
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        {searched && eventData.length > 0 ? (
                            <SearchResults results={eventData} />
                        ) : searched && !loading ? (
                            <Typography variant="h6" align="center" mt={2}>
                                No results found.
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
                <Alert
                    onClose={() => setSuccess(null)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
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
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EventSearch;
