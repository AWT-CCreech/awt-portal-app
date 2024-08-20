import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Tooltip,
  Popover
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import agent from '../../app/api/agent';
import { IMassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import SelectedFile from './components/SelectedFile';
import CcPopUp from './CCPopUp';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import AddCC from './AddCC';
import '../styles/mass-mailer/EmailProperties.css';

interface IProps {
  emailBody: string;
  setEmailBody: (body: string) => void;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  attachFiles: string[];
  setAttachFiles: (files: string[]) => void;
  CC: IMassMailerUser[];
  setCC: (users: IMassMailerUser[]) => void;
  allUsers: IMassMailerUser[];
}

const EmailProperties: React.FC<IProps> = ({
  emailBody,
  setEmailBody,
  emailSubject,
  setEmailSubject,
  attachFiles,
  setAttachFiles,
  CC,
  setCC,
  allUsers,
}) => {
  const noneTemplate = useMemo(
    () => ({
      id: 0,
      emailType: '',
      emailDesc: 'None',
      emailSubject: '',
      emailBody: '',
      active: true,
      defaultMsg: false,
      enteredBy: '',
      entryDate: '',
      modifiedBy: '',
      modifiedDate: '',
    }),
    []
  );

  const [selectedTemplate, setSelectedTemplate] = useState('None');
  const [templatesForUser, setTemplatesForUser] = useState<IMassMailerEmailTemplate[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([{ key: 0, value: 'None', text: 'None' }]);
  const ref = useRef<HTMLInputElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      agent.MassMailer.EmailTemplates.templatesForUser(user).then((response) => {
        const options = response.map((template: IMassMailerEmailTemplate) => ({
          key: template.id,
          value: template.emailDesc,
          text: template.emailDesc,
        }));
        setTemplateOptions([{ key: 0, value: 'None', text: 'None' }, ...options]);
        setTemplatesForUser(response);
      });
    }
  }, []);

  useEffect(() => {
    if (selectedTemplate === 'None') {
      setEmailBody(noneTemplate.emailBody);
      setEmailSubject(noneTemplate.emailSubject);
    } else {
      const selectedTemplateObj = templatesForUser.find((template) => template.emailDesc === selectedTemplate);
      if (selectedTemplateObj) {
        setEmailBody(selectedTemplateObj.emailBody);
        setEmailSubject(selectedTemplateObj.emailSubject);
      }
    }
  }, [selectedTemplate, templatesForUser, setEmailBody, setEmailSubject, noneTemplate]);

  const handleTemplateChange = (event: any) => {
    const value = event.target.value;
    setSelectedTemplate(value);
  };

  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      formData.set('username', localStorage.getItem('username') ?? '');

      agent.MassMailer.FileUpload.upload(formData).then((attachments) => {
        const temp = [...attachFiles];
        attachments.forEach((attachment) => {
          if (!attachFiles.includes(attachment)) temp.push(attachment);
        });
        setAttachFiles(temp);
      });
    }
  };

  const unselectFile = (fileName: string) => {
    setAttachFiles(attachFiles.filter((f) => f !== fileName));
  };

  return (
    <Box className="email-properties-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="email-properties-item">
            <Box className="email-properties-label">
              <Typography variant="subtitle1">Template</Typography>
            </Box>
            <FormControl fullWidth className="email-properties-formcontrol">
              <Select id="template" value={selectedTemplate} onChange={handleTemplateChange}>
                {templateOptions.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className="email-properties-item">
            <Box className="email-properties-label">
              <Typography variant="subtitle1">Subject</Typography>
            </Box>
            <TextField
              fullWidth
              value={emailSubject}
              onChange={(event) => setEmailSubject(event.target.value)}
              margin="normal"
              className="email-properties-textfield"
            />
          </Box>
          <Box className="email-properties-cc">
            <CcPopUp CC={CC} setCC={setCC} allUsers={allUsers} />
            <Box className="email-properties-addcc">
              <AddCC CC={CC} setCC={setCC} />
            </Box>
          </Box>
          {CC.map((selected, index) => (
            <Chip
              key={index}
              label={selected.fullName.trim() === '' ? selected.email : selected.fullName}
              color="success"
              onDelete={() => setCC(CC.filter((c) => c.email !== selected.email))}
              deleteIcon={<DeleteIcon />}
              className="email-properties-chip"
            />
          ))}
          <Box className="email-properties-attach">
            <Button
              variant="contained"
              color="primary"
              onClick={() => ref?.current?.click()}
              startIcon={<AttachFileIcon />}
            >
              Attach File(s)
            </Button>
            <input ref={ref} type="file" hidden multiple onChange={handleAttachFiles} />
          </Box>
          {attachFiles.map((fileName) => (
            <SelectedFile key={fileName} fileName={fileName} unselect={unselectFile} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Container className="container-centered">
            <Box className="email-properties-item">
              <Box className="email-properties-label">
                <Typography variant="subtitle1">Message</Typography>
              </Box>
              <Tooltip title="Help" className="email-properties-tooltip">
                <IconButton onClick={handlePopoverOpen}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Popover
              id="help-popover"
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Typography className="popup-content">
                %fullname% for recipient's full name<br />
                %firstname% for recipient's first name<br />
                %lastname% for recipient's last name
              </Typography>
            </Popover>
            <textarea
              id="emailBody"
              rows={12}
              cols={92}
              value={emailBody}
              placeholder="Type your email body here..."
              onChange={(event) => setEmailBody(event.target.value)}
              className="email-body-textarea"
            />
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailProperties;
