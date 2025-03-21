import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EventLevel from './EventLevel';
import DetailLevel from './DetailLevel';
import { EventLevelRowData } from '../../models/SOWorkbench/EventLevelRowData';
import { DetailLevelRowData } from '../../models/SOWorkbench/DetailLevelRowData';

interface SearchResultsProps {
    eventLevelData: EventLevelRowData[];
    detailLevelData: DetailLevelRowData[];
    onEventBatchUpdate: (updates: any[]) => Promise<void>;
    onDetailBatchUpdate: (updates: any[]) => Promise<void>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    eventLevelData,
    detailLevelData,
    onEventBatchUpdate,
    onDetailBatchUpdate,
}) => {
    return (
        <Box>
            <Typography variant="h6">Event Level</Typography>
            <EventLevel data={eventLevelData} onBatchUpdate={onEventBatchUpdate} />

            <Typography variant="h6" mt={3}>Detail Level</Typography>
            <DetailLevel data={detailLevelData} onBatchUpdate={onDetailBatchUpdate} />
        </Box>
    );
};

export default SearchResults;
