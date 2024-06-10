import React, { useContext, FormEvent, useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserInfo from '../../stores/userInfo';
import agent from '../../app/api/agent';
import AppState from '../../stores/app';
import { styled } from '@mui/system';

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

const LoginPage: React.FC = () => {
  const userInfo = useContext(UserInfo);
  const { username, password, setUserName, setPassWord } = userInfo;
  const appState = useContext(AppState);
  const { pageLoading, setPageLoading } = appState;
  const [hiddenLoginError, setHiddenLoginError] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading state changed:', pageLoading);
  }, [pageLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form...');
    setPageLoading(true);
    console.log('Loading state set to true');
    setHiddenLoginError(true);
    try {
      const response = await agent.UserLogins.authenticate({
        username,
        password,
        isPasswordEncrypted: false,
        userid: "", // Ensure this field is included if required
      });
      console.log('Authentication successful:', response);
      localStorage.setItem('username', response.username);
      localStorage.setItem('password', response.password);
      localStorage.setItem('userid', response.userid);
      setPageLoading(false);
      console.log('Loading state set to false');
      if (response.username === '' && response.password === '') {
        setHiddenLoginError(false);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setPageLoading(false);
      setHiddenLoginError(false);
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
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={pageLoading} // Disable button while loading
              >
                {pageLoading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          </Box>
        </LoginContainer>
      </FlexContainer>
    </MainContainer>
  );
};

export default observer(LoginPage);
