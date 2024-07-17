import React from 'react';
import BuyOppDetail from '../../models/MasterSearch/BuyOppDetail';
import SortableTable from '../../components/SortableTable';
import { getDateString } from '../../utils/stringManipulation';
import {
  Box,
  Paper,
  Divider,
  TableCell,
  Typography,
} from '@mui/material';

interface IProps {
  buyOppDetails: BuyOppDetail[];
  partJumpTo: string;
}

const BuyOppsDetail: React.FC<IProps> = ({ buyOppDetails, partJumpTo }) => {
  const func = (obj: any): React.JSX.Element[] => {
    const entryDateString = getDateString(new Date(obj.entryDate));
    return [
      <TableCell key="detailId">
        <a
          href={`http://10.0.0.8:81/inet/BuyingOpps/BuyingOppEvent.asp?EventID=${obj.eventId}&PartJumpTo=${partJumpTo}`}
          style={{ textDecoration: 'underline' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {obj.detailId}
        </a>
      </TableCell>,
      <TableCell key="entryDate">{entryDateString}</TableCell>,
      <TableCell key="company">{obj.company}</TableCell>,
      <TableCell key="partNum">{obj.partNum}</TableCell>,
      <TableCell key="partDesc">{obj.partDesc}</TableCell>,
      <TableCell key="quantity">{obj.quantity}</TableCell>,
      <TableCell key="uname">{obj.uname}</TableCell>,
    ];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', marginTop: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', boxShadow: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Buy Opp Details
          </Typography>
          <Divider />
          <Box sx={{ border: 'none', maxHeight: 300, overflow: 'auto', marginTop: 2 }}>
            {buyOppDetails.length > 0 ? (
              <SortableTable
                tableData={buyOppDetails}
                columns={['detailId', 'entryDate', 'company', 'partNum', 'partDesc', 'quantity', 'uname']}
                columnNames={['DID', 'Entry Date', 'Seller', 'Part #', 'Part Desc', 'Qty', 'Purch Rep']}
                headerBackgroundColor="#1976d2"
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

export default BuyOppsDetail;
