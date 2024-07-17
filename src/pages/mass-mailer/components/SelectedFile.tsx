import React from 'react';
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  fileName: string;
  unselect: (fileName: string) => void;
}

const SelectedFile: React.FC<IProps> = ({ fileName, unselect }) => {
  return (
    <Chip
      label={fileName}
      color="success"
      onDelete={() => unselect(fileName)}
      deleteIcon={<DeleteIcon />}
      style={{ margin: '8px' }}
    />
  );
};

export default SelectedFile;
