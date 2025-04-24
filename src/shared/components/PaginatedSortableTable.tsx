import React, { useReducer, useEffect, useState, ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import _ from 'lodash';
import styled from 'styled-components';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'CHANGE_SORT': {
      const isSame = state.column === action.column;
      const dir = isSame && state.direction === 'asc' ? 'desc' : 'asc';
      const sorted = _.orderBy(state.data, [action.column], [dir]);
      return { ...state, column: action.column, data: sorted, direction: dir };
    }
    case 'CHANGE_DATA':
      return { ...state, data: action.data };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

interface IProps {
  tableData: object[];
  columns?: string[];
  columnNames?: ReactNode[];
  func?: (row: any, hoverColor: string) => React.ReactElement;
  headerBackgroundColor?: string;
  hoverColor?: string;
  tableHeight?: string | number;
}

const RoundedPaper = styled(Paper)`
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledTable = styled(Table)`
  border-radius: 8px;
  min-height: 100px;
`;

const HeaderTableCell = styled(TableCell)`
  color: white !important;
  & .MuiTableSortLabel-root:hover { color: lightgray; }
  & .MuiTableSortLabel-root.Mui-active { color: white; }
  & .MuiTableSortLabel-icon { color: inherit !important; }
`;

const PaginatedSortableTable: React.FC<IProps> = ({
  columns,
  columnNames,
  tableData,
  func,
  headerBackgroundColor,
  hoverColor = '#f5f5f5',
  tableHeight = '50vh',
}) => {
  const [state, dispatchState] = useReducer(reducer, {
    column: null,
    data: tableData,
    direction: null,
  });
  const { column, data, direction } = state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRPP] = useState(25);
  const [paginatedData, setPD] = useState<object[]>([]);

  useEffect(() => {
    dispatchState({ type: 'CHANGE_DATA', data: tableData });
  }, [tableData]);

  useEffect(() => {
    setPD(data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  }, [data, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRPP = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRPP(parseInt(e.target.value, 10));
    setPage(0);
  };

  const cols = columns && columns.length > 0
    ? columns
    : Object.keys(tableData[0] || {});

  return (
    <RoundedPaper>
      <TableContainer sx={{ flex: '1 1 auto', overflowY: 'auto', maxHeight: tableHeight }}>
        <StyledTable stickyHeader aria-label="table">
          <TableHead>
            <TableRow>
              {cols.map((col, idx) => {
                const label = columnNames && columnNames.length === cols.length
                  ? columnNames[idx]
                  : col.charAt(0).toUpperCase() + col.slice(1);

                // do not allow sorting on the 'select' column
                const isSortable = !(cols[0] === 'select' && idx === 0);

                if (!isSortable) {
                  return (
                    <HeaderTableCell
                      key={col}
                      sx={{ backgroundColor: headerBackgroundColor ?? '#1976d2' }}
                    >
                      {label}
                    </HeaderTableCell>
                  );
                }

                return (
                  <HeaderTableCell
                    key={col}
                    sx={{ backgroundColor: headerBackgroundColor ?? '#1976d2' }}
                    sortDirection={column === col ? direction : false}
                  >
                    <TableSortLabel
                      active={column === col}
                      direction={column === col ? direction : 'asc'}
                      onClick={() => dispatchState({ type: 'CHANGE_SORT', column: col })}
                    >
                      {label}
                    </TableSortLabel>
                  </HeaderTableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0
              ? paginatedData.map(row => func ? func(row, hoverColor) : null)
              : (
                <TableRow>
                  <TableCell colSpan={cols.length}>
                    <Box sx={{ p: 2, textAlign: 'center' }}>No data available.</Box>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <Box sx={{ flexShrink: 0 }}>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRPP}
          rowsPerPageOptions={[
            5, 10, 25, 50, 100,
            { label: 'All', value: data.length },
          ]}
          showFirstButton
          showLastButton
        />
      </Box>
    </RoundedPaper>
  );
};

export default PaginatedSortableTable;
