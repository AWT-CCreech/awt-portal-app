import React, { useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { ROUTE_PATHS } from '../../routes';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';
import { SalesOrderUpdateDto } from '../../models/Utility/SalesOrderUpdateDto';
import { EquipmentRequestUpdateDto } from '../../models/Utility/EquipmentRequestUpdateDto';

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
                eventId: eventId !== '' ? Number(eventId) : undefined, // Convert to number or undefined
            };

            const eventLevelResponse = await Modules.SalesOrderWorkbench.getEventLevelData(params);
            const detailLevelResponse = await Modules.SalesOrderWorkbench.getDetailLevelData(params);

            setEventLevelData(eventLevelResponse);
            setDetailLevelData(detailLevelResponse);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to fetch data.', severity: 'error' });
        }
    };


    const handleUpdate = async (updateData: any) => {
        const { type, id, field, value, dropShipment } = updateData;

        // Validate 6-digit Sales Order Number
        if (field === 'RWSalesOrderNum' && (!/^\d{6}$/.test(value))) {
            setSnackbar({ open: true, message: 'Sales Order Number must be exactly 6 digits.', severity: 'error' });
            return;
        }

        const subject = 'Sales Order Updated';
        const htmlBody = '<p>The sales order has been updated successfully.</p>';

        try {
            if (type === 'event') {
                const eventRow = eventLevelData.find((row) => row.saleId === id);
                if (eventRow) {
                    const updateDto: SalesOrderUpdateDto = {
                        SaleId: eventRow.saleId,
                        EventId: eventRow.eventId,
                        QuoteId: eventRow.quoteId,
                        RWSalesOrderNum: value,
                        DropShipment: dropShipment,
                        Username: localStorage.getItem('username') ?? '',
                        Password: localStorage.getItem('password') ?? '',
                        Subject: subject,
                        HtmlBody: htmlBody,
                    };

                    await Modules.SalesOrderWorkbench.updateSalesOrder(updateDto);
                    setEventLevelData((prev) =>
                        prev.map((row) => (row.saleId === id ? { ...row, rwsalesOrderNum: value, dropShipment } : row))
                    );
                    setSnackbar({ open: true, message: 'Sales Order updated successfully.', severity: 'success' });
                }
            } else if (type === 'detail') {
                const detailRow = detailLevelData.find((row) => row.id === id);
                if (detailRow) {
                    const updateDto: EquipmentRequestUpdateDto = {
                        Id: detailRow.id,
                        RWSalesOrderNum: value,
                        DropShipment: dropShipment,
                        Username: localStorage.getItem('username') ?? '',
                        Password: localStorage.getItem('password') ?? '',
                        Subject: subject,
                        HtmlBody: htmlBody,
                    };

                    await Modules.SalesOrderWorkbench.updateEquipmentRequest(updateDto);
                    setDetailLevelData((prev) =>
                        prev.map((row) => (row.id === id ? { ...row, rwsalesOrderNum: value, dropShipment } : row))
                    );
                    setSnackbar({ open: true, message: 'Equipment Request updated successfully.', severity: 'success' });
                }
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update data.', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    return (
        <div>
            <PageHeader pageName="Sales Order Workbench" pageHref={ROUTE_PATHS.SALES.SALES_ORDER_WB} />
            <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
                <SearchBox onSearch={handleSearch} />
                <SearchResults eventLevelData={eventLevelData} detailLevelData={detailLevelData} onUpdate={handleUpdate} />
            </Container>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SalesOrderWB;
