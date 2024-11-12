import React from 'react';
import { Box, Typography } from '@mui/material';
import EventLevel from './EventLevel';
import DetailLevel from './DetailLevel';

interface SearchResultsProps {
    eventLevelData: any[];
    detailLevelData: any[];
    onUpdate: (data: any) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    eventLevelData,
    detailLevelData,
    onUpdate,
}) => {
    return (
        <Box>
            <Typography variant="h6">Event Level</Typography>
            <EventLevel data={eventLevelData} onUpdate={onUpdate} />

            <Typography variant="h6" mt={3}>Detail Level</Typography>
            <DetailLevel data={detailLevelData} onUpdate={onUpdate} />
        </Box>
    );
};

export default SearchResults;