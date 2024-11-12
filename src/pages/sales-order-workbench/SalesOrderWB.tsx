// src/pages/sales-order-workbench/SalesOrderWB.tsx

import React, { useState, useContext } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { ROUTE_PATHS } from '../../routes';
import { SalesOrderUpdateDto } from '../../models/SOWorkbench/SalesOrderUpdateDto';
import { EquipmentRequestUpdateDto } from '../../models/SOWorkbench/EquipmentRequestUpdateDto';
import UserInfoContext from '../../stores/userInfo';

const SalesOrderWB: React.FC = () => {
    const [eventLevelData, setEventLevelData] = useState<any[]>([]);
    const [detailLevelData, setDetailLevelData] = useState<any[]>([]);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const userInfo = useContext(UserInfoContext); // Access user information

    const handleSearch = async (
        salesRepId: number | 'all',
        billToCompany: string,
        eventId: number | ''
    ): Promise<void> => {
        try {
            const params = {
                salesRepId: salesRepId !== 'all' ? salesRepId : undefined,
                billToCompany,
                eventId: eventId !== '' ? eventId : undefined,
            };
            const eventLevelResponse = await Modules.SalesOrderWorkbench.getEventLevelData(
                params
            );
            const detailLevelResponse = await Modules.SalesOrderWorkbench.getDetailLevelData(
                params
            );
            setEventLevelData(eventLevelResponse);
            setDetailLevelData(detailLevelResponse);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch data.',
                severity: 'error',
            });
        }
    };

    const handleUpdate = async (updateData: any) => {
        try {
            const { id, field, value } = updateData;

            // Prepare email details
            const subject = 'Sales Order Updated';
            const htmlBody = 'The sales order has been updated successfully.';

            // Check if the update is for EventLevel
            const eventRow = eventLevelData.find(
                (row) => row.salesOrder.saleId === id
            );
            if (eventRow) {
                // Construct SalesOrderUpdateDto
                const updateDto: SalesOrderUpdateDto = {
                    SaleId: eventRow.salesOrder.saleId,
                    RWSalesOrderNum:
                        field === 'RWSalesOrderNum'
                            ? value
                            : eventRow.salesOrder.RWSalesOrderNum,
                    DropShipment:
                        field === 'DropShipment'
                            ? value
                            : eventRow.salesOrder.DropShipment,
                    EventId: eventRow.salesOrder.EventId,
                    QuoteId: eventRow.salesOrder.QuoteId,
                    Username: userInfo?.username || '',
                    Password: userInfo?.password || '',
                    Subject: subject,
                    HtmlBody: htmlBody,
                };

                // Call API to update sales order
                await Modules.SalesOrderWorkbench.updateSalesOrder(updateDto);

                // Update local state
                setEventLevelData((prevData) =>
                    prevData.map((row) =>
                        row.salesOrder.saleId === id
                            ? {
                                ...row,
                                salesOrder: {
                                    ...row.salesOrder,
                                    [field]: value,
                                },
                            }
                            : row
                    )
                );

                setSnackbar({
                    open: true,
                    message: 'Sales Order updated successfully.',
                    severity: 'success',
                });
                return; // Exit after handling EventLevel update
            }

            // Check if the update is for DetailLevel
            const detailRow = detailLevelData.find(
                (row) => row.salesOrderDetail.id === id
            );
            if (detailRow) {
                // Construct EquipmentRequestUpdateDto
                const updateDto: EquipmentRequestUpdateDto = {
                    Id: detailRow.salesOrderDetail.id,
                    RWSalesOrderNum:
                        field === 'RWSalesOrderNum'
                            ? value
                            : detailRow.salesOrder.RWSalesOrderNum,
                    Username: userInfo?.username || '',
                    Password: userInfo?.password || '',
                    Subject: subject,
                    HtmlBody: htmlBody,
                };

                // Call API to update equipment request
                await Modules.SalesOrderWorkbench.updateEquipmentRequest(updateDto);

                // Update local state
                setDetailLevelData((prevData) =>
                    prevData.map((row) =>
                        row.salesOrderDetail.id === id
                            ? {
                                ...row,
                                salesOrder: {
                                    ...row.salesOrder,
                                    [field]: value,
                                },
                            }
                            : row
                    )
                );

                setSnackbar({
                    open: true,
                    message: 'Equipment Request updated successfully.',
                    severity: 'success',
                });
                return; // Exit after handling DetailLevel update
            }

            console.warn('Update data not found in either EventLevel or DetailLevel');
            setSnackbar({
                open: true,
                message: 'Update failed: Data not found.',
                severity: 'error',
            });
        } catch (error) {
            console.error('Failed to update data', error);
            setSnackbar({
                open: true,
                message: 'Failed to update data.',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <div>
            <PageHeader
                pageName="Sales Order Workbench"
                pageHref={ROUTE_PATHS.SALES.SALES_ORDER_WB} // Using the correct route path
            />
            <Container
                maxWidth={false}
                sx={{ padding: { xs: '20px', md: '20px' } }}
            >
                <Typography variant="h4" gutterBottom>
                    Sales Order Workbench
                </Typography>
                <SearchBox onSearch={handleSearch} />
                <SearchResults
                    eventLevelData={eventLevelData}
                    detailLevelData={detailLevelData}
                    onUpdate={handleUpdate}
                />
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SalesOrderWB;
