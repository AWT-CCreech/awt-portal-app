// React
import React from 'react';

// MUI Components and Icons
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';

import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IProps {
  keyValue: number;
  name: string;
  vendorId: number;
  isMainVendor: boolean;
  handleSelect: (key: number) => void;
}

export const VendorListItem: React.FC<IProps> = ({
  keyValue,
  name,
  vendorId,
  isMainVendor,
  handleSelect,
}) => {
  return (
    <ListItem
      style={isMainVendor ? { backgroundColor: 'Aquamarine' } : {}}
      key={keyValue}
    >
      <ListItemText primary={name} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          color="success"
          onClick={() => handleSelect(vendorId)}
        >
          <AddCircleIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VendorListItem;
