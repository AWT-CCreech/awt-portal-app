import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  Tooltip
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import agent from '../../app/api/agent';
import { IMassMailerEmailTemplate } from '../../models/MassMailer/MassMailerEmailTemplate';
import SelectedFile from './components/SelectedFile';
import CcPopUp from './CCPopUp';
import IMassMailerUser from '../../models/MassMailer/MassMailerUser';
import AddCC from './AddCC';
import './EmailProperties.css';

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
  const noneTemplate: IMassMailerEmailTemplate = {
    id: 0,
    emailType: '',
    emailDesc: '',
    emailSubject: '',
    emailBody: '',
    active: true,
    defaultMsg: false,
    enteredBy: '',
    entryDate: '',
    modifiedBy: '',
    modifiedDate: '',
  };

  const [selectedTemplate, setSelectedTemplate] = useState<IMassMailerEmailTemplate>(noneTemplate);
  const [templatesForUser, setTemplatesForUser] = useState<IMassMailerEmailTemplate[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      agent.MassMailerEmailTemplates.templatesForUser(user).then((response) => {
        const options: any = [{ key: 0, value: 'None', text: 'None' }];
        const temp: IMassMailerEmailTemplate[] = [];
        response.forEach((template) => {
          options.push({ key: template.id, value: template.emailDesc, text: template.emailDesc });
          temp.push(template);
        });
        setTemplateOptions(options);
        setTemplatesForUser(temp);
      });
    }
  }, []);

  useEffect(() => {
    setEmailBody(selectedTemplate.emailBody);
    setEmailSubject(selectedTemplate.emailSubject);
  }, [selectedTemplate, setEmailBody, setEmailSubject]);

  const handleTemplateChange = (event: any) => {
    const value = event.target.value;
    const temp = templatesForUser.find((t) => t.emailDesc === value);
    if (temp) setSelectedTemplate(temp);
    else setSelectedTemplate(noneTemplate);
  };

  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      formData.set('username', localStorage.getItem('username') ?? '');

      agent.MassMailerFileUpload.upload(formData).then((attachments) => {
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
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Message Template</InputLabel>
            <Select id="template" value={selectedTemplate.emailDesc} onChange={handleTemplateChange}>
              {templateOptions.map((option) => (
                <MenuItem key={option.key} value={option.text}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Subject"
            value={emailSubject}
            onChange={(event) => setEmailSubject(event.target.value)}
            margin="normal"
          />
          <CcPopUp CC={CC} setCC={setCC} allUsers={allUsers} />
          <AddCC CC={CC} setCC={setCC} />
          {CC.map((selected, index) => (
            <Chip
              key={index}
              label={selected.fullName.trim() === '' ? selected.email : selected.fullName}
              color="success"
              onDelete={() => setCC(CC.filter((c) => c.email !== selected.email))}
              deleteIcon={<DeleteIcon />}
              style={{ margin: '8px' }}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => ref?.current?.click()}
            startIcon={<AddCircleIcon />}
            style={{ marginTop: '16px' }}
          >
            Attach File(s)
          </Button>
          <input ref={ref} type="file" hidden multiple onChange={handleAttachFiles} />
          {attachFiles.map((fileName) => (
            <SelectedFile key={fileName} fileName={fileName} unselect={unselectFile} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Container className="container-centered">
            <Typography variant="h6" component="div">
              Message
              <Tooltip title="Help">
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <textarea
              id="emailBody"
              rows={12}
              cols={92}
              value={emailBody}
              placeholder="Type your email body here..."
              onChange={(event) => setEmailBody(event.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailProperties;
