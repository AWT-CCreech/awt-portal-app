import React, { useContext, FormEvent, useState, useEffect, useCallback } from 'react';
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
  Card as MuiCard,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import UserInfo from '../../stores/userInfo';
import agent from '../../app/api/agent';
import AppState from '../../stores/app';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginInfo from '../../models/Login/LoginInfo';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh', // Full viewport height
  padding: 20,
  position: 'relative',
  justifyContent: 'center', // Center vertically
  alignItems: 'center', // Center horizontally
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

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
      userid: '',
      username: localUsername,
      password: localPassword,
      isPasswordEncrypted: false,
      token: '',
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

        setUserName(response.username);
        setPassWord(response.password);

        setPageLoading(false);
        navigate('/');
      } else {
        console.error('Invalid response:', response);
        setPageLoading(false);
        setHiddenLoginError(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setPageLoading(false);
      setHiddenLoginError(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <LoginContainer>
        <Card variant="outlined">
          {/* Replace with your logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img src="logo.png" alt="Company Logo" style={{ width: '150px', height: 'auto' }} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            AWT Portal
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
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
              <Alert severity="error">Incorrect username or password</Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={pageLoading}
              sx={{ mt: 2 }}
            >
              {pageLoading ? <CircularProgress size={24} /> : 'Sign in'}
            </Button>
          </Box>
        </Card>
      </LoginContainer>
    </>
  );
});

export default LoginPage;
