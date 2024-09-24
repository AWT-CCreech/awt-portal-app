import React, { useContext, FormEvent, useState, useEffect, useCallback } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Divider, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserInfo from '../../stores/userInfo';
import agent from '../../app/api/agent';
import AppState from '../../stores/app';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginInfo from '../../models/Login/LoginInfo';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
}));

const MainContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  height: '100vh',
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const AppLogo = () => (
  <img src="logo.png" alt="Company Logo" style={{ width: '150px', height: 'auto' }} />
);

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
    console.log('Auto logout triggered');
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
    console.log('Loading state changed:', pageLoading);

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
      userid: "",
      username: localUsername,
      password: localPassword,
      isPasswordEncrypted: false,
      token: ""
    };

    try {
      const response = await agent.UserLogins.authenticate(loginPayload);
      console.log('Backend response:', response);

      if (response && response.token) {
        const token = response.token;
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = tokenPayload.exp * 1000; 

        localStorage.setItem('token', token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('password', response.password);
        localStorage.setItem('userid', response.userid);
        localStorage.setItem('expiresAt', expiresAt.toString());

        setUserName(response.username); // Set username in the context
        setPassWord(response.password); // Set password in the context

        setPageLoading(false); 
        navigate('/'); // Redirect to home page after successful login
      } else {
        console.error('Invalid response:', response);
        setPageLoading(false);
        setHiddenLoginError(false); // Show error message
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setPageLoading(false);
      setHiddenLoginError(false); // Show error message
    }
  };

  return (
    <MainContainer>
      <FlexContainer>
        <LogoContainer>
          <AppLogo />
        </LogoContainer>
        <Divider orientation="vertical" flexItem sx={{ height: 'auto' }} />
        <LoginContainer>
          <Typography component="h1" variant="h5">
            AWT Portal
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
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
            />
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
            {!hiddenLoginError && (
              <Alert severity="error">Username or Password is not correct</Alert>
            )}
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={pageLoading}
              >
                {pageLoading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          </Box>
        </LoginContainer>
      </FlexContainer>
    </MainContainer>
  );
});

export default LoginPage;
