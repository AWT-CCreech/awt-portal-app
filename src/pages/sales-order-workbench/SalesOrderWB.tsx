import React, { useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import PageHeader from '../../shared/components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { ROUTE_PATHS } from '../../routes';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';

const SalesOrderWB: React.FC = () => {
    const [eventLevelData, setEventLevelData] = useState<EventLevelRowData[]>([]);
    const [detailLevelData, setDetailLevelData] = useState<DetailLevelRowData[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleSearch = async (salesRepId: number | 'all', billToCompany: string, eventId: number | '') => {
        try {
            const params = {
                salesRepId: salesRepId !== 'all' ? salesRepId : undefined,
                billToCompany,
                eventId: eventId !== '' ? Number(eventId) : undefined,
            };

            const eventLevelResponse = await Modules.SalesOrderWorkbench.getEventLevelData(params);
            const detailLevelResponse = await Modules.SalesOrderWorkbench.getDetailLevelData(params);

            setEventLevelData(eventLevelResponse);
            setDetailLevelData(detailLevelResponse);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to fetch data.', severity: 'error' });
        }
    };

    const handleEventLevelBatchUpdate = async (updates: any[]) => {
        try {
            await Promise.all(
                updates.map((update) =>
                    Modules.SalesOrderWorkbench.updateEventLevel({
                        ...update,
                        Username: localStorage.getItem('username') ?? '',
                        Password: localStorage.getItem('password') ?? '',
                    })
                )
            );
            setSnackbar({ open: true, message: 'Event Level changes saved successfully.', severity: 'success' });
            setEventLevelData((prev) =>
                prev.map((row) => {
                    const update = updates.find((u) => u.SaleId === row.saleId);
                    return update ? { ...row, ...update } : row;
                })
            );
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save Event Level changes.', severity: 'error' });
        }
    };

    const handleDetailLevelBatchUpdate = async (updates: any[]) => {
        try {
            await Promise.all(
                updates.map((update) =>
                    Modules.SalesOrderWorkbench.updateDetailLevel({
                        ...update,
                        Username: localStorage.getItem('username') ?? '',
                        Password: localStorage.getItem('password') ?? '',
                    })
                )
            );
            setSnackbar({ open: true, message: 'Detail Level changes saved successfully.', severity: 'success' });
            setDetailLevelData((prev) =>
                prev.map((row) => {
                    const update = updates.find((u) => u.Id === row.id);
                    return update ? { ...row, ...update } : row;
                })
            );
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save Detail Level changes.', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    return (
        <div>
            <PageHeader pageName="Sales Order Workbench" pageHref={ROUTE_PATHS.SALES.SALES_ORDER_WB} />
            <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
                <SearchBox onSearch={handleSearch} />
                <SearchResults
                    eventLevelData={eventLevelData}
                    detailLevelData={detailLevelData}
                    onEventBatchUpdate={handleEventLevelBatchUpdate}
                    onDetailBatchUpdate={handleDetailLevelBatchUpdate}
                />
            </Container>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SalesOrderWB;
