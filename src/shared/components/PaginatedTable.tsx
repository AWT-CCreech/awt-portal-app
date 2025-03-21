import React, { useState, useEffect } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import SortableTable from './SortableTable';
import styled from 'styled-components';

interface PaginatedTableProps {
  tableData: object[];
  columns?: string[];
  columnNames?: string[];
  func?: (row: any) => React.JSX.Element[];
  headerBackgroundColor?: string;
  hoverColor?: string;
}

const ScrollableContainer = styled(Box)`
  max-height: 33vh;
  overflow-y: auto;
  position: relative;
`;

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  tableData,
  columns,
  columnNames,
  func,
  headerBackgroundColor,
  hoverColor,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paginatedData, setPaginatedData] = useState<object[]>([]);

  useEffect(() => {
    setPaginatedData(
      tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [tableData, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <ScrollableContainer>
        <SortableTable
          tableData={paginatedData}
          columns={columns}
          columnNames={columnNames}
          func={func}
          headerBackgroundColor={headerBackgroundColor}
          hoverColor={hoverColor}
        />
      </ScrollableContainer>
      <TablePagination
        component="div"
        count={tableData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[
          5,
          10,
          25,
          50,
          { label: 'All', value: tableData.length },
        ]}
      />
    </Paper>
  );
};

export default PaginatedTable;
