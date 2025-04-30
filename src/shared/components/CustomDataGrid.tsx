import * as React from 'react';
import {
    DataGrid,
    DataGridProps,
    GridValidRowModel,
    GridColDef,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';

export interface CustomDataGridProps<T extends GridValidRowModel>
    // inherit every DataGrid prop except we’ll override rows & columns
    extends Omit<DataGridProps<T>, 'rows' | 'columns'> {
    /** Rows to display */
    rows: T[];
    /** Column definitions */
    columns: GridColDef<T>[];
    /** Container height (enables virtual scrolling + sticky header) */
    height?: string | number;
    /** Background color for all header elements */
    headerBgColor?: string;
    /** Text (and checkbox) color for header elements */
    headerTextColor?: string;
    /** Color for the sort icon in header */
    sortIconColor?: string;
    /** Color for the column-menu icon in header */
    menuIconColor?: string;
    /** Default page size */
    pageSize?: number;
    /** Options for page size dropdown */
    pageSizeOptions?: number[];
}

export function CustomDataGrid<T extends GridValidRowModel>(
    props: CustomDataGridProps<T>
) {
    const {
        rows,
        columns,
        height = '60vh',
        headerBgColor = '#384959',
        headerTextColor = '#fff',
        sortIconColor = headerTextColor,
        menuIconColor = headerTextColor,
        pageSize = 10,
        pageSizeOptions = [5, 10, 25, 50],
        checkboxSelection = false,
        disableRowSelectionOnClick = false,
        rowSelectionModel,
        onRowSelectionModelChange,
        sx: dataGridSx,
        ...otherProps
    } = props;

    const initialState = React.useMemo(
        () => ({
            pagination: { paginationModel: { pageSize } },
        }),
        [pageSize]
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height,
            }}
        >
            <DataGrid<T>
                rows={rows}
                columns={columns}
                pagination
                pageSizeOptions={pageSizeOptions}
                initialState={initialState}
                checkboxSelection={checkboxSelection}
                disableRowSelectionOnClick={disableRowSelectionOnClick}
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={onRowSelectionModelChange}
                sx={{
                    // header container (background + sticky)
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: headerBgColor,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                    },
                    // each header cell background
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: headerBgColor,
                    },
                    // header text color
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: headerTextColor,
                    },
                    // header “select-all” checkbox color
                    '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
                        color: headerTextColor,
                        '&.Mui-checked': {
                            color: headerTextColor,
                        },
                    },
                    // sort icon color
                    '& .MuiDataGrid-columnHeader .MuiDataGrid-sortIcon': {
                        color: sortIconColor,
                    },
                    // column-menu icon color
                    '& .MuiDataGrid-columnHeader .MuiDataGrid-menuIconButton': {
                        color: menuIconColor,
                        '&:hover': {
                            color: menuIconColor,
                        },
                    },
                    // make body scrollable under header
                    '& .MuiDataGrid-virtualScroller': {
                        overflow: 'auto',
                    },
                    ...dataGridSx,
                }}
                {...otherProps}
            />
        </Box>
    );
}