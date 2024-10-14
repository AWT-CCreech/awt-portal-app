// React
import React from 'react';

// Models
import MasterSearchContact from '../../models/MasterSearch/MasterSearchContact';

// Components
import SortableTable from '../../components/SortableTable';

// MUI Components and Icons
import {
  Box,
  Paper,
  Divider,
  TableCell,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface IProps {
  contacts: MasterSearchContact[];
}

const ContactSearch: React.FC<IProps> = ({ contacts }) => {
  const func = (obj: any): React.JSX.Element[] => {
    const openDetail = () => {
      window.open(
        `http://10.0.0.8:81/inet/CAM/CAM_DashBoard.asp?ContactID=${obj.id}&ActiveTabA=0&ActiveInfoTab=0`
      );
    };
    return [
      <TableCell key="contact" onClick={openDetail} style={{ cursor: 'pointer' }}>
        {obj.contact}
      </TableCell>,
      <TableCell key="company" onClick={openDetail} style={{ cursor: 'pointer' }}>
        {obj.company}
      </TableCell>,
      <TableCell key="state" onClick={openDetail} style={{ cursor: 'pointer' }}>
        {obj.state}
      </TableCell>,
      <TableCell key="phoneMain" onClick={openDetail} style={{ cursor: 'pointer' }}>
        {obj.phoneMain}
      </TableCell>,
      <TableCell key="activeStatus" onClick={openDetail} style={{ cursor: 'pointer' }}>
        {obj.activeStatus === true ? (
          <CheckCircleIcon style={{ color: 'green' }} />
        ) : (
          <CancelIcon style={{ color: 'red' }} />
        )}
      </TableCell>,
    ];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', marginTop: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', boxShadow: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Contacts
          </Typography>
          <Divider />
          <Box sx={{ border: 'none', maxHeight: 300, overflow: 'auto', marginTop: 2 }}>
            {contacts.length > 0 ? (
              <SortableTable
                tableData={contacts}
                columns={['contact', 'company', 'state', 'phoneMain', 'activeStatus']}
                columnNames={['Contact', 'Company', 'State', 'PhoneMain', 'Active']}
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

export default ContactSearch;
