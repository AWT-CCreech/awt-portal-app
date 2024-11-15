import React from 'react';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import DetailLevelRow from './DetailLevelRow';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';

interface DetailLevelProps {
    data: DetailLevelRowData[];
    onUpdate: (updateData: any) => void;
}

const DetailLevel: React.FC<DetailLevelProps> = ({ data, onUpdate }) => {
    const columns = [
        'rwsalesOrderNum',
        'qtySold',
        'unitMeasure',
        'partNum',
        'partDesc',
        'unitPrice',
        'salesRep',
        'dropShipment'
    ];

    const columnNames = [
        'MAS SO#',
        'Qty Sold',
        'U/M',
        'Part Num',
        'Part Desc',
        'Unit Price',
        'Sales Rep',
        'Drop Shipment'
    ];

    const renderRow = (row: DetailLevelRowData) => {
        return (
            <TableRow key={row.id}>
                <DetailLevelRow row={row} onUpdate={onUpdate} />
            </TableRow>
        );
    };

    return (
        <PaginatedSortableTable
            columns={columns}
            columnNames={columnNames}
            tableData={data}
            func={renderRow}
            headerBackgroundColor="#384959"
            hoverColor="#f0f0f0"
            tableHeight={'40vh'}
        />
    );
};

export default DetailLevel;
