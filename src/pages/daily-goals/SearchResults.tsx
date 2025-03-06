import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PaginatedSortableTable from '../../shared/components/PaginatedSortableTable';
import { DailyGoalItem } from '../../models/DailyGoalsReport/DailyGoalItem';
import { DailyGoalTotals } from '../../models/DailyGoalsReport/DailyGoalTotals';
import { formatAmount } from '../../shared/utils/dataManipulation';
import '../../shared/styles/daily-goals/SearchResults.scss';
import DailyGoalsDetail from './DailyGoalsDetail';
import CloseIcon from '@mui/icons-material/Close';

// Define columns and friendly column names
const columns = ['date', 'dailySold', 'dailyShipped', 'unshippedBackorder'];
const columnNames = ['Date', 'Daily Sold', 'Daily Shipped', 'Unshipped Backorder (Cumulative)'];

interface HighlightableRowProps {
    row: DailyGoalItem;
    onDetailClick: (type: string, date: string) => void;
}

const HighlightableRow: React.FC<HighlightableRowProps> = ({ row, onDetailClick }) => {
    const handleClick = (type: string) => {
        // Convert row.date to a Date object if necessary
        const dateObj = row.date instanceof Date ? row.date : new Date(row.date);
        onDetailClick(type, dateObj.toISOString());
    };

    return (
        <tr className="highlightable-row">
            <td>{new Date(row.date).toLocaleDateString()}</td>
            <td className="hoverable-cell sold" onClick={() => handleClick('Sold')}>
                {formatAmount(row.dailySold)}
            </td>
            <td className="hoverable-cell shipped" onClick={() => handleClick('Shipped')}>
                {formatAmount(row.dailyShipped)}
            </td>
            <td className="hoverable-cell unshipped" onClick={() => handleClick('Unshipped')}>
                {formatAmount(row.unshippedBackOrder)}
            </td>
        </tr>
    );
};

interface SearchResultsProps {
    items: DailyGoalItem[];
    totals: DailyGoalTotals;
}

const SearchResults: React.FC<SearchResultsProps> = ({ items }) => {
    // State to control the detail modal.
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleDetailClick = (type: string, date: string) => {
        setSelectedType(type);
        setSelectedDate(date);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Box sx={{ mt: 3 }}>
                <PaginatedSortableTable
                    tableData={items}
                    columns={columns}
                    columnNames={columnNames}
                    func={(row: DailyGoalItem) => (
                        <HighlightableRow key={`${row.date}`} row={row} onDetailClick={handleDetailClick} />
                    )}
                    headerBackgroundColor="#384959"
                    hoverColor="#f5f5f5"
                    tableHeight="60vh"
                />
            </Box>

            {/* Detail Modal */}
            <Dialog open={modalOpen} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Detail View
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <DailyGoalsDetail displayType={selectedType} searchDate={selectedDate} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SearchResults;
