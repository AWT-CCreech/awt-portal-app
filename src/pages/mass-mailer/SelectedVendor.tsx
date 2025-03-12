// React
import React from 'react';

// MUI Components and Icons
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  vendorName: string;
  vendorId: number;
  unselect: (vendorId: number) => void;
}

const SelectedVendor: React.FC<IProps> = ({
  vendorName,
  vendorId,
  unselect,
}) => {
  return (
    <Chip
      label={vendorName}
      color="success"
      onDelete={() => unselect(vendorId)}
      deleteIcon={<DeleteIcon />}
      style={{ margin: '8px' }}
    />
  );
};

export default SelectedVendor;
