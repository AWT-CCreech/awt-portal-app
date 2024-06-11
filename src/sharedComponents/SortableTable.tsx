import _ from 'lodash';
import React, { useReducer, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper } from '@mui/material';
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

// the data displayed in this table must have all keys in Camel Case!!!
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

  // This style component is for the hover effect
  const StyledTableRow = styled(TableRow)`
    &:hover {
      background-color: ${hoverColor ?? 'none'} !important;
    }
  `;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {columnNamesInCamelCase.map((col, index) => (
              <TableCell
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
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any, id: number) => (
            <StyledTableRow key={id}>
              {func
                ? func(row)
                : columnNamesInCamelCase.map(col => (
                    <TableCell key={col}>{row[toLowerFirstLetter(col)]}</TableCell>
                  ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SortableTable;
