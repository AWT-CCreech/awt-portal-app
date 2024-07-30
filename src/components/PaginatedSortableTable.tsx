import React, { useReducer, useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer, TablePagination, Box } from '@mui/material';
import _ from 'lodash';
import styled from 'styled-components';
import { toPascalCase, toLowerFirstLetter } from '../utils/dataManipulation';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        return {
          ...state,
          data: Array.from(state.data).reverse(),
          direction: state.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        column: action.column,
        data: _.sortBy(state.data, [action.column]).reverse(), // make it descending by reverse()
        direction: 'desc',
      };
    case 'CHANGE_DATA':
      return {
        ...state,
        data: action.data,
      };
    default:
      throw new Error();
  }
}

interface IProps {
  tableData: object[];
  columns?: string[];
  columnNames?: string[];
  func?: (row: any) => React.JSX.Element[];
  headerBackgroundColor?: string;
  hoverColor?: string;
}

const RoundedPaper = styled(Paper)`
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTable = styled(Table)`
  border-collapse: separate;
  overflow: hidden;
  border-radius: 8px;
`;

const StyledTableRow = styled(TableRow)<{ hovercolor?: string }>`
  &:hover {
    background-color: ${props => props.hovercolor ?? 'none'} !important;
  }
`;

const StyledTableCell = styled(TableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 100px;
`;

const HeaderTableCell = styled(StyledTableCell)`
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

const ScrollableContainer = styled(Box)`
  max-height: 33vh;
  overflow-y: auto;
  position: relative;
`;

const PaginatedSortableTable: React.FC<IProps> = ({ columns, columnNames, tableData, func, headerBackgroundColor, hoverColor }) => {
  const [state, dispatchState] = useReducer(reducer, {
    column: null,
    data: tableData,
    direction: null,
  });
  const { column, data, direction } = state;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paginatedData, setPaginatedData] = useState<object[]>([]);

  useEffect(() => {
    dispatchState({ type: 'CHANGE_DATA', data: tableData });
  }, [tableData]);

  useEffect(() => {
    setPaginatedData(data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  }, [data, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let columnNamesInCamelCase: string[];
  if (!columns || columns.length === 0) {
    columnNamesInCamelCase = Object.keys(tableData[0]);
  } else {
    columnNamesInCamelCase = columns;
  }

  return (
    <RoundedPaper>
      <ScrollableContainer>
        <TableContainer>
          <StyledTable>
            <TableHead>
              <TableRow>
                {columnNamesInCamelCase.map((col, index) => (
                  <HeaderTableCell
                    key={col}
                    style={{ backgroundColor: headerBackgroundColor ?? 'none' }}
                    sortDirection={column === col ? direction : false}
                  >
                    <TableSortLabel
                      active={column === col}
                      direction={column === col ? direction : 'asc'}
                      onClick={() => {
                        dispatchState({ type: 'CHANGE_SORT', column: col });
                      }}
                    >
                      {columnNames && columnNames.length === columns?.length ? columnNames[index] : toPascalCase(col)}
                    </TableSortLabel>
                  </HeaderTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row: any, id: number) => (
                <StyledTableRow key={id} hovercolor={hoverColor}>
                  {func
                    ? func(row)
                    : columnNamesInCamelCase.map(col => (
                        <StyledTableCell key={col}>{row[toLowerFirstLetter(col)]}</StyledTableCell>
                      ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </ScrollableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: data.length }]}
      />
    </RoundedPaper>
  );
};

export default PaginatedSortableTable;
