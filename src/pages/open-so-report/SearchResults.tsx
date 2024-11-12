// src/pages/open-so-report/SearchResults.tsx

import React, { useCallback, memo } from 'react';
import { Box } from '@mui/material';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import SearchResultsRow from './SearchResultsRow'; // Import the row component
import '../../styles/open-so-report/SearchResults.scss';

interface SearchResultsProps {
  results: (OpenSOReport & { notes: TrkSoNote[]; poLog?: TrkPoLog })[];
  groupBySo: boolean;
  containerHeight?: string;
  onOpenNoteModal: (soNum: string, partNum: string, notes: TrkSoNote[]) => void;
  onOpenPoLog: (id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = memo(
  ({
    results,
    groupBySo,
    containerHeight = '100%',
    onOpenNoteModal,
    onOpenPoLog,
  }) => {
    const allColumns = [
      'eventId',
      'sonum',
      'accountTeam',
      'customerName',
      'custPo',
      'orderDate',
      'requiredDate',
      'itemNum',
      'mfgNum',
      'amountLeft',
      'ponum',
      'poissueDate',
      'expectedDelivery',
      'qtyOrdered',
      'qtyReceived',
      'poLog',
      'notes',
    ];

    const allColumnNames = [
      'EID',
      'SO#',
      'Team',
      'Customer',
      'Cust PO',
      'Order Date',
      'Req. Date',
      'Missing P/N',
      'Vendor P/N',
      'Amount',
      'PO#',
      'PO Issue Date',
      'Exp. Delivery',
      'Qty Ordered',
      'Qty Received',
      'PO Log',
      'Notes',
    ];

    const columns = groupBySo
      ? allColumns.filter(
        (column) => column !== 'itemNum' && column !== 'mfgNum'
      )
      : allColumns;

    const columnNames = groupBySo
      ? allColumnNames.filter(
        (columnName) =>
          columnName !== 'Missing P/N' && columnName !== 'Vendor P/N'
      )
      : allColumnNames;

    // Memoized renderRow function
    const renderRow = useCallback(
      (order: OpenSOReport & { notes: TrkSoNote[]; poLog?: TrkPoLog }) => (
        <SearchResultsRow
          key={`${order.eventId}-${order.sonum}`}
          order={order}
          groupBySo={groupBySo}
          onOpenNoteModal={onOpenNoteModal}
          onOpenPoLog={onOpenPoLog}
        />
      ),
      [groupBySo, onOpenNoteModal, onOpenPoLog]
    );

    return (
      <Box
        sx={{
          height: containerHeight,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <PaginatedSortableTable
          tableData={results}
          columns={columns}
          columnNames={columnNames}
          func={renderRow}
          headerBackgroundColor="#384959"
          hoverColor="#f5f5f5"
        />
      </Box>
    );
  }
);

export default SearchResults;
