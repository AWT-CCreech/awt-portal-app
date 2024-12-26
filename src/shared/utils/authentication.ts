import { NavigateFunction } from 'react-router-dom';

// Check if the user is authenticated
export const isAuthenticated = () => {
  const storageUser = localStorage.getItem('username');
  const storagePass = localStorage.getItem('password');
  const token = localStorage.getItem('token');

  return (
    storageUser !== '' &&
    storagePass !== '' &&
    storagePass !== null &&
    storageUser !== null &&
    token !== null &&
    token !== ''
  );
};

// Handle user logout and clear session
export const handleLogOut = (
  navigate: NavigateFunction,
  setUserName: Function,
  setPassWord: Function
): void => {
  console.log('Logging out');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  localStorage.removeItem('userid');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('lastRefresh');
  setUserName('');
  setPassWord('');

  // Set document title to Login when logging out
  document.title = 'AWT Portal | Login';

  navigate('/login');
};

// Auto logout due to inactivity or token expiration
export const handleAutoLogout = (
  navigate: NavigateFunction,
  onLogout: Function,
  setPassWord: Function
) => {
  console.log('Auto logout triggered due to inactivity');
  onLogout(); // Clear session and perform any additional logout logic
  navigate('/login'); // Redirect to the login page
};
