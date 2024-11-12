import React from 'react';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { TableRow } from '@mui/material';
import DetailLevelRow from './DetailLevelRow'; // Import the new row component

interface DetailLevelProps {
    data: any[];
    onUpdate: (updateData: any) => void;
}

const DetailLevel: React.FC<DetailLevelProps> = ({ data, onUpdate }) => {
    // Debugging: Log the received data
    console.log('DetailLevel Data:', data);

    const columns = [
        'rwsalesOrderNum', // Correct casing to match backend
        'qtySold',
        'unitMeasure',
        'partNum',
        'partDesc',
        'unitPrice',
        'salesRep',
    ];

    const columnNames = [
        'MAS SO#',
        'Qty Sold',
        'U/M',
        'Part Num',
        'Part Desc',
        'Unit Price',
        'Sales Rep',
    ];

    const renderRow = (row: any) => {
        const flatRow = {
            rwsalesOrderNum: row.salesOrder.rwsalesOrderNum || '',
            qtySold: row.salesOrderDetail.qtySold,
            unitMeasure: row.salesOrderDetail.unitMeasure,
            partNum: row.salesOrderDetail.partNum,
            partDesc: row.salesOrderDetail.partDesc,
            unitPrice: row.salesOrderDetail.unitPrice,
            salesRep: row.accountManager.uname || '',
        };

        return (
            <TableRow key={row.salesOrderDetail.id}>
                <DetailLevelRow row={flatRow} onUpdate={onUpdate} />
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
        />
    );
};

export default DetailLevel;