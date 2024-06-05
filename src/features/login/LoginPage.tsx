import React, { useContext, useEffect, FormEvent, useState } from 'react';
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageLoading(true);
    agent.UserLogins.authenticate({ username, password, isPasswordEncrypted: false }).then(response => {
      setPageLoading(false);
      localStorage.setItem('username', response.username);
      localStorage.setItem('password', response.password);
      localStorage.setItem('userid', response.userid);
      if (response.username === '' && response.password === '') {
        setHiddenLoginError(false);
      } else {
        navigate('/');
      }
    });
  };

  if (pageLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(LoginPage);
