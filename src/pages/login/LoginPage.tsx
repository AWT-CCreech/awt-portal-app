// React and Hooks
import React, { useContext, FormEvent, useState, useEffect, useCallback } from 'react';

// MUI Components and Icons
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  Alert,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';

// Routing
import { useNavigate } from 'react-router-dom';

// State Management
import { observer } from 'mobx-react-lite';
import UserInfo from '../../stores/userInfo';
import AppState from '../../stores/app';

// Models
import LoginInfo from '../../models/Login/LoginInfo';

// API
import agent from '../../app/api/agent';

// Styles
import '../../styles/login/LoginPage.css';

const LoginPage: React.FC = observer(() => {
  const userInfo = useContext(UserInfo);
  const { setUserName, setPassWord } = userInfo;
  const appState = useContext(AppState);
  const { pageLoading, setPageLoading } = appState;

  const [hiddenLoginError, setHiddenLoginError] = useState(true);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Local state for inputs
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');

  const handleAutoLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('userid');
    localStorage.removeItem('expiresAt');
    setUserName('');
    setPassWord('');
    navigate('/login');
  }, [setUserName, setPassWord, navigate]);

  useEffect(() => {
    const tokenExpiry = localStorage.getItem('expiresAt');
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = Date.now();

      if (expiryTime > currentTime) {
        const timeout = setTimeout(() => handleAutoLogout(), expiryTime - currentTime);
        return () => clearTimeout(timeout);
      } else {
        handleAutoLogout();
      }
    }
  }, [pageLoading, handleAutoLogout]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageLoading(true);
    setHiddenLoginError(true);

    const loginPayload: LoginInfo = {
      userid: '',
      username: localUsername,
      password: localPassword,
      isPasswordEncrypted: false,
      token: '',
    };

    try {
      const response = await agent.UserLogins.authenticate(loginPayload);

      if (response && response.token) {
        const token = response.token;
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = tokenPayload.exp * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('password', response.password);
        localStorage.setItem('userid', response.userid);
        localStorage.setItem('expiresAt', expiresAt.toString());

        setUserName(response.username);
        setPassWord(response.password);

        setPageLoading(false);
        navigate('/');
      } else {
        setPageLoading(false);
        setHiddenLoginError(false);
      }
    } catch (error) {
      setPageLoading(false);
      setHiddenLoginError(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Stack className="login-container">
        <MuiCard className="login-card" variant="outlined">
          <Box className="logo-box">
            <img src="logo.png" alt="Company Logo" />
          </Box>
          <Typography component="h1" variant="h4" className="login-title">
            AWT Portal
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
            <FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={localPassword}
                onChange={(e) => setLocalPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            {!hiddenLoginError && (
              <Alert severity="error" className="login-error-alert">
                Incorrect username or password
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={pageLoading}
              endIcon={!pageLoading && <Login />}
              className="submit-button"
            >
              {pageLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </MuiCard>
      </Stack>
    </>
  );
});

export default LoginPage;
