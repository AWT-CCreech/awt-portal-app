// React and Hooks
import React, { useState, useCallback } from 'react';

// API
import Modules from '../../app/api/agent';

// Models
import { EquipReqSearchCriteria } from '../../models/EventSearchPage/EquipReqSearchCriteria';
import EquipReqSearchResult from '../../models/EventSearchPage/EquipReqSearchResult';

// MUI Components
import {
    Box,
    Container,
    Grid,
    Typography,
    Modal,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';

// Components
import PageHeader from '../../components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

// Utilities
import ExcelJS from 'exceljs';

// Styles
import '../../styles/user-list/UserListPage.scss';

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

    const [eventData, seteventData] = useState<EquipReqSearchResult[]>([]);
    const [loading, setLoading] = useState(false); // Loading state for fetching PO data
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchEventData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data =
                await Modules.EventSearchPage.fetchEventPageData(searchParams);
            seteventData(data);
        } catch (error) {
            console.error('Error fetching Event data:', error);
            seteventData([]);
            setError('Failed to fetch Event data.');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    const handleSearch = () => {
        fetchEventData();
    };


    return (
        <div>
            <PageHeader
                pageName="Event Search"
                pageHref={ROUTE_PATHS.SALES.EVENT_SEARCH}
            />
            <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                        <SearchBox
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading} // Only for search loading
                            searchResultLength={eventData?.length}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={4}></Box>
                        ) : eventData.length > 0 ? (
                            <Box
                                sx={{
                                    height: '70vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                    overflow: 'auto',
                                }}
                            >
                                <SearchResults results={eventData} />
                            </Box>
                        ) : (
                            <Typography variant="h6" align="center" mt={2}>
                                No results found.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
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
