import _ from 'lodash';
import React, { useReducer, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer } from '@mui/material';
import { toPascalCase, toLowerFirstLetter } from '../utils/stringManipulation';
import styled from 'styled-components';

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

// Styled component for Paper with rounded corners
const RoundedPaper = styled(Paper)`
  border-radius: 8px;
  overflow: hidden; /* Ensures that child elements respect the rounded corners */
`;

// Styled component for the Table to ensure rounded corners
const StyledTable = styled(Table)`
  border-collapse: separate; /* Ensures that borders don't collapse and rounds correctly */
  overflow: hidden; /* Ensures that child elements respect the rounded corners */
  border-radius: 8px;
`;

// Styled component for hover effect
const StyledTableRow = styled(TableRow)<{ hovercolor?: string }>`
  &:hover {
    background-color: ${props => props.hovercolor ?? 'none'} !important;
  }
`;

// Styled component for TableCell to prevent text wrapping
const StyledTableCell = styled(TableCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 100px; /* Adjust the minimum width as needed */
`;

// Styled component for TableCell in TableHead to make text white and change hover color
const HeaderTableCell = styled(StyledTableCell)`
  color: white;

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

const SortableTable: React.FC<IProps> = ({ columns, columnNames, tableData, func, headerBackgroundColor, hoverColor }) => {
  const [state, dispatchState] = useReducer(reducer, {
    column: null,
    data: tableData,
    direction: null,
  });
  const { column, data, direction } = state;

  useEffect(() => {
    dispatchState({ type: 'CHANGE_DATA', data: tableData });
  }, [tableData]);

  let columnNamesInCamelCase: string[];
  if (!columns || columns.length === 0) {
    columnNamesInCamelCase = Object.keys(tableData[0]);
  } else {
    columnNamesInCamelCase = columns;
  }

  return (
    <RoundedPaper>
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
            {data.map((row: any, id: number) => (
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
    </RoundedPaper>
  );
};

export default SortableTable;