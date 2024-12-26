// src/pages/open-so-report/SearchResultsRow.tsx

import React from 'react';
import { TableRow, TableCell, IconButton, Link } from '@mui/material';
import { Warning, Add, Note } from '@mui/icons-material';
import OpenSOReport from '../../models/OpenSOReport/OpenSOReport';
import { TrkSoNote } from '../../models/TrkSoNote';
import { TrkPoLog } from '../../models/TrkPoLog';
import { formatAmount } from '../../shared/utils/dataManipulation';

interface SearchResultsRowProps {
    order: OpenSOReport & { notes: TrkSoNote[]; poLog?: TrkPoLog };
    groupBySo: boolean;
    onOpenNoteModal: (soNum: string, partNum: string, notes: TrkSoNote[]) => void;
    onOpenPoLog: (id: number) => void;
}

const SearchResultsRow: React.FC<SearchResultsRowProps> = React.memo(
    ({ order, groupBySo, onOpenNoteModal, onOpenPoLog }) => {
        const orderDate = order.orderDate ? new Date(order.orderDate) : null;
        const requiredDate = order.requiredDate
            ? new Date(order.requiredDate)
            : null;
        const poIssueDate = order.poissueDate
            ? new Date(order.poissueDate)
            : null;
        const expectedDelivery = order.expectedDelivery
            ? new Date(order.expectedDelivery)
            : null;

        const isDefaultDate = (date: Date | null) =>
            date?.toLocaleDateString() === '1/1/1900' ||
            date?.toLocaleDateString() === '1/1/1990';

        const deliveryAlert =
            expectedDelivery &&
            requiredDate &&
            expectedDelivery > requiredDate &&
            (order.leftToShip ?? 0) > 0;

        const openEvent = () => {
            window.open(
                `http://10.0.0.8:81/inet/Sales/EditRequest.asp?EventID=${order.eventId}`
            );
        };

        const hasNotes = order.notes && order.notes.length > 0;
        const hasPoLog = order.poLog !== undefined && order.poLog !== null;

        const mostRecentNoteDate = hasNotes
            ? new Date(
                Math.max(
                    ...order.notes.map((note) => new Date(note.entryDate!).getTime())
                )
            )
            : null;

        return (
            <TableRow>
                <TableCell
                    align="left"
                    style={{
                        cursor: order.eventId ? 'pointer' : 'default',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                    onClick={order.eventId ? openEvent : undefined}
                >
                    {order.eventId ? (
                        <Link underline="hover" target="_blank" rel="noopener noreferrer">
                            {order.eventId}
                        </Link>
                    ) : (
                        'N/A'
                    )}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.sonum}
                </TableCell>
                <TableCell
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.accountTeam || order.salesRep}
                </TableCell>
                <TableCell
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.customerName}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.custPo}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {orderDate && !isDefaultDate(orderDate)
                        ? orderDate.toLocaleDateString()
                        : ''}
                </TableCell>
                <TableCell align="left" className="text-overflow">
                    <div className="required-date">
                        {requiredDate && !isDefaultDate(requiredDate)
                            ? requiredDate.toLocaleDateString()
                            : ''}
                        {deliveryAlert && (
                            <Warning
                                color="error"
                                fontSize="small"
                                className="alert-icon"
                            />
                        )}
                    </div>
                </TableCell>
                {!groupBySo && (
                    <>
                        <TableCell
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                            {order.itemNum} ({order.leftToShip ?? 0})
                        </TableCell>
                        <TableCell
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                            {order.mfgNum}
                        </TableCell>
                    </>
                )}
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {formatAmount(order.amountLeft ?? 0)}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.ponum}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {poIssueDate && !isDefaultDate(poIssueDate)
                        ? poIssueDate.toLocaleDateString()
                        : ''}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {expectedDelivery && !isDefaultDate(expectedDelivery)
                        ? expectedDelivery.toLocaleDateString()
                        : ''}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.qtyOrdered}
                </TableCell>
                <TableCell
                    align="left"
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                    {order.qtyReceived}
                </TableCell>
                <TableCell
                    align="left"
                    onClick={
                        hasPoLog ? () => onOpenPoLog(order.poLog!.id) : undefined
                    }
                    style={{
                        cursor: hasPoLog ? 'pointer' : 'default',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {hasPoLog
                        ? `${new Date(order.poLog!.entryDate).toLocaleDateString()} (${order.poLog!.enteredBy
                        })`
                        : ''}
                </TableCell>
                <TableCell align="left" className="pointer notes-container">
                    <IconButton
                        onClick={() =>
                            onOpenNoteModal(
                                order.sonum || '',
                                order.itemNum || '',
                                order.notes || []
                            )
                        }
                    >
                        {hasNotes ? <Note color="primary" /> : <Add />}
                    </IconButton>
                    {hasNotes && mostRecentNoteDate && (
                        <div className="notes-edit-date">
                            {mostRecentNoteDate.toLocaleDateString()}
                        </div>
                    )}
                </TableCell>
            </TableRow>
        );
    }
);

export default SearchResultsRow;
