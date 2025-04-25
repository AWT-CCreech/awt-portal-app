import * as React from 'react';
import {
    GridColDef,
    GridCallbackDetails,
    GridRowSelectionModel,
    GridRowId,
    GridValueGetter,
} from '@mui/x-data-grid';
import { SharedDataGrid } from '../../shared/components/CustomDataGrid';
import { ScanHistory } from '../../models/ScanHistory';
import '../../shared/styles/scan-history/SearchResults.scss';

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
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(
    ({
        results,
        selectedIds,
        onToggleSelect,
        onSelectAll,
        containerHeight = '60vh',
        headerBgColor = '#384959',
        headerTextColor = '#fff',
        sortIconColor = headerTextColor,
        menuIconColor = headerTextColor,
    }) => {
        // inject `id`
        const rows = React.useMemo<RowType[]>(
            () => results.map(r => ({ ...r, id: r.rowId })),
            [results]
        );

        // order no helper
        const getOrderNo: GridValueGetter<RowType, string> = (_v, row) => {
            switch (row.orderType) {
                case 'SO':
                    return row.soNo ?? '';
                case 'PO':
                    return row.poNo ?? '';
                case 'RMA':
                    return row.rmano ?? '';
                case 'RTV/C':
                    return row.rtvRmaNo ?? row.rtvid?.toString() ?? '';
                default:
                    return '';
            }
        };

        // format date
        const formatDate: GridValueGetter<RowType, string> = (_v, row) =>
            row.scanDate ? new Date(row.scanDate).toLocaleDateString() : '';

        const columns: GridColDef<RowType>[] = React.useMemo(
            () => [
                { field: 'orderType', headerName: 'Order Type', width: 120 },
                {
                    field: 'orderNo',
                    headerName: 'Order No',
                    width: 120,
                    valueGetter: getOrderNo,
                },
                { field: 'userName', headerName: 'User', width: 150, sortable: true },
                {
                    field: 'scanDate',
                    headerName: 'Date',
                    width: 130,
                    sortable: true,
                    valueGetter: formatDate,
                },
                { field: 'partNo', headerName: 'Part No', width: 150 },
                { field: 'serialNo', headerName: 'Serial No', width: 150 },
                { field: 'serialNoB', headerName: 'Serial No B', width: 150 },
                { field: 'heciCode', headerName: 'Heci Code', width: 150 },
            ],
            [getOrderNo, formatDate]
        );

        // selection logic
        const gridSelectionModel: GridRowSelectionModel = React.useMemo(
            () =>
                ({ type: 'include', ids: new Set(selectedIds) as Set<GridRowId> } as any),
            [selectedIds]
        );

        const handleRowSelectionChange = React.useCallback(
            (newModel: GridRowSelectionModel, _details: GridCallbackDetails) => {
                const newIds = Array.from(newModel.ids) as number[];
                if (newIds.length === rows.length) {
                    onSelectAll(true);
                    return;
                }
                if (newIds.length === 0 && selectedIds.length > 0) {
                    onSelectAll(false);
                    return;
                }
                const added = newIds.filter(id => !selectedIds.includes(id));
                const removed = selectedIds.filter(id => !newIds.includes(id));
                if (added.length) onToggleSelect(added[0]);
                else if (removed.length) onToggleSelect(removed[0]);
            },
            [onToggleSelect, onSelectAll, selectedIds, rows.length]
        );

        return (
            <SharedDataGrid<RowType>
                rows={rows}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[10, 25, 50]}
                checkboxSelection
                disableRowSelectionOnClick
                rowSelectionModel={gridSelectionModel}
                onRowSelectionModelChange={handleRowSelectionChange}
                height={containerHeight}
                headerBgColor={headerBgColor}
                headerTextColor={headerTextColor}
                sortIconColor={sortIconColor}
                menuIconColor={menuIconColor}
            />
        );
    }
);

export default SearchResults;