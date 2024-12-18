// React and Hooks
import React, { useState, useEffect } from 'react';

// Components
import EmailProperties from './EmailProperties';
import PartTable from './PartTable';
import EmailRecipient from './EmailRecipient';
import PageHeader from '../../components/PageHeader';
import { ROUTE_PATHS } from '../../routes';

// Models
import { IMassMailerPartItem } from '../../models/MassMailer/MassMailerPartItem';
import { IMassMailerVendor } from '../../models/MassMailer/MassMailerVendor';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';

// API
import agent from '../../app/api/agent';

// State Management
import { observer } from 'mobx-react-lite';

// Utilities
import { trim } from 'lodash';

// MUI Components
import {
  Box,
  ClickAwayListener,
  Grid,
  Fab,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const MassMailer: React.FC = () => {
  // Form State Variables
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [selectedPartItems, setSelectedPartItems] = useState<IMassMailerPartItem[]>([]);
  const [recipients, setRecipients] = useState<IMassMailerVendor[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [CC, setCC] = useState<IMassMailerUser[]>([]);
  const [allUsers, setAllUsers] = useState<IMassMailerUser[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('None');

  // UI State Variables
  const [buttonState, setButtonState] = useState<'default' | 'confirm' | 'loading' | 'success' | 'error'>('default');

  // New State Variable to Reset Recipients
  const [resetRecipients, setResetRecipients] = useState<boolean>(false);

  useEffect(() => {
    // Fetch all users on component mount
    agent.MassMailer.Users.getAll().then(setAllUsers);

    // Clear any existing file uploads for the current user
    const username = localStorage.getItem('username') ?? '';
    agent.MassMailer.FileUpload.clear(username);
  }, []);

  /**
   * Handles the primary button click.
   * - If buttonState is 'default', validates the form and enters confirmation mode.
   * - If buttonState is 'confirm', proceeds to send the email.
   */
  const handleButtonClick = () => {
    if (buttonState === 'default') {
      // Validate form fields
      if (!trim(emailBody)) {
        alert('Please fill in the email message!');
        return;
      }
      if (!trim(emailSubject)) {
        alert('Please fill in the email subject!');
        return;
      }
      if (recipients.length === 0) {
        alert('Please select recipients for your email!');
        return;
      }
      if (recipients.length > 25) {
        alert('Please select less than 25 recipients!');
        return;
      }
      if (selectedPartItems.length === 0) {
        alert('Please select at least one part item to send email!');
        return;
      }

      // Enter confirmation mode
      setButtonState('confirm');
    } else if (buttonState === 'confirm') {
      // Proceed to send the email
      handleConfirm();
    }
  };

  /**
   * Sends the email using the API and handles success/error responses.
   */
  const handleConfirm = () => {
    setButtonState('loading');

    // Prepare the email body with HTML formatting
    let finalBody = `<p>${emailBody}</p>`;
    finalBody = finalBody
      .replace(/(?:\r\n|\r|\n)/g, '<br/>')
      .replace(/ /g, '&nbsp;');
    finalBody += '<table>';
    // finalBody +=
    //   '<tr><th>Airway Part Number</th><th>Mfg Part Number</th><th>Part Description</th><th>Qty</th><th>Manufacturer</th><th>Rev</th></tr>';
    finalBody += '%%PARTTABLE%%</table>';

    // Construct the payload object
    const obj = {
      Subject: emailSubject,
      Body: finalBody,
      UserName: localStorage.getItem('username') ?? '',
      Password: localStorage.getItem('password') ?? '',
      RecipientIds: recipients.map((recipient) => recipient.id),
      ToEmails: recipients.map((recipient) => recipient.email),
      RecipientNames: recipients.map((recipient) => recipient.contact),
      RecipientCompanies: recipients.map((recipient) => recipient.company),
      Attachments: attachments,
      CCEmails: CC.map((cc) => cc.email),
      CCNames: CC.map((cc) => cc.fullName),
      items: selectedPartItems,
    };

    // Send the email via API
    agent.MassMailer.EmailOuts.sendEmail(obj)
      .then(() => {
        // On success, update button state and reset form
        setButtonState('success');
        resetForm();

        // Revert button to default after 3 seconds
        setTimeout(() => {
          setButtonState('default');
        }, 3000);
      })
      .catch((error) => {
        // On failure, update button state
        console.error(error);
        setButtonState('error');

        // Revert button to default after 3 seconds
        setTimeout(() => {
          setButtonState('default');
        }, 3000);
      });
  };

  /**
   * Resets all form fields to their initial states, including the email template.
   */
  const resetForm = () => {
    setEmailBody('');
    setEmailSubject('');
    setSelectedPartItems([]);
    setRecipients([]);
    setAttachments([]);
    setCC([]);
    setSelectedTemplate('None'); // Reset the template to 'None'

    // Trigger Reset of Recipients in EmailRecipient Component
    setResetRecipients((prev) => !prev);
  };

  /**
   * Resets the button state to default when clicking away during confirmation.
   */
  const handleClickAway = () => {
    if (buttonState === 'confirm') {
      setButtonState('default');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        pageName="Mass Mailer"
        pageHref={ROUTE_PATHS.PURCHASING.MASS_MAILER}
      />

      {/* Main Content */}
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={3}>
          {/* Left Column: Email Properties and Part Table */}
          <Grid item xs={12} md={6}>
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
          </Grid>

          {/* Right Column: Email Recipient */}
          <Grid item xs={12} md={6}>
            <EmailRecipient
              selectedVendors={recipients}
              setSelectedVendors={setRecipients}
              resetRecipients={resetRecipients}
            />
          </Grid>
        </Grid>

        {/* Send Email Button with ClickAwayListener */}
        <ClickAwayListener onClickAway={handleClickAway}>
          {/* Floating Action Button */}
          <Fab
            onClick={handleButtonClick}
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
      </Box>
    </div>
  );
};

export default observer(MassMailer);
