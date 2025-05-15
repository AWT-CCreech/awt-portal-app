import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import ExcelJS from 'exceljs';

import PageHeader from '../../shared/components/PageHeader';
import UserInfoContext from '../../shared/stores/userInfo';
import { ROUTE_PATHS } from '../../routes';
import Modules from '../../app/api/agent';

import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import CopyScansDialog from './CopyScansDialog';

import { User } from '../../models/User';
import { ScanHistory } from '../../models/ScanHistory';
import { SearchScansDto, createDefaultSearchScansDto } from '../../models/ScanHistoryModels/SearchScansDto';
import { UpdateScanDto } from '../../models/ScanHistoryModels/UpdateScanDto';
import { CopyScansDto, defaultCopyScansDto } from '../../models/ScanHistoryModels/CopyScansDto';

const ScanHistoryPage: React.FC = () => {
    const { username } = useContext(UserInfoContext);

    // ─── State ────────────────────────────────────────────────────────────────────
    const [scanUsers, setScanUsers] = useState<User[]>([]);
    const [searchParams, setSearchParams] = useState<SearchScansDto>(createDefaultSearchScansDto());
    const [results, setResults] = useState<ScanHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [loadingExport, setLoadingExport] = useState(false);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [copyOpen, setCopyOpen] = useState(false);
    const [copyOrderType, setCopyOrderType] = useState<string>('');
    const [copyOrderNum, setCopyOrderNum] = useState<string>('');
    const [loadingCopy, setLoadingCopy] = useState(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [copyError, setCopyError] = useState<string | null>(null);

    // ─── Helpers ──────────────────────────────────────────────────────────────────
    const computeOrderNo = (r: ScanHistory) => {
        switch (r.orderType) {
            case 'SO': return r.soNo ?? '';
            case 'PO': return r.poNo ?? '';
            case 'RMA': return r.rmano ?? '';
            case 'RTV/C': return (r.rtvRmaNo ?? r.rtvid)?.toString() ?? '';
            default: return '';
        }
    };

    // ─── Fetch initial data ───────────────────────────────────────────────────────
    useEffect(() => {
        Modules.Users.getWarehouseUsers().then(setScanUsers).catch(console.error);
    }, []);

    // ─── Fetch scans ───────────────────────────────────────────────────────────────
    const fetchScans = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const data = await Modules.ScanHistory.searchScans(searchParams);
            setResults(Array.isArray(data) ? data : []);
            setSelectedIds([]);
            setSuccessMsg('Scan search completed.');
        } catch {
            setResults([]);
            setErrorMsg('Failed to fetch scan history.');
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

    // ─── Update ───────────────────────────────────────────────────────────────────
    const handleUpdate = useCallback(async (dto: UpdateScanDto) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            await Modules.ScanHistory.updateScans([dto]);
            setSuccessMsg(`Updated row ${dto.rowId}.`);
            await fetchScans();
        } catch {
            setErrorMsg(`Failed to update row ${dto.rowId}.`);
        } finally {
            setLoading(false);
        }
    }, [fetchScans]);

    // ─── Delete ───────────────────────────────────────────────────────────────────
    const handleDeleteClick = () => {
        if (selectedIds.length) setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            await Modules.ScanHistory.deleteScans(selectedIds);
            setSuccessMsg(`Deleted ${selectedIds.length} scan(s).`);
            await fetchScans();
        } catch {
            setErrorMsg('Failed to delete scans.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Export ───────────────────────────────────────────────────────────────────
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

    // ─── Copy ─────────────────────────────────────────────────────────────────────
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
            setCopySuccess(`Copied ${selectedIds.length} scan(s) → ${copyOrderType}#${copyOrderNum}`);
            setCopyOrderType('');
            setCopyOrderNum('');
            setCopyOpen(false);
            await fetchScans();
        } catch {
            setCopyError('Failed to copy scans.');
        } finally {
            setLoadingCopy(false);
        }
    };

    const sourceScan = useMemo(
        () => results.find(r => selectedIds.includes(r.rowId)),
        [results, selectedIds]
    );
    const sourceLabel = sourceScan ? `${sourceScan.orderType}#${computeOrderNo(sourceScan)}` : '';

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div>
            <PageHeader pageName="Scan History" pageHref={ROUTE_PATHS.OPERATIONS.SCAN_HISTORY} />

            <Container maxWidth={false} sx={{ p: 2 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, md: 12 }}>
                        <SearchBox
                            scanUsers={scanUsers}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            onSearch={handleSearch}
                            loading={loading}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 12 }}>
                        {searched && results.length > 0 ? (
                            <SearchResults
                                results={results}
                                selectedIds={selectedIds}
                                onToggleSelect={toggleSelect}
                                onSelectAll={checked =>
                                    setSelectedIds(checked ? results.map(r => r.rowId) : [])
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
                        gap: 2,
                        zIndex: theme => theme.zIndex.tooltip + 1,
                    }}
                >
                    <Fab color="error" onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </Fab>

                    <Fab
                        color="primary"
                        size="large"
                        onClick={handleExport}
                        disabled={loadingExport}
                        sx={{ width: 72, height: 72 }}
                    >
                        {loadingExport ? <CircularProgress size={32} /> : <GetAppIcon fontSize="large" />}
                    </Fab>

                    <Fab color="secondary" onClick={handleCopyClick} disabled={loadingCopy}>
                        {loadingCopy ? <CircularProgress size={24} /> : <CopyAllOutlinedIcon />}
                    </Fab>
                </Box>
            )}

            <DeleteConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                items={results.filter(r => selectedIds.includes(r.rowId))}
                computeOrderNo={computeOrderNo}
            />

            <CopyScansDialog
                open={copyOpen}
                sourceLabel={sourceLabel}
                copyOrderType={copyOrderType}
                copyOrderNum={copyOrderNum}
                loading={loadingCopy}
                error={copyError}
                onClose={() => setCopyOpen(false)}
                onConfirm={handleConfirmCopy}
                onTypeChange={e => setCopyOrderType(e.target.value)}
                onNumChange={e => setCopyOrderNum(e.target.value)}
            />

            {[
                { msg: successMsg, onClose: () => setSuccessMsg(null), severity: 'success' },
                { msg: errorMsg, onClose: () => setErrorMsg(null), severity: 'error' },
                { msg: exportSuccess, onClose: () => setExportSuccess(null), severity: 'success' },
                { msg: exportError, onClose: () => setExportError(null), severity: 'error' },
                { msg: copySuccess, onClose: () => setCopySuccess(null), severity: 'success' },
                { msg: copyError, onClose: () => setCopyError(null), severity: 'error' }
            ].map(({ msg, onClose, severity }, i) => (
                <Snackbar
                    key={i}
                    open={!!msg}
                    autoHideDuration={3000}
                    onClose={onClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={onClose} severity={severity as any} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
            ))}
        </div>
    );
};

export default ScanHistoryPage;