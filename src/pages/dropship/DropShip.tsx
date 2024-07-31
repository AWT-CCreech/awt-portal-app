import React, { useEffect, useState, useRef } from 'react';
import { Container, Grid, Box, Chip, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import agent from '../../app/api/agent';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import PageHeader from '../../components/PageHeader';
import RecipientPopUp from './RecipientPopUp';

const DropShip = () => {
  const [allSalesReps, setAllSalesReps] = useState<IMassMailerUser[]>([]);
  const [autoFillRep, setAutoFillRep] = useState<IMassMailerUser | null>();
  const [addedSalesReps, setAddedSalesReps] = useState<IMassMailerUser[]>([]);
  const [SONum, setSONum] = useState<string>("");
  const [PONum, setPONum] = useState<string>("");
  const [PartNum, setPartNum] = useState<string>("");
  const [Qty, setQty] = useState<string>("");
  const [Tracking, setTracking] = useState<string>("");
  const [SerialNum, setSerialNum] = useState<string>("");
  const [Freight, setFreight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [noMatchingMessage, setNoMatchingMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const PONumRef = useRef<HTMLInputElement>(null);
  const SONumRef = useRef<HTMLInputElement>(null);
  const PartNumRef = useRef<HTMLInputElement>(null);
  const QtyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    agent.DropShip.getAllDropShipSalesReps().then(allSalesReps => setAllSalesReps(allSalesReps));
  }, []);

  const handleGetRep = () => {
    if (SONum.trim() !== "") {
      agent.DropShip.getDropShipInfo(SONum.trim()).then(res => {
        if (!res) {
          setAutoFillRep(null);
          if (noMatchingMessage === "") setNoMatchingMessage("No Sales Rep found with this SO. Please add manually!");
        } else {
          setAutoFillRep({ fullName: res.fullName, email: res.email });
        }
      });
    }
  };

  const handleSubmitForm = () => {
    if (PONum.trim() === "") {
      setAlertMessage("Please fill in PO#");
      PONumRef.current?.focus();
      return;
    } else if (SONum.trim() === "") {
      setAlertMessage("Please fill in SO#");
      SONumRef.current?.focus();
      return;
    } else if (PartNum.trim() === "") {
      setAlertMessage("Please fill in Part Number");
      PartNumRef.current?.focus();
      return;
    } else if (Qty.trim() === "") {
      setAlertMessage("Please fill in Quantity");
      QtyRef.current?.focus();
      return;
    } else if (addedSalesReps.length === 0 && !autoFillRep) {
      setAlertMessage("Please select Sales Rep to send email");
      return;
    }

    setLoading(true);
    const recipientEmails = [autoFillRep?.email, ...addedSalesReps.map(sr => sr.email)].filter(Boolean) as string[];
    const recipientNames = [autoFillRep?.fullName, ...addedSalesReps.map(sr => sr.fullName)].filter(Boolean) as string[];

    agent.DropShip.sendDropShipEmail({
      subject: `Drop Ship Complete: SO#${SONum}`,
      senderUserName: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      recipientEmails: recipientEmails,
      recipientNames: recipientNames,
      PONumber: PONum,
      SONumber: SONum,
      PartNumber: PartNum,
      Quantity: Qty,
      Tracking: Tracking,
      SerialNumber: SerialNum,
      Freight: Freight
    }).then(() => {
      document.location.reload();
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div>
      <PageHeader pageName="Drop Ship" pageHref="/dropship" />
      <Container>
        <Box my={4}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6">Drop Ship Form</Typography>
              {alertMessage && (
                <Alert severity="error" onClose={() => setAlertMessage(null)}>{alertMessage}</Alert>
              )}
              <Box my={2}>
                <TextField
                  label="PO Number"
                  variant="outlined"
                  fullWidth
                  value={PONum}
                  onChange={(e) => setPONum(e.target.value)}
                  required
                  inputRef={PONumRef}
                />
              </Box>
              <Box my={2}>
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
              </Box>
              <Box my={2}>
                <TextField
                  label="Part Number"
                  variant="outlined"
                  fullWidth
                  value={PartNum}
                  onChange={(e) => setPartNum(e.target.value)}
                  required
                  inputRef={PartNumRef}
                />
              </Box>
              <Box my={2}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  value={Qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                  inputRef={QtyRef}
                />
              </Box>
              <Box my={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={8}>
                    <Typography variant="body1">Sales Rep *</Typography>
                    {autoFillRep && (
                      <Chip
                        label={autoFillRep.fullName}
                        color="success"
                        onDelete={() => setAutoFillRep(null)}
                        deleteIcon={<DeleteIcon />}
                        sx={{ m: 1 }}
                      />
                    )}
                    {addedSalesReps.map((rep, index) => (
                        <Chip
                          key={index}
                          label={rep.fullName}
                          color="success"
                          onDelete={() => setAddedSalesReps(addedSalesReps.filter(c => c.email !== rep.email))}
                          deleteIcon={<DeleteIcon />}
                          sx={{ m: 1 }}
                        />
                    ))}
                    {addedSalesReps.length === 0 && !autoFillRep && (
                      <Typography variant="body2" color="error">{noMatchingMessage}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'right' }}>
                    <RecipientPopUp recipients={addedSalesReps} setRecipients={setAddedSalesReps} salesReps={allSalesReps} />
                  </Grid>
                </Grid>
              </Box>
              <Box my={2}>
                <TextField
                  label="Tracking"
                  variant="outlined"
                  fullWidth
                  value={Tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
              </Box>
              <Box my={2}>
                <TextField
                  label="Freight"
                  variant="outlined"
                  fullWidth
                  value={Freight}
                  onChange={(e) => setFreight(e.target.value)}
                />
              </Box>
              <Box textAlign="center" my={4}>
                <Button variant="contained" color="success" size="large" onClick={handleSubmitForm}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default DropShip;
