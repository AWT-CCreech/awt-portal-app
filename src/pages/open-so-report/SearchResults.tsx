import React from 'react';
import { TableCell, Link } from '@mui/material';
import SortableTable from '../../components/SortableTable';
import OpenSalesOrder from '../../models/OpenSalesOrder';
import WarningIcon from '@mui/icons-material/Warning';

interface SearchResultsProps {
  results: OpenSalesOrder[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const columns = [
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

  const columnNames = [
    'EID',
    'SO #',
    'Team',
    'Customer',
    'Cust PO',
    'Order Date',
    'Req. Date',
    'Missing Part #',
    'Vendor Part #',
    'Amount',
    'PO #',
    'PO Issue Date',
    'Expected Delivery',
    'Qty Ordered',
    'Qty Received',
    'PO Log',
    'Notes',
  ];

  const isDefaultDate = (date: Date | null) => date?.toLocaleDateString() === '1/1/1900';

  const renderRow = (order: OpenSalesOrder): JSX.Element[] => {
    const orderDate = order.orderDate ? new Date(order.orderDate) : null;
    const requiredDate = order.requiredDate ? new Date(order.requiredDate) : null;
    const poIssueDate = order.poissueDate ? new Date(order.poissueDate) : null;
    const expectedDelivery = order.expectedDelivery ? new Date(order.expectedDelivery) : null;

    const deliveryAlert = expectedDelivery && requiredDate && expectedDelivery > requiredDate && (order.leftToShip ?? 0) > 0;

    const openEvent = () => {
      window.open(
        `http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${order.eventId}`
      );
    };

    return [
      <TableCell key="eventId" align="left" onClick={openEvent} style={{cursor: 'pointer'}}>
        <Link
          href={`http://10.0.0.8:81/inet/Sales/EditRequestDetail_V2.asp?eventid=${order.eventId}`}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          {order.eventId}
        </Link>
      </TableCell>,
      <TableCell key="sonum" align="left">{order.sonum}</TableCell>,
      <TableCell key="team">{order.accountTeam || order.salesRep}</TableCell>,
      <TableCell key="customerName">{order.customerName}</TableCell>,
      <TableCell key="custPo" align="left">{order.custPo}</TableCell>,
      <TableCell key="orderDate" align="left">{orderDate && !isDefaultDate(orderDate) ? orderDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="requiredDate" align="left">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {requiredDate && !isDefaultDate(requiredDate) ? requiredDate.toLocaleDateString() : ''}
          {deliveryAlert && <WarningIcon color="error" fontSize="small" style={{ marginLeft: 4 }} />}
        </div>
      </TableCell>,
      <TableCell key="itemNum">{order.itemNum} ({order.leftToShip})</TableCell>,
      <TableCell key="mfgNum">{order.mfgNum}</TableCell>,
      <TableCell key="amountLeft" align="left">${order.amountLeft?.toFixed(2)}</TableCell>,
      <TableCell key="ponum" align="left">{order.ponum}</TableCell>,
      <TableCell key="poissueDate" align="left">{poIssueDate && !isDefaultDate(poIssueDate) ? poIssueDate.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="expectedDelivery" align="left">{expectedDelivery && !isDefaultDate(expectedDelivery) ? expectedDelivery.toLocaleDateString() : ''}</TableCell>,
      <TableCell key="qtyOrdered" align="left">{order.qtyOrdered}</TableCell>,
      <TableCell key="qtyReceived" align="left">{order.qtyReceived}</TableCell>,
      <TableCell key="poLog" align="left" style={{ cursor: 'pointer' }} onClick={() => EditPOInfo(order.id)}>{/* PO Log content here */}</TableCell>,
      <TableCell key="notes" align="left" style={{ cursor: 'pointer' }} onClick={() => EditNote(order.sonum || '', order.itemNum || '')}>{/* Notes content here */}</TableCell>,
    ];
  };

  const EditNote = (soNum: string, partNum: string) => {
    window.open(`EditOpenSONote.asp?SONum=${soNum}&PartNo=${partNum}`, "", "width=600,height=400");
  };

  const EditPOInfo = (id: number) => {
    window.open(`PODetail.asp?id=${id}`, "", "width=800,height=650");
  };

  return (
    <SortableTable
      tableData={results}
      columns={columns}
      columnNames={columnNames}
      func={renderRow}
      headerBackgroundColor="#384959"
      hoverColor="#f5f5f5"
    />
  );
};

export default SearchResults;
