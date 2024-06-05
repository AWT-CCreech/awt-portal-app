import React, { useContext, FormEvent, useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserInfo from '../../stores/userInfo';
import agent from '../../app/api/agent';
import AppState from '../../stores/app';

const LoginPage: React.FC = () => {
  const userInfo = useContext(UserInfo);
  const { username, password, setUserName, setPassWord } = userInfo;
  const appState = useContext(AppState);
  const { pageLoading, setPageLoading } = appState;
  const [hiddenLoginError, setHiddenLoginError] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageLoading(true);
    try {
      const response = await agent.UserLogins.authenticate({
        username,
        password,
        isPasswordEncrypted: false,
        userid: "", // Ensure this field is included if required
      });
      setPageLoading(false);
      localStorage.setItem('username', response.username);
      localStorage.setItem('password', response.password);
      localStorage.setItem('userid', response.userid);
      if (response.username === '' && response.password === '') {
        setHiddenLoginError(false);
      } else {
        navigate('/');
      }
    } catch (error) {
      setPageLoading(false);
      console.error('Error during authentication:', error);
      setHiddenLoginError(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Log-in to your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassWord(e.target.value)}
          />
          {!hiddenLoginError && (
            <Alert severity="error">Username or Password is not correct</Alert>
          )}
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              disabled={pageLoading} // Disable button while loading
            >
              {pageLoading ? ' ' : 'Login'}
            </Button>
            {pageLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(LoginPage);
