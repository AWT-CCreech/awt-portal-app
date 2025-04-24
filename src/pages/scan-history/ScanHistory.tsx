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
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ExcelJS from 'exceljs';

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
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Export state
    const [loadingExport, setLoadingExport] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    useEffect(() => {
        Modules.Users.getWarehouseUsers()
            .then(users => setScanUsers(users))
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
            setSelectedIds([]);
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

    const toggleSelect = (id: number) => {
        setSelectedIds(ids =>
            ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
        );
    };

    const handleDeleteClick = () => {
        if (selectedIds.length) setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            await Modules.ScanHistory.deleteScans(selectedIds);
            setSuccess(`Deleted ${selectedIds.length} scan${selectedIds.length > 1 ? 's' : ''}.`);
            await fetchScans();
        } catch {
            setError('Failed to delete scans.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = useCallback(async () => {
        setLoadingExport(true);
        setExportError(null);
        setExportSuccess(null);

        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('ScanHistory');

            sheet.columns = [
                { header: 'Order Type', key: 'orderType', width: 15 },
                { header: 'Order No', key: 'orderNo', width: 15 },
                { header: 'User', key: 'userName', width: 20 },
                { header: 'Date', key: 'scanDate', width: 15 },
                { header: 'Part No', key: 'partNo', width: 20 },
                { header: 'Serial No', key: 'serialNo', width: 20 },
                { header: 'Serial No B', key: 'serialNoB', width: 20 },
                { header: 'Heci Code', key: 'heciCode', width: 20 },
            ];

            results
                .filter(r => selectedIds.includes(r.rowId))
                .forEach(r => {
                    sheet.addRow({
                        orderType: r.orderType,
                        orderNo:
                            r.orderType === 'SO' ? r.soNo
                                : r.orderType === 'PO' ? r.poNo
                                    : r.orderType === 'RMA' ? r.rmano
                                        : r.orderType === 'RTV/C' ? (r.rtvRmaNo ?? r.rtvid) : '',
                        userName: r.userName,
                        scanDate: r.scanDate
                            ? new Date(r.scanDate).toLocaleDateString()
                            : '',
                        partNo: r.partNo,
                        serialNo: r.serialNo,
                        serialNoB: r.serialNoB ?? '',
                        heciCode: r.heciCode ?? '',
                    });
                });

            sheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' },
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ScanHistory_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setExportSuccess('Excel file exported successfully!');
        } catch (err) {
            console.error('Export error', err);
            setExportError('Failed to export to Excel.');
        } finally {
            setLoadingExport(false);
        }
    }, [results, selectedIds]);

    const grouped = selectedIds
        .map(id => results.find(r => r.rowId === id))
        .filter((r): r is ScanHistory => Boolean(r))
        .reduce<Record<string, ScanHistory[]>>((acc, rec) => {
            const key = rec.orderType || 'Unknown';
            (acc[key] = acc[key] || []).push(rec);
            return acc;
        }, {});

    const computeOrderNo = (r: ScanHistory) => {
        switch (r.orderType) {
            case 'SO': return r.soNo ?? '';
            case 'PO': return r.poNo ?? '';
            case 'RMA': return r.rmano ?? '';
            case 'RTV/C': return r.rtvRmaNo ?? r.rtvid?.toString() ?? '';
            default: return '';
        }
    };

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
                            <SearchResults
                                results={results}
                                selectedIds={selectedIds}
                                onToggleSelect={toggleSelect}
                                onSelectAll={checked =>
                                    setSelectedIds(checked ? results.map(r => r.rowId) : [])
                                }
                                containerHeight="60vh"
                            />
                        ) : searched && !loading ? (
                            <Typography variant="h6" align="center" mt={2}>
                                No scan history records found.
                            </Typography>
                        ) : null}
                    </Grid2>
                </Grid2>
            </Container>

            {selectedIds.length > 0 && (
                <>
                    <Fab
                        color="primary"
                        aria-label="export"
                        onClick={handleExport}
                        disabled={loadingExport}
                        sx={{ position: 'fixed', bottom: 24, right: 96 }}
                    >
                        {loadingExport
                            ? <CircularProgress size={24} color="inherit" />
                            : <GetAppIcon />
                        }
                    </Fab>

                    <Fab
                        color="error"
                        aria-label="delete"
                        onClick={handleDeleteClick}
                        sx={{ position: 'fixed', bottom: 24, right: 24 }}
                    >
                        <DeleteIcon />
                    </Fab>
                </>
            )}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Are you sure you want to delete these scans?
                    </Typography>
                    {Object.entries(grouped).map(([orderType, items]) => (
                        <Box
                            key={orderType}
                            sx={{
                                mb: 2,
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                {orderType}
                            </Typography>
                            <List dense disablePadding>
                                {items.map(r => (
                                    <ListItem key={r.rowId} disableGutters>
                                        <ListItemText
                                            primary={`Order No: ${computeOrderNo(r)}`}
                                            secondary={`Serial No: ${r.serialNo}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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
            <Snackbar
                open={Boolean(exportSuccess)}
                autoHideDuration={3000}
                onClose={() => setExportSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setExportSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {exportSuccess}
                </Alert>
            </Snackbar>
            <Snackbar
                open={Boolean(exportError)}
                autoHideDuration={3000}
                onClose={() => setExportError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setExportError(null)} severity="error" sx={{ width: '100%' }}>
                    {exportError}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ScanHistoryPage;
