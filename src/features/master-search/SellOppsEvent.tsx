import React from 'react';
import {
  Box,
  Divider,
  Paper,
  TableCell,
  Typography,
} from '@mui/material';
import SellOppEvent from '../../models/MasterSearch/SellOppEvent';
import SortableTable from '../../sharedComponents/SortableTable';
import { getDateString } from '../../utils/stringManipulation';

interface IProps {
  sellOppEvents: SellOppEvent[];
}

const SellOppsEvent: React.FC<IProps> = ({ sellOppEvents }) => {
  const func = (obj: any): React.JSX.Element[] => {
    const entryDateString = getDateString(new Date(obj.entryDate));
    return [
      <TableCell key="eventId">
        <a
          href={`http://10.0.0.8:81/inet/Sales/EditRequestDetail_V2.asp?eventid=${obj.eventId}&name=${obj.contact}&contactid=${obj.contactId}`}
          style={{ textDecoration: 'underline' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {obj.eventId}
        </a>
      </TableCell>,
      <TableCell key="entryDate">{entryDateString}</TableCell>,
      <TableCell key="company">{obj.company}</TableCell>,
      <TableCell key="manufacturer">{obj.manufacturer}</TableCell>,
      <TableCell key="soldOrLost">{obj.soldOrLost}</TableCell>,
      <TableCell key="uname">{obj.uname}</TableCell>,
      <TableCell key="quoteId">
        {obj.quoteId !== 0 ? (
          <a
            href={`http://10.0.0.8:81/inet/Quotes/qtViewQuote.asp?QuoteID=${obj.quoteId}&EventID=${obj.eventId}&UpdFlag=0&QuoteUpdate=0`}
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Q-${obj.eventId}-${obj.version}`}
          </a>
        ) : (
          'none'
        )}
      </TableCell>,
    ];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', marginTop: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', boxShadow: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Sell Opp Events
          </Typography>
          <Divider />
          <Box sx={{ border: 'none', maxHeight: 300, overflow: 'auto', marginTop: 2 }}>
            {sellOppEvents.length > 0 ? (
              <SortableTable
                tableData={sellOppEvents}
                columns={['eventId', 'entryDate', 'company', 'manufacturer', 'soldOrLost', 'uname', 'quoteId']}
                columnNames={['EID', 'Entry Date', 'Customer', 'Mfg', 'Status', 'Sales Rep', 'Quote']}
                headerBackgroundColor="#73e5eb"
                hoverColor="#ccffcc"
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

export default SellOppsEvent;
