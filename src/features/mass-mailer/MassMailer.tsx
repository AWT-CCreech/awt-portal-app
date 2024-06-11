import React, { useState, useEffect, useContext } from 'react';
import EmailProperties from './EmailProperties';
import PartTable from './PartTable';
import EmailRecipient from './EmailRecipient';
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import agent from '../../app/api/agent';
import { useNavigate } from 'react-router-dom';
import UserInfo from '../../stores/userInfo';
import { observer } from 'mobx-react-lite';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import AppState from '../../stores/app';
import { trim } from 'lodash';
import PageHeader from '../../sharedComponents/PageHeader';
import {
  Box,
  Button,
  Container,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';

const MassMailer: React.FC = () => {
  const navigate = useNavigate();
  const { setUserName, setPassWord } = useContext(UserInfo);
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [selectedPartItems, setSelectedPartItems] = useState<IMassMailerPartItem[]>([]);
  const [recipients, setRecipients] = useState<IMassMailerVendor[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [attachFiles, setAttachFiles] = useState<string[]>([]);
  const [CC, setCC] = useState<IMassMailerUser[]>([]);
  const [allUsers, setAllUsers] = useState<IMassMailerUser[]>([]);
  const { pageLoading, setPageLoading } = useContext(AppState);

  useEffect(() => {
    agent.MassMailerUsers.getAll().then(setAllUsers);
    agent.MassMailerFileUpload.clear(localStorage.getItem('username') ?? '');
  }, []);

  useEffect(() => {
    agent.UserLogins.authenticate({
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      userid: localStorage.getItem('userid'),
      isPasswordEncrypted: true,
    }).then(response => {
      if (response.username === '') {
        localStorage.setItem('username', '');
        localStorage.setItem('userid', '');
        localStorage.setItem('password', '');
        setUserName('');
        setPassWord('');
        navigate('/Login');
      }
    });
  }, [navigate, setUserName, setPassWord]);

  const handleSendEmailClicked = () => {
    if (!trim(emailBody)) {
      alert('Please fill in email message!');
    } else if (!trim(emailSubject)) {
      alert('Please fill in email subject!');
    } else if (recipients.length === 0) {
      alert('Please select recipients for your email!');
    } else if (recipients.length > 25) {
      alert('Please select less than 25 recipients!');
    } else if (selectedPartItems.length === 0) {
      alert('Please select at least one part item to send email!');
    } else {
      setOpenConfirmation(true);
    }
  };

  const handleConfirm = () => {
    setPageLoading(true);

    let finalBody = '<p>' + emailBody + '</p>';
    finalBody = finalBody.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, '&nbsp;');
    finalBody += '<table>';
    finalBody += '<tr><th>Airway Part Number</th><th>Mfg Part Number</th><th>Part Description</th><th>Qty</th><th>Manufacturer</th><th>Rev</th></tr>';
    finalBody += '%%PARTTABLE%%</table>';

    const obj = {
      Subject: emailSubject,
      Body: finalBody,
      SenderUserName: localStorage.getItem('username'),
      RecipientIds: recipients.map(recipient => recipient.id),
      RecipientEmails: recipients.map(recipient => recipient.email),
      RecipientNames: recipients.map(recipient => recipient.contact),
      RecipientCompanies: recipients.map(recipient => recipient.company),
      AttachFiles: attachFiles,
      Password: localStorage.getItem('password'),
      CCEmails: CC.map(cc => cc.email),
      CCNames: CC.map(cc => cc.fullName),
      items: selectedPartItems,
    };

    agent.MassMailerEmailOuts.sendEmail(obj).then(() => {
      window.location.reload();
    });
  };

  const getConfirmationContent = (): string => {
    let confirmation = 'Are you sending email to: ';
    recipients.forEach((r, index) => {
      confirmation += r.email;
      if (index < recipients.length - 1) confirmation += '; ';
      else confirmation += '. ';
    });
    if (CC.length > 0) {
      confirmation += 'And CC to: ';
      CC.forEach((c, index) => {
        confirmation += c.email;
        if (index < CC.length - 1) confirmation += '; ';
        else confirmation += '.';
      });
    }
    return confirmation;
  };

  if (pageLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={80} />
      </Box>
    );

  return (
    <div>
      <PageHeader pageName="Mass Mailer" pageHref="/massmailer" />
      <Divider />
      <Container maxWidth="lg" sx={{ padding: '40px 100px' }}>
        <EmailProperties
          emailBody={emailBody}
          setEmailBody={setEmailBody}
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          attachFiles={attachFiles}
          setAttachFiles={setAttachFiles}
          CC={CC}
          setCC={setCC}
          allUsers={allUsers}
        />
        <PartTable selectedpartItems={selectedPartItems} setSelectedPartItems={setSelectedPartItems} />
        <EmailRecipient selectedVendors={recipients} setSelectedVendors={setRecipients} />
        <Container sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button variant="contained" color="error" size="large" onClick={handleSendEmailClicked}>
            Send Email
          </Button>
          <Dialog
            open={openConfirmation}
            onClose={() => setOpenConfirmation(false)}
          >
            <DialogTitle>Confirm Email</DialogTitle>
            <DialogContent>
              <DialogContentText>{getConfirmationContent()}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmation(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Container>
    </div>
  );
};

export default observer(MassMailer);
