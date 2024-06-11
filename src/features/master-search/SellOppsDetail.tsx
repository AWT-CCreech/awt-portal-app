import React from 'react';
import {
  Box,
  Paper,
  Divider,
  Typography,
  TableCell
} from '@mui/material';
import SellOppDetail from '../../models/MasterSearch/SellOppDetail';
import SortableTable from '../../sharedComponents/SortableTable';
import { getDateString } from '../../utils/stringManipulation';

interface IProps {
  sellOppDetails: SellOppDetail[];
}

const SellOppsDetail: React.FC<IProps> = ({ sellOppDetails }) => {
  const func = (obj: any): React.JSX.Element[] => {
    const entryDateString = getDateString(new Date(obj.entryDate));
    return [
      <TableCell key="requestId">
        <a
          href={`http://10.0.0.8:81/inet/Sales/EditRequestDetail_V2.asp?RequestID=${obj.requestId}&Name=${obj.contact}&EventID=${obj.eventId}&ContactID=${obj.contactId}&cancelflag=2`}
          target="_new"
          rel="noopener noreferrer"
        >
          {obj.requestId}
        </a>
      </TableCell>,
      <TableCell key="entryDate">{entryDateString}</TableCell>,
      <TableCell key="company">{obj.company}</TableCell>,
      <TableCell key="partNum">
        {obj.partNum !== null && obj.partNum.trim() !== '' ? obj.partNum : obj.altPartNum}
      </TableCell>,
      <TableCell key="partDesc">{obj.partDesc}</TableCell>,
      <TableCell key="quantity">{obj.quantity}</TableCell>,
      <TableCell key="qtFound">{obj.qtFound}</TableCell>,
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
    <Box sx={{ width: '100%', maxWidth: '100%', marginTop: 3 }}>
      <Paper elevation={3} sx={{ width: '100%', boxShadow: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Sell Opp Details
          </Typography>
          <Divider />
          <Box sx={{ border: 'none', maxHeight: 300, overflow: 'auto', marginTop: 2 }}>
            {sellOppDetails.length > 0 ? (
              <SortableTable
                tableData={sellOppDetails}
                columns={[
                  'requestId',
                  'entryDate',
                  'company',
                  'partNum',
                  'partDesc',
                  'quantity',
                  'qtFound',
                  'uname',
                  'quoteId',
                ]}
                columnNames={[
                  'DID',
                  'Entry Date',
                  'Company',
                  'Part #',
                  'Part Desc',
                  'Qty Need',
                  'Qty Found',
                  'Sales Rep',
                  'Quote',
                ]}
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

export default SellOppsDetail;
