import React, { useState, useEffect } from 'react';

// Components
import EmailProperties from './EmailProperties';
import PartTable from './PartTable';
import EmailRecipient from './EmailRecipient';
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';

// Models
import { MassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { MassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import { User } from '../../models/User';

// API
import agent from '../../app/api/agent';

// State Management
import { observer } from 'mobx-react-lite';

// Utilities
import { trim } from 'lodash';

// MUI Components
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import Grid2 from '@mui/material/Grid2';

import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';

// Import the History modal component
import History from './History';

const MassMailer: React.FC = () => {
  // Form State Variables
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [selectedPartItems, setSelectedPartItems] = useState<MassMailerPartItem[]>([]);
  const [recipients, setRecipients] = useState<MassMailerVendor[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [CC, setCC] = useState<IMassMailerUser[]>([]);
  // For the CC list: fetch all active users (transformed to IMassMailerUser)
  const [allUsers, setAllUsers] = useState<IMassMailerUser[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('None');

  // UI State Variables
  const [buttonState, setButtonState] = useState<'default' | 'confirm' | 'loading' | 'success' | 'error'>('default');
  const [resetRecipients, setResetRecipients] = useState<boolean>(false);
  // State for opening the History modal
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  // State for mass mailer users (for the History modal)
  const [massMailerUsers, setMassMailerUsers] = useState<IMassMailerUser[]>([]);

  // Retrieve the current username from localStorage
  const currentUsername = localStorage.getItem('username') ?? '';

  useEffect(() => {
    // Fetch all active users (full User model) then transform to IMassMailerUser for CC.
    agent.Users.getActive().then((users: User[]) => {
      const transformed: IMassMailerUser[] = users.map(u => ({
        fullName: `${u.fname} ${u.lname}`,
        email: (u.email ?? '').toLowerCase(),
        // For this example, we'll assume userName is the same as fullName.
        userName: `${u.fname} ${u.lname}`,
      }));
      setAllUsers(transformed);
    });

    // Fetch mass mailer users (for the History modal)
    agent.Users.getMassMailer().then(setMassMailerUsers);

    // Clear any existing file uploads for the current user.
    agent.MassMailer.FileUpload.clear(currentUsername);
  }, [currentUsername]);

  const handleSendClick = () => {
    if (buttonState === 'default') {
      if (!trim(emailBody)) { alert('Please fill in the email message!'); return; }
      if (!trim(emailSubject)) { alert('Please fill in the email subject!'); return; }
      if (recipients.length === 0) { alert('Please select recipients for your email!'); return; }
      if (recipients.length > 25) { alert('Please select less than 25 recipients!'); return; }
      if (selectedPartItems.length === 0) { alert('Please select at least one part item to send email!'); return; }
      setButtonState('confirm');
    } else if (buttonState === 'confirm') {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    setButtonState('loading');
    let finalBody = `<p>${emailBody}</p>`;
    finalBody = finalBody.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, '&nbsp;');
    finalBody += '<table>';
    finalBody += '%%PARTTABLE%%</table>';
    const obj = {
      Subject: emailSubject,
      Body: finalBody,
      UserName: currentUsername,
      Password: localStorage.getItem('password') ?? '',
      RecipientIds: recipients.map(r => r.id),
      ToEmails: recipients.map(r => r.email),
      RecipientNames: recipients.map(r => r.contact),
      RecipientCompanies: recipients.map(r => r.company),
      Attachments: attachments,
      CCEmails: CC.map(c => c.email),
      CCNames: CC.map(c => c.fullName),
      items: selectedPartItems,
    };
    agent.MassMailer.EmailOuts.sendEmail(obj)
      .then(() => {
        setButtonState('success');
        resetForm();
        setTimeout(() => setButtonState('default'), 3000);
      })
      .catch((error) => {
        console.error(error);
        setButtonState('error');
        setTimeout(() => setButtonState('default'), 3000);
      });
  };

  const resetForm = () => {
    setEmailBody('');
    setEmailSubject('');
    setSelectedPartItems([]);
    setRecipients([]);
    setAttachments([]);
    setCC([]);
    setSelectedTemplate('None');
    setResetRecipients(prev => !prev);
  };

  const handleClickAway = () => {
    if (buttonState === 'confirm') {
      setButtonState('default');
    }
  };

  return (
    <div>
      <PageHeader pageName="Mass Mailer" pageHref={ROUTE_PATHS.PURCHASING.MASS_MAILER} />
      <Box sx={{ padding: '20px' }}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EmailProperties
              emailBody={emailBody}
              setEmailBody={setEmailBody}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              attachments={attachments}
              setAttachments={setAttachments}
              CC={CC}
              setCC={setCC}
              allUsers={allUsers}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
            <Box sx={{ marginTop: 3 }}>
              <PartTable
                selectedpartItems={selectedPartItems}
                setSelectedPartItems={setSelectedPartItems}
              />
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <EmailRecipient
              selectedVendors={recipients}
              setSelectedVendors={setRecipients}
              resetRecipients={resetRecipients}
            />
          </Grid2>
        </Grid2>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Fab
            onClick={handleSendClick}
            sx={{
              position: 'fixed',
              color: 'white',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              backgroundColor:
                buttonState === 'success'
                  ? 'success.main'
                  : buttonState === 'error'
                    ? 'error.main'
                    : 'primary.main',
              '&:hover': {
                backgroundColor:
                  buttonState === 'success'
                    ? 'success.dark'
                    : buttonState === 'error'
                      ? 'error.dark'
                      : 'primary.dark',
              },
            }}
          >
            {buttonState === 'loading' ? (
              <CircularProgress color="inherit" />
            ) : buttonState === 'confirm' ? (
              <ThumbUpAltIcon />
            ) : buttonState === 'success' ? (
              <CheckIcon />
            ) : buttonState === 'error' ? (
              <CloseIcon />
            ) : (
              <SendIcon />
            )}
          </Fab>
        </ClickAwayListener>
        <Fab
          onClick={() => setOpenHistory(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 100,
            zIndex: 1000,
            backgroundColor: 'secondary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          <HistoryIcon />
        </Fab>
      </Box>
      <History
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        massMailerUsers={massMailerUsers}
        defaultUsername={currentUsername}
      />
    </div>
  );
};

export default observer(MassMailer);
