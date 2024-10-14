// React and Hooks
import React, { useEffect, useState } from 'react';

// API
import agent from '../../app/api/agent';

// Models
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';

// MUI Components
import {
  Box,
  Button,
  Checkbox,
  Container,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface IProps {
  selectedpartItems: IMassMailerPartItem[];
  setSelectedPartItems: (item: IMassMailerPartItem[]) => void;
}

const PartTable: React.FC<IProps> = ({ selectedpartItems, setSelectedPartItems }) => {
  const [partItems, setPartItems] = useState<IMassMailerPartItem[]>([]);

  useEffect(() => {
    const userid = localStorage.getItem('userid');
    if (userid !== null)
      agent.MassMailer.PartItems.partItemsForUser(userid).then(response => {
        setPartItems(response);
        setSelectedPartItems(response);
      });
  }, [setSelectedPartItems]);

  const handleCheckbox = (id: string | number | undefined, checked: boolean | undefined) => {
    if (checked === false)
      setSelectedPartItems(selectedpartItems.filter(item => item.id !== id));
    else if (checked === true)
      setSelectedPartItems([...selectedpartItems, ...partItems.filter(item => item.id === id)]);
  };

  const handleInputChange = (target: string, value: string) => {
    const field = target.split('-')[0];
    const index = parseInt(target.split('-')[1]);

    let items = [...partItems];
    let selectedItems = [...selectedpartItems];

    let item = { ...items[index] };
    if (field === 'qty') item[field] = Number(value);
    else item[field] = value;

    // update part items
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id === item.id) items[i] = { ...item };
    }
    setPartItems(items);

    // update selected part items
    for (let i = 0; i < selectedItems.length; ++i) {
      if (selectedItems[i].id === item.id) {
        selectedItems[i] = { ...item };
      }
    }
    setSelectedPartItems(selectedItems);
  };

  return (
    <div>
      <TableContainer component={Container} sx={{ marginTop: '6em' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Airway Part Number</TableCell>
              <TableCell>Mfg Part Number</TableCell>
              <TableCell>Part Description</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Rev</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {partItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    defaultChecked
                    id={String(item.id)}
                    onChange={(event) => handleCheckbox(item.id, event.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name={`partNum-${index}`}
                    style={{ width: '200px' }}
                    value={item.partNum}
                    onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name={`altPartNum-${index}`}
                    style={{ width: '200px' }}
                    value={item.altPartNum}
                    onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name={`partDesc-${index}`}
                    style={{ width: '400px' }}
                    value={item.partDesc}
                    onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name={`qty-${index}`}
                    style={{ width: '80px' }}
                    value={item.qty}
                    onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  />
                </TableCell>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>
                  <Input
                    name={`revision-${index}`}
                    style={{ width: '80px' }}
                    value={item.revision}
                    onChange={(event) => handleInputChange(event.target.name, event.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={4}>
        <Button
          variant="contained"
          color="error"
          onClick={() =>
            agent.MassMailer.ClearPartItems.clear(localStorage.getItem('userid') ?? '').then(() => window.location.reload())
          }
        >
          Unmark Mailers
        </Button>
      </Box>
    </div>
  );
};

export default PartTable;
