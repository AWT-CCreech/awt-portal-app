import React, { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import SearchBox, { DailyGoalsSearchParams } from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { DailyGoalsReport } from '../../models/DailyGoalsReport/DailyGoalsReport';

const DailyGoalsReportPage: React.FC = () => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const currentYear = String(new Date().getFullYear());
    const [searchParams, setSearchParams] = useState<DailyGoalsSearchParams>({
        month: currentMonth,
        year: currentYear,
    });
    const [report, setReport] = useState<DailyGoalsReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await Modules.DailyGoals.getReport({
                Months: searchParams.month,
                Years: searchParams.year,
            });
            setReport(data);
            setSnackbarMsg('Search completed successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error fetching Daily Goals Report:', error);
            setReport(null);
            setSnackbarMsg('Failed to fetch Daily Goals Report.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    return (
        <div>
            <PageHeader pageName="Daily Goals Report" pageHref={ROUTE_PATHS.ACCOUNTING.DAILY_GOALS} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 12 }}>
                        <SearchBox
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading}
                            totals={report?.totals}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        {report ? (
                            <SearchResults items={report.items} totals={report.totals} />
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
                <Alert onClose={() => setSnackbarMsg(null)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DailyGoalsReportPage;
