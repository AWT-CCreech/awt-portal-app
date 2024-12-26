// React
import React from 'react';

// Models
import BuyOppEvent from '../../models/MasterSearch/BuyOppEvent';

// Components
import SortableTable from '../../shared/components/SortableTable';

// Utilities
import { getDateString } from '../../shared/utils/dataManipulation';

// MUI Components
import {
  Box,
  Paper,
  Divider,
  TableCell,
  Typography,
  Link,
} from '@mui/material';

interface IProps {
  buyOppEvents: BuyOppEvent[];
  partJumpTo: string;
}

const BuyOppsEvent: React.FC<IProps> = ({ buyOppEvents, partJumpTo }) => {
  const func = (obj: any): React.JSX.Element[] => {
    const entryDateString = getDateString(new Date(obj.entryDate));
    return [
      <TableCell key="eventId">
        <Link
          href={`http://10.0.0.8:81/inet/BuyingOpps/BuyingOppEvent.asp?EventID=${obj.eventId}&PartJumpTo=${partJumpTo}`}
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          {obj.eventId}
        </Link>
      </TableCell>,
      <TableCell key="entryDate">{entryDateString}</TableCell>,
      <TableCell key="company">{obj.company}</TableCell>,
      <TableCell key="manufacturer">{obj.manufacturer}</TableCell>,
      <TableCell key="technology">{obj.technology}</TableCell>,
      <TableCell key="frequency">{obj.frequency}</TableCell>,
      <TableCell key="uname">{obj.uname}</TableCell>,
    ];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', marginTop: 3 }}>
      <Paper elevation={3} sx={{ width: '100%', boxShadow: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Buy Opp Events
          </Typography>
          <Divider />
          <Box
            sx={{
              border: 'none',
              maxHeight: 300,
              overflow: 'auto',
              marginTop: 2,
            }}
          >
            {buyOppEvents.length > 0 ? (
              <SortableTable
                tableData={buyOppEvents}
                columns={[
                  'eventId',
                  'entryDate',
                  'company',
                  'manufacturer',
                  'technology',
                  'frequency',
                  'uname',
                ]}
                columnNames={[
                  'EID',
                  'Entry Date',
                  'Seller',
                  'Mfg',
                  'Technology',
                  'Frequency',
                  'Purch Rep',
                ]}
                headerBackgroundColor="#384959"
                hoverColor="#f5f5f5"
                func={func}
              />
            ) : (
              'Your search did not generate any results.'
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BuyOppsEvent;
