import React, { useContext, FormEvent, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, CssBaseline, FormControl, Alert, TextField,
  Typography, CircularProgress, IconButton, InputAdornment,
  Stack, Card
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import axios from 'axios';

import UserInfo from '../../shared/stores/userInfo';
import AppState from '../../shared/stores/app';
import LoginInfo from '../../models/Login/LoginInfo';
import agent from '../../app/api/agent';
import '../../shared/styles/login/LoginPage.scss';

const LoginPage: React.FC = observer(() => {
  const userInfo = useContext(UserInfo);
  const { setUserName, setPassWord } = userInfo;
  const appState = useContext(AppState);
  const { pageLoading, setPageLoading } = appState;

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');

  const handleAutoLogout = useCallback(() => {
    localStorage.clear();
    setUserName('');
    setPassWord('');
    navigate('/login');
  }, [setUserName, setPassWord, navigate]);

  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      const timeout = setTimeout(handleAutoLogout, parseInt(expiresAt, 10) - Date.now());
      return () => clearTimeout(timeout);
    }
  }, [pageLoading, handleAutoLogout]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPageLoading(true);
    setErrorMessage('');

    const payload: LoginInfo = {
      userid: '',
      username: localUsername,
      password: localPassword,
      isPasswordEncrypted: false,
      token: '',
      refreshToken: ''
    };

    try {
      const response = await agent.UserLogins.authenticate(payload);

      if (response.token) {
        const { token, refreshToken, username, userid } = response;
        const expMs = JSON.parse(atob(token.split('.')[1])).exp * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('username', username);
        localStorage.setItem('password', response.password);
        localStorage.setItem('userid', userid);
        localStorage.setItem('expiresAt', expMs.toString());

        setUserName(username);
        setPassWord(response.password);

        navigate('/');
      } else {
        setErrorMessage('Incorrect username or password');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorMessage(
          err.response.status === 401
            ? 'Incorrect username or password'
            : err.response.data.message || 'Server error — try again later.'
        );
      } else {
        setErrorMessage('Network error — please try again.');
      }
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Stack className="login-container">
        <Card className="login-card">
          <Box className="logo-box"><img src="logo.png" alt="Logo" /></Box>
          <Typography variant="h4" className="login-title">AWT Portal</Typography>
          <Box component="form" onSubmit={handleSubmit} className="login-form">
            <FormControl fullWidth margin="normal">
              <TextField
                label="Username"
                required
                value={localUsername}
                onChange={e => setLocalUsername(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={localPassword}
                onChange={e => setLocalPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(prev => !prev)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </FormControl>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={pageLoading}
              endIcon={pageLoading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              Login
            </Button>
          </Box>
        </Card>
      </Stack>
    </>
  );
});

export default LoginPage;