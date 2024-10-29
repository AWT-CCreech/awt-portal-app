import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../../app/api/agent';
import { DropShipPart } from '../../models/DropShip/DropShipPart';

interface IProps {
  selectedParts: DropShipPart[];
  setSelectedParts: (parts: DropShipPart[]) => void;
  poNo?: string;
  soNo?: string;
}

const PartNumberModal: React.FC<IProps> = ({
  selectedParts,
  setSelectedParts,
  poNo,
  soNo,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allParts, setAllParts] = useState<DropShipPart[]>([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && (poNo || soNo)) {
      setLoading(true);
      agent.DataFetch.fetchDropShipParts(poNo, soNo)
        .then((parts) => {
          // Exclude already selected parts
          const filteredParts = parts.filter(
            (part) =>
              !selectedParts.some((p) => p.serialNumber === part.serialNumber)
          );
          setAllParts(filteredParts);
          if (filteredParts.length === 0) {
            setErrorMessage('No parts found for the provided PO/SO number.');
          } else {
            setErrorMessage(null);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch drop ship parts:', error);
          setErrorMessage('Error fetching parts. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAllParts([]);
    }
  }, [open, poNo, soNo, selectedParts]);

  const handleSelectPart = (part: DropShipPart) => {
    if (!selectedParts.some((p) => p.serialNumber === part.serialNumber)) {
      setSelectedParts([...selectedParts, part]);
      // Remove the part from allParts
      setAllParts(allParts.filter((p) => p.serialNumber !== part.serialNumber));
    }
  };

  const handleRemovePart = (part: DropShipPart) => {
    // Remove the part from selectedParts
    setSelectedParts(
      selectedParts.filter((p) => p.serialNumber !== part.serialNumber)
    );
    // Add the part back to allParts
    setAllParts([...allParts, part]);
  };

  const handleSelectAll = () => {
    // Move all parts from allParts to selectedParts
    setSelectedParts([...selectedParts, ...allParts]);
    // Clear the allParts list
    setAllParts([]);
    // Clear the search term
    setSearchTerm('');
  };

  const handleUnselectAll = () => {
    // Move all parts from selectedParts back to allParts
    setAllParts([...allParts, ...selectedParts]);
    // Clear the selectedParts list
    setSelectedParts([]);
    // Clear the search term
    setSearchTerm('');
  };

  const handleSearchResults = (): DropShipPart[] => {
    if (searchTerm !== '')
      return allParts.filter(
        (part) =>
          part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    else return allParts;
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setOpen(true)}
        disabled={!poNo && !soNo}
      >
        Add Part
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Parts</DialogTitle>
        <DialogContent dividers>
          {errorMessage && (
            <Alert
              severity="error"
              onClose={() => setErrorMessage(null)}
              sx={{ mb: 2 }}
            >
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2} alignItems="stretch">
            {/* Left Side */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1">Available Parts</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectAll}
                  disabled={allParts.length === 0}
                >
                  Select All
                </Button>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 1,
                  minHeight: 300,
                  maxHeight: 400,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {handleSearchResults().map((part, i) => (
                        <ListItem key={i} divider>
                          <ListItemText
                            primary={part.partNumber}
                            secondary={`SN: ${part.serialNumber}`}
                          />
                          <IconButton
                            edge="end"
                            aria-label="add"
                            color="primary"
                            onClick={() => handleSelectPart(part)}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            </Grid>
            {/* Right Side */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1">Selected Parts</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUnselectAll}
                  disabled={selectedParts.length === 0}
                >
                  Unselect All
                </Button>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 1,
                  minHeight: 300,
                  maxHeight: 400,
                }}
              >
                {selectedParts.length > 0 ? (
                  selectedParts.map((part, index) => (
                    <Chip
                      key={index}
                      label={`${part.partNumber} - SN: ${part.serialNumber}`}
                      color="primary"
                      onDelete={() => handleRemovePart(part)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No parts selected.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PartNumberModal;
