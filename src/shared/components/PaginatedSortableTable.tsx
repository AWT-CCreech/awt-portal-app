import React, { useReducer, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import _ from 'lodash';
import styled from 'styled-components';

// Reducer to handle sorting and data updates
function reducer(state: any, action: any) {
  switch (action.type) {
    case 'CHANGE_SORT':
      const isSameColumn = state.column === action.column;
      const direction =
        isSameColumn && state.direction === 'asc' ? 'desc' : 'asc';
      const sortedData = _.orderBy(state.data, [action.column], [direction]);
      return {
        ...state,
        column: action.column,
        data: sortedData,
        direction,
      };
    case 'CHANGE_DATA':
      return {
        ...state,
        data: action.data,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

interface IProps {
  tableData: object[];
  columns?: string[];
  columnNames?: string[];
  func?: (row: any, hoverColor: string) => React.ReactElement; // Updated to accept hoverColor
  headerBackgroundColor?: string;
  hoverColor?: string;
  tableHeight?: string | number; // Optional: Allows setting table height from parent
}

// Styled components for consistent styling
const RoundedPaper = styled(Paper)`
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledTable = styled(Table)`
  /* Removed conflicting styles */
  border-radius: 8px;
  min-height: 100px;
`;

const HeaderTableCell = styled(TableCell)`
  color: white !important;

  & .MuiTableSortLabel-root:hover {
    color: lightgray;
  }

  & .MuiTableSortLabel-root.Mui-active {
    color: white;
  }

  & .MuiTableSortLabel-icon {
    color: inherit !important;
  }
`;

const PaginatedSortableTable: React.FC<IProps> = ({
  columns,
  columnNames,
  tableData,
  func,
  headerBackgroundColor,
  hoverColor = '#f5f5f5', // Set default hover color
  tableHeight = '50vh', // Set defailt table height
}) => {
  // Initialize reducer for sorting and data management
  const [state, dispatchState] = useReducer(reducer, {
    column: null,
    data: tableData,
    direction: null,
  });
  const { column, data, direction } = state;

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [paginatedData, setPaginatedData] = useState<object[]>([]);

  // Update data when tableData prop changes
  useEffect(() => {
    dispatchState({ type: 'CHANGE_DATA', data: tableData });
  }, [tableData]);

  // Update paginated data when data, page, or rowsPerPage changes
  useEffect(() => {
    setPaginatedData(
      data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [data, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Determine column names
  let columnNamesInCamelCase: string[];
  if (!columns || columns.length === 0) {
    columnNamesInCamelCase = Object.keys(tableData[0] || {});
  } else {
    columnNamesInCamelCase = columns;
  }

  return (
    <RoundedPaper>
      <TableContainer
        className="scrollable-table-container" // Optional: For scrollbar styling
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          maxHeight: tableHeight, // Set the fixed height
        }}
      >
        <StyledTable stickyHeader aria-label="paginated sortable table">
          <TableHead>
            <TableRow>
              {columnNamesInCamelCase.map((col, index) => (
                <HeaderTableCell
                  key={col}
                  style={{ backgroundColor: headerBackgroundColor ?? '#1976d2' }} // Default header color
                  sortDirection={column === col ? direction : false}
                >
                  <TableSortLabel
                    active={column === col}
                    direction={column === col ? direction : 'asc'}
                    onClick={() => {
                      dispatchState({ type: 'CHANGE_SORT', column: col });
                    }}
                  >
                    {columnNames && columnNames.length === columns?.length
                      ? columnNames[index]
                      : col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </HeaderTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                if (func) {
                  return func(row, hoverColor); // Pass hoverColor to func
                }
                return null;
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns?.length ||
                    Object.keys(tableData[0] || {}).length
                  }
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    No data available.
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </StyledTable>
      </TableContainer>
      <Box sx={{ flexShrink: 0 }}>
        <TablePagination
          showFirstButton
          showLastButton
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[
            5,
            10,
            25,
            50,
            100,
            { label: 'All', value: data.length },
          ]}
        />
      </Box>
    </RoundedPaper>
  );
};

export default PaginatedSortableTable;