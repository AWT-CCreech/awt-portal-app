import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IProps {
  keyValue: number;
  name: string;
  vendorId: number;
  isMainVendor: boolean;
  handleSelect: (key: number) => void;
}

export const VendorListItem: React.FC<IProps> = ({ keyValue, name, vendorId, isMainVendor, handleSelect }) => {
  return (
    <ListItem
      style={isMainVendor ? { backgroundColor: 'Aquamarine' } : {}}
      key={keyValue}
    >
      <ListItemText primary={name} />
      <ListItemSecondaryAction>
        <IconButton edge="end" color="success" onClick={() => handleSelect(vendorId)}>
          <AddCircleIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default VendorListItem;
