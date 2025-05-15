import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    useMemo
} from 'react';
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
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
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
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExcelJS from 'exceljs';

import UserInfoContext from '../../shared/stores/userInfo';

import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { ScanHistory } from '../../models/ScanHistory';
import { UpdateScanDto } from '../../models/ScanHistoryModels/UpdateScanDto';
import { defaultCopyScansDto, CopyScansDto } from '../../models/ScanHistoryModels/CopyScansDto';
import { User } from '../../models/User';

const ScanHistoryPage: React.FC = () => {
    const { username } = useContext(UserInfoContext);

    // ─── STATE ─────────────────────────────────────────────────────────────────
    const [scanUsers, setScanUsers] = useState<User[]>([]);
    const [searchParams, setSearchParams] = useState<SearchScansDto>(
        createDefaultSearchScansDto()
    );
    const [results, setResults] = useState<ScanHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [loadingExport, setLoadingExport] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    const [copyOpen, setCopyOpen] = useState(false);
    const [copyOrderType, setCopyOrderType] = useState<string>('');
    const [copyOrderNum, setCopyOrderNum] = useState<string>('');
    const [loadingCopy, setLoadingCopy] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    // ─── HELPERS ────────────────────────────────────────────────────────────────
    function computeOrderNo(r: ScanHistory) {
        switch (r.orderType) {
            case 'SO': return r.soNo ?? '';
            case 'PO': return r.poNo ?? '';
            case 'RMA': return r.rmano ?? '';
            case 'RTV/C': return (r.rtvRmaNo ?? r.rtvid)?.toString() ?? '';
            default: return '';
        }
    }

    // ─── FETCH USERS ─────────────────────────────────────────────────────────────
    useEffect(() => {
        Modules.Users.getWarehouseUsers().then(setScanUsers).catch(console.error);
    }, []);

    // ─── FETCH SCANS ─────────────────────────────────────────────────────────────
    const fetchScans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await Modules.ScanHistory.searchScans(searchParams);
            setResults(Array.isArray(data) ? data : []);
            setSelectedIds([]);
            setSuccess('Scan search completed.');
        } catch {
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

    // ─── UPDATE ─────────────────────────────────────────────────────────────────
    const handleUpdate = useCallback(
        async (dto: UpdateScanDto) => {
            setLoading(true);
            setError(null);
            try {
                await Modules.ScanHistory.updateScans([dto]);
                setSuccess(`Updated row ${dto.rowId}.`);
                await fetchScans();
            } catch {
                setError(`Failed to update row ${dto.rowId}.`);
            } finally {
                setLoading(false);
            }
        },
        [fetchScans]
    );

    // ─── DELETE ─────────────────────────────────────────────────────────────────
    const handleDeleteClick = () => {
        if (selectedIds.length) setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            await Modules.ScanHistory.deleteScans(selectedIds);
            setSuccess(`Deleted ${selectedIds.length} scan(s).`);
            await fetchScans();
        } catch {
            setError('Failed to delete scans.');
        } finally {
            setLoading(false);
        }
    };

    // ─── EXPORT ─────────────────────────────────────────────────────────────────
    const handleExport = useCallback(async () => {
        setLoadingExport(true);
        setExportError(null);
        try {
            const wb = new ExcelJS.Workbook();
            const sheet = wb.addWorksheet('ScanHistory');
            sheet.columns = [
                { header: 'Order Type', key: 'orderType', width: 15 },
                { header: 'Order No', key: 'orderNo', width: 15 },
                { header: 'User', key: 'userName', width: 20 },
                { header: 'Date', key: 'scanDate', width: 15 },
                { header: 'Part No', key: 'partNo', width: 20 },
                { header: 'Serial No', key: 'serialNo', width: 20 },
                { header: 'Serial No B', key: 'serialNoB', width: 20 },
                { header: 'Heci Code', key: 'heciCode', width: 20 }
            ];
            results
                .filter(r => selectedIds.includes(r.rowId))
                .forEach(r =>
                    sheet.addRow({
                        orderType: r.orderType,
                        orderNo: computeOrderNo(r),
                        userName: r.userName,
                        scanDate: r.scanDate ? new Date(r.scanDate).toLocaleDateString() : '',
                        partNo: r.partNo,
                        serialNo: r.serialNo,
                        serialNoB: r.serialNoB ?? '',
                        heciCode: r.heciCode ?? ''
                    })
                );
            sheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' }
                };
            });
            const buf = await wb.xlsx.writeBuffer();
            const blob = new Blob([buf], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ScanHistory_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setExportSuccess('Excel exported!');
        } catch {
            setExportError('Failed to export.');
        } finally {
            setLoadingExport(false);
        }
    }, [results, selectedIds]);

    // ─── COPY ───────────────────────────────────────────────────────────────────
    const handleCopyClick = () => setCopyOpen(true);
    const handleConfirmCopy = async () => {
        setLoadingCopy(true);
        setCopyError(null);
        try {
            const payload: CopyScansDto = {
                ...defaultCopyScansDto,
                selectedIDs: selectedIds,
                toOrderType: copyOrderType,
                toOrderNum: copyOrderNum,
                requestedBy: username
            };
            await Modules.ScanHistory.copyScans(payload);
            setCopySuccess(
                `Copied ${selectedIds.length} scan(s) → ${copyOrderType}#${copyOrderNum}`
            );
            setCopyOpen(false);
            setCopyOrderType('');
            setCopyOrderNum('');
            await fetchScans();
        } catch {
            setCopyError('Failed to copy scans.');
        } finally {
            setLoadingCopy(false);
        }
    };

    // Memoize first selected scan for dialog header
    const sourceScan = useMemo(
        () => results.find(r => selectedIds.includes(r.rowId)),
        [results, selectedIds]
    );
    const sourceOrderType = sourceScan?.orderType ?? '';
    const sourceOrderNum = sourceScan ? computeOrderNo(sourceScan) : '';

    // ─── GROUP FOR DELETE MODAL ──────────────────────────────────────────────────
    const grouped = useMemo(() => {
        return results
            .filter(r => selectedIds.includes(r.rowId))
            .reduce<Record<string, ScanHistory[]>>((acc, r) => {
                const key = r.orderType || 'Unknown';
                if (!acc[key]) acc[key] = [];
                acc[key].push(r);
                return acc;
            }, {});
    }, [results, selectedIds]);

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
                                    setSelectedIds(
                                        checked ? results.map(r => r.rowId) : []
                                    )
                                }
                                containerHeight="60vh"
                                orderTypeOptions={['SO', 'PO', 'RMA', 'RTV/C']}
                                scanUsers={scanUsers}
                                onUpdate={handleUpdate}
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
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        zIndex: theme => theme.zIndex.tooltip + 1,
                    }}
                >
                    <Fab color="error" aria-label="delete" onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </Fab>
                    <Fab
                        color="primary"
                        size="large"
                        aria-label="export"
                        onClick={handleExport}
                        disabled={loadingExport}
                        sx={{ width: 72, height: 72 }}
                    >
                        {loadingExport ? (
                            <CircularProgress size={32} color="inherit" />
                        ) : (
                            <GetAppIcon fontSize="large" />
                        )}
                    </Fab>
                    <Fab
                        color="secondary"
                        aria-label="copy"
                        onClick={handleCopyClick}
                        disabled={loadingCopy}
                    >
                        {loadingCopy ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <CopyAllOutlinedIcon />
                        )}
                    </Fab>
                </Box>
            )}

            {/* Delete Confirmation */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Please double-check the scans you’re about to delete:
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

            {/* Copy Dialog */}
            <Dialog open={copyOpen} onClose={() => setCopyOpen(false)}>
                <DialogTitle>Duplicate Scans</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 2,
                        minWidth: 360
                    }}
                >
                    <Typography variant="subtitle1">
                        Copying scans from <strong>{sourceOrderType}#{sourceOrderNum}</strong> to:
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Order Type</InputLabel>
                        <Select
                            label="Order Type"
                            value={copyOrderType}
                            onChange={(e: SelectChangeEvent) =>
                                setCopyOrderType(e.target.value)
                            }
                        >
                            {['SO', 'PO', 'RMA', 'RTV/C'].map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Order No"
                        value={copyOrderNum}
                        onChange={e => setCopyOrderNum(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCopyOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmCopy}
                        disabled={!copyOrderType || !copyOrderNum || loadingCopy}
                    >
                        {loadingCopy ? <CircularProgress size={24} /> : 'Copy'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbars */}
            {[
                { msg: success, onClose: () => setSuccess(null), sev: 'success' },
                { msg: error, onClose: () => setError(null), sev: 'error' },
                {
                    msg: exportSuccess,
                    onClose: () => setExportSuccess(null),
                    sev: 'success'
                },
                { msg: exportError, onClose: () => setExportError(null), sev: 'error' },
                { msg: copySuccess, onClose: () => setCopySuccess(null), sev: 'success' },
                { msg: copyError, onClose: () => setCopyError(null), sev: 'error' }
            ].map(({ msg, onClose, sev }, i) => (
                <Snackbar
                    key={i}
                    open={!!msg}
                    autoHideDuration={3000}
                    onClose={onClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={onClose} severity={sev as any} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
            ))}
        </div>
    );
};

export default ScanHistoryPage;
