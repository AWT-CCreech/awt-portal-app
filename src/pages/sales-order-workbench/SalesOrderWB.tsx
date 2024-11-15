import React, { useState, useContext } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Modules from '../../app/api/agent';
import { ROUTE_PATHS } from '../../routes';
import UserInfoContext from '../../stores/userInfo';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';
import { SalesOrderUpdateDto } from '../../models/SOWorkbench/SalesOrderUpdateDto';
import { EquipmentRequestUpdateDto } from '../../models/SOWorkbench/EquipmentRequestUpdateDto';

const SalesOrderWB: React.FC = () => {
    const [eventLevelData, setEventLevelData] = useState<EventLevelRowData[]>([]);
    const [detailLevelData, setDetailLevelData] = useState<DetailLevelRowData[]>([]);
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
            const eventLevelResponse: EventLevelRowData[] = await Modules.SalesOrderWorkbench.getEventLevelData(
                params
            );
            const detailLevelResponse: DetailLevelRowData[] = await Modules.SalesOrderWorkbench.getDetailLevelData(
                params
            );
            console.log('Event Level Response:', eventLevelResponse);
            console.log('Detail Level Response:', detailLevelResponse);
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
            const { type, id, field, value, dropShipment } = updateData;

            // Prepare email details
            const subject = 'Sales Order Updated';
            const htmlBody = 'The sales order has been updated successfully.';

            if (type === 'event') {
                // Find the event row by saleId
                const eventRow = eventLevelData.find(
                    (row) => row.saleId === id
                );
                if (eventRow) {
                    // Construct SalesOrderUpdateDto
                    const updateDto: SalesOrderUpdateDto = {
                        SaleId: eventRow.saleId,
                        EventId: eventRow.eventId,
                        QuoteId: eventRow.quoteId,
                        RWSalesOrderNum:
                            field === 'RWSalesOrderNum'
                                ? value
                                : eventRow.rwsalesOrderNum || '',
                        DropShipment:
                            field === 'DropShipment'
                                ? dropShipment
                                : eventRow.dropShipment || false,
                        Username: userInfo?.username || '',
                        Password: userInfo?.password || '',
                        Subject: subject,         // Add this line
                        HtmlBody: htmlBody,       // Add this line
                    };

                    // Call API to update sales order
                    await Modules.SalesOrderWorkbench.updateSalesOrder(updateDto);

                    // Update local state
                    setEventLevelData((prevData) =>
                        prevData.map((row) =>
                            row.saleId === id
                                ? {
                                    ...row,
                                    rwsalesOrderNum:
                                        field === 'RWSalesOrderNum' ? value : row.rwsalesOrderNum,
                                    dropShipment:
                                        field === 'DropShipment' ? dropShipment : row.dropShipment,
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
            } else if (type === 'detail') {
                // Find the detail row by id
                const detailRow = detailLevelData.find(
                    (row) => row.id === id
                );
                if (detailRow) {
                    // Construct EquipmentRequestUpdateDto
                    const updateDto: EquipmentRequestUpdateDto = {
                        Id: detailRow.id,
                        RWSalesOrderNum:
                            field === 'RWSalesOrderNum'
                                ? value
                                : detailRow.rwsalesOrderNum || '',
                        DropShipment:
                            field === 'DropShipment'
                                ? dropShipment
                                : detailRow.dropShipment || false,
                        Username: userInfo?.username || '',
                        Password: userInfo?.password || '',
                        Subject: subject,         // Add this line
                        HtmlBody: htmlBody,       // Add this line
                    };

                    // Call API to update equipment request
                    await Modules.SalesOrderWorkbench.updateEquipmentRequest(updateDto);

                    // Update local state
                    setDetailLevelData((prevData) =>
                        prevData.map((row) =>
                            row.id === id
                                ? {
                                    ...row,
                                    rwsalesOrderNum:
                                        field === 'RWSalesOrderNum' ? value : row.rwsalesOrderNum,
                                    dropShipment:
                                        field === 'DropShipment' ? dropShipment : row.dropShipment,
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
                pageHref={ROUTE_PATHS.SALES.SALES_ORDER_WB}
            />
            <Container
                maxWidth={false}
                sx={{ padding: { xs: '20px', md: '20px' } }}
            >
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