import * as React from 'react';
import {
    GridCellParams,
    GridColDef,
    GridRowSelectionModel,
    GridRowId,
    GridCallbackDetails,
    GridRenderCellParams,
    GridRenderEditCellParams,
    MuiEvent,
} from '@mui/x-data-grid';
import { CustomDataGrid } from '../../shared/components/CustomDataGrid';
import { ScanHistory } from '../../models/ScanHistory';
import { UpdateScanDto } from '../../models/ScanHistoryModels/UpdateScanDto';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { User } from '../../models/User';

type RowType = ScanHistory & { id: number };

interface SearchResultsProps {
    results: ScanHistory[];
    selectedIds: number[];
    onToggleSelect: (id: number) => void;
    onSelectAll: (checked: boolean) => void;
    containerHeight?: string;
    headerBgColor?: string;
    headerTextColor?: string;
    sortIconColor?: string;
    menuIconColor?: string;
    orderTypeOptions: string[];
    scanUsers: User[];
    onUpdate: (dto: UpdateScanDto) => void;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(({
    results,
    selectedIds,
    onToggleSelect,
    onSelectAll,
    containerHeight = '60vh',
    headerBgColor = '#384959',
    headerTextColor = '#fff',
    sortIconColor = headerTextColor,
    menuIconColor = headerTextColor,
    orderTypeOptions,
    scanUsers,
    onUpdate,
}) => {
    // map API results to rows with an `id` field
    const rows = React.useMemo<RowType[]>(
        () => results.map(r => ({ ...r, id: r.rowId })),
        [results]
    );

    // handle end of edit for text cells
    const handleCellEditStop = React.useCallback(
        (params: GridCellParams, event: MuiEvent) => {
            const { id, field, value } = params;
            const dto: UpdateScanDto = { rowId: id as number };

            if (field === 'serialNo') {
                dto.serialNo = String(value ?? '');
                onUpdate(dto);
            } else if (field === 'partNo') {
                dto.partNo = String(value ?? '');
                onUpdate(dto);
            }
        },
        [onUpdate]
    );

    // column definitions, with editable flags added
    const columns: GridColDef<RowType>[] = React.useMemo(() => [
        {
            field: 'orderType',
            headerName: 'Order Type',
            width: 140,
            editable: true,
            type: 'singleSelect',
            valueOptions: orderTypeOptions,
        },
        {
            field: 'orderNo',
            headerName: 'Order No',
            width: 140,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as RowType;
                switch (row.orderType) {
                    case 'SO': return row.soNo ?? '';
                    case 'PO': return row.poNo ?? '';
                    case 'RMA': return row.rmano ?? '';
                    case 'RTV/C': return row.rtvRmaNo ?? row.rtvid?.toString() ?? '';
                    default: return '';
                }
            },
        },
        {
            field: 'userName',
            headerName: 'User',
            width: 140,
            editable: true,
            type: 'singleSelect',
            valueOptions: scanUsers.map(u => u.uname),
        },
        {
            field: 'scanDate',
            headerName: 'Date',
            width: 140,
            editable: true,
            renderCell: (params: GridRenderCellParams) => {
                const d = (params.row as RowType).scanDate;
                return d ? new Date(d).toLocaleDateString() : '';
            },
            renderEditCell: (params: GridRenderEditCellParams) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={params.value ? new Date(String(params.value)) : null}
                        onChange={newDate => {
                            const iso = newDate?.toISOString() ?? '';
                            params.api.setEditCellValue(
                                { id: params.id, field: params.field, value: iso },
                                true
                            );
                            onUpdate({ rowId: params.id as number, scanDate: new Date(iso) });
                            params.api.stopCellEditMode({ id: params.id, field: params.field });
                        }}
                        slotProps={{
                            textField: { variant: 'standard', size: 'small', autoFocus: true }
                        }}
                    />
                </LocalizationProvider>
            ),
        },
        {
            field: 'partNo',
            headerName: 'Part No',
            width: 140,
            editable: true,
        },
        {
            field: 'serialNo',
            headerName: 'Serial No',
            width: 300,
            editable: true,
        },
        { field: 'serialNoB', headerName: 'Serial No B', width: 140 },
        {
            field: 'heciCode',
            headerName: 'Heci Code',
            width: 140,
            editable: true,
        },
    ], [orderTypeOptions, scanUsers, onUpdate]);

    // selection model setup
    const gridSelectionModel: GridRowSelectionModel = React.useMemo(
        () => ({ type: 'include', ids: new Set(selectedIds) as Set<GridRowId> } as any),
        [selectedIds]
    );
    const handleRowSelectionChange = React.useCallback(
        (newModel: GridRowSelectionModel, _details: GridCallbackDetails) => {
            const newIds = Array.from(newModel.ids) as number[];
            if (newIds.length === rows.length) onSelectAll(true);
            else if (newIds.length === 0) onSelectAll(false);
            else {
                const added = newIds.find(i => !selectedIds.includes(i));
                const removed = selectedIds.find(i => !newIds.includes(i));
                if (added != null) onToggleSelect(added);
                else if (removed != null) onToggleSelect(removed);
            }
        },
        [onToggleSelect, onSelectAll, selectedIds, rows.length]
    );

    return (
        <CustomDataGrid<RowType>
            rows={rows}
            columns={columns}
            height={containerHeight}
            headerBgColor={headerBgColor}
            headerTextColor={headerTextColor}
            sortIconColor={sortIconColor}
            menuIconColor={menuIconColor}
            pageSize={10}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={gridSelectionModel}
            onRowSelectionModelChange={handleRowSelectionChange}
            onCellEditStop={handleCellEditStop}
        />
    );
});

export default SearchResults;
