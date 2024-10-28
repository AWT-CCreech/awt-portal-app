// React and Hooks
import React, { useEffect, useState, useRef } from 'react';

// MUI Components and Icons
import {
  Container,
  Grid,
  Box,
  Chip,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// API
import agent from '../../app/api/agent';

// Models
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import { DropShipPart } from '../../models/DropShip/DropShipPart';

// Components
import PageHeader from '../../components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import RecipientModal from './RecipientModal';
import PartNumberModal from './PartNumberModal';

const DropShip = () => {
  const [allSalesReps, setAllSalesReps] = useState<IMassMailerUser[]>([]);
  const [autoFillRep, setAutoFillRep] = useState<IMassMailerUser | null>(null);
  const [addedSalesReps, setAddedSalesReps] = useState<IMassMailerUser[]>([]);
  const [SONum, setSONum] = useState<string>('');
  const [PONum, setPONum] = useState<string>('');
  const [Tracking, setTracking] = useState<string>('');
  const [Freight, setFreight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [noMatchingMessage, setNoMatchingMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const PONumRef = useRef<HTMLInputElement>(null);
  const SONumRef = useRef<HTMLInputElement>(null);

  const [selectedParts, setSelectedParts] = useState<DropShipPart[]>([]);

  useEffect(() => {
    agent.DropShip.getAllDropShipSalesReps().then((reps) =>
      setAllSalesReps(reps)
    );
  }, []);

  const handleGetRep = () => {
    if (SONum.trim() !== '') {
      agent.DropShip.getDropShipInfo(SONum.trim()).then((res) => {
        if (!res) {
          setAutoFillRep(null);
          if (noMatchingMessage === '')
            setNoMatchingMessage(
              'No Sales Rep found with this SO. Please add manually!'
            );
        } else {
          setAutoFillRep({ fullName: res.fullName, email: res.email });
        }
      });
    }
  };

  const handleSubmitForm = () => {
    if (PONum.trim() === '') {
      setAlertMessage('Please fill in PO#');
      PONumRef.current?.focus();
      return;
    } else if (SONum.trim() === '') {
      setAlertMessage('Please fill in SO#');
      SONumRef.current?.focus();
      return;
    } else if (selectedParts.length === 0) {
      setAlertMessage(
        'Please select at least one PartNumber/SerialNumber pair'
      );
      return;
    } else if (addedSalesReps.length === 0 && !autoFillRep) {
      setAlertMessage('Please select Sales Rep to send email');
      return;
    }

    setLoading(true);
    const recipientEmails = [
      autoFillRep?.email,
      ...addedSalesReps.map((sr) => sr.email),
    ].filter(Boolean) as string[];
    const recipientNames = [
      autoFillRep?.fullName,
      ...addedSalesReps.map((sr) => sr.fullName),
    ].filter(Boolean) as string[];

    agent.DropShip.dropShipSendEmail({
      subject: `Drop Ship Complete: SO#${SONum}`,
      senderUserName: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      recipientEmails: recipientEmails,
      recipientNames: recipientNames,
      PONumber: PONum,
      SONumber: SONum,
      PartNumbers: selectedParts.map((p) => p.partNumber),
      Quantities: selectedParts.length.toString(),
      SerialNumbers: selectedParts.map((p) => p.serialNumber),
      Tracking: Tracking,
      Freight: Freight,
    })
      .then(() => {
        document.location.reload();
      })
      .catch((error) => {
        console.error('Error sending drop ship email:', error);
        setAlertMessage('Error sending email. Please try again later.');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        pageName="Drop Ship"
        pageHref={ROUTE_PATHS.PURCHASING.DROPSHIP}
      />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Drop Ship Form
          </Typography>
          {alertMessage && (
            <Alert
              severity="error"
              onClose={() => setAlertMessage(null)}
              sx={{ mb: 2 }}
            >
              {alertMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="PO Number"
                variant="outlined"
                fullWidth
                value={PONum}
                onChange={(e) => setPONum(e.target.value)}
                required
                inputRef={PONumRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SO Number"
                variant="outlined"
                fullWidth
                value={SONum}
                onBlur={handleGetRep}
                onChange={(e) => setSONum(e.target.value)}
                required
                inputRef={SONumRef}
              />
            </Grid>
            {/* PartNumber/SerialNumber selection */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">
                      PartNumber/SerialNumber *
                    </Typography>
                    {selectedParts.length > 0 ? (
                      selectedParts.map((part, index) => (
                        <Chip
                          key={index}
                          label={`${part.partNumber} - SN: ${part.serialNumber}`}
                          color="primary"
                          onDelete={() =>
                            setSelectedParts(
                              selectedParts.filter(
                                (p) => p.serialNumber !== part.serialNumber
                              )
                            )
                          }
                          deleteIcon={<DeleteIcon />}
                          sx={{ m: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No parts selected.
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      textAlign: { xs: 'left', md: 'right' },
                      mt: { xs: 2, md: 0 },
                    }}
                  >
                    <PartNumberModal
                      selectedParts={selectedParts}
                      setSelectedParts={setSelectedParts}
                      poNo={PONum.trim() || undefined}
                      soNo={SONum.trim() || undefined}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Sales Rep selection */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">Sales Rep *</Typography>
                    {autoFillRep && (
                      <Chip
                        label={autoFillRep.fullName}
                        color="primary"
                        onDelete={() => setAutoFillRep(null)}
                        deleteIcon={<DeleteIcon />}
                        sx={{ m: 0.5 }}
                      />
                    )}
                    {addedSalesReps.map((rep, index) => (
                      <Chip
                        key={index}
                        label={rep.fullName}
                        color="primary"
                        onDelete={() =>
                          setAddedSalesReps(
                            addedSalesReps.filter((c) => c.email !== rep.email)
                          )
                        }
                        deleteIcon={<DeleteIcon />}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                    {addedSalesReps.length === 0 && !autoFillRep && (
                      <Typography variant="body2" color="error">
                        {noMatchingMessage}
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      textAlign: { xs: 'left', md: 'right' },
                      mt: { xs: 2, md: 0 },
                    }}
                  >
                    <RecipientModal
                      recipients={addedSalesReps}
                      setRecipients={setAddedSalesReps}
                      salesReps={allSalesReps}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Additional fields */}
            <Grid item xs={12}>
              <TextField
                label="Tracking"
                variant="outlined"
                fullWidth
                value={Tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Freight"
                variant="outlined"
                fullWidth
                value={Freight}
                onChange={(e) => setFreight(e.target.value)}
              />
            </Grid>
            {/* Submit button */}
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmitForm}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default DropShip;
