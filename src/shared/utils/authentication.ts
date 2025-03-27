import { NavigateFunction } from 'react-router-dom';

// Returns true only if a valid, unexpired JWT exists in localStorage
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const expMs = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    return Date.now() < expMs;
  } catch {
    return false;
  }
};

// Clears session and navigates to login
export const handleLogOut = (
  navigate: NavigateFunction,
  setUserName: Function,
  setPassWord: Function
): void => {
  console.log('Logging out');
  localStorage.clear();
  setUserName('');
  setPassWord('');
  document.title = 'AWT Portal | Login';
  navigate('/login', { replace: true });
};

// Auto‑logout (timer or token expiry)
export const handleAutoLogout = (
  navigate: NavigateFunction,
  setUserName: Function,
  setPassWord: Function
) => {
  console.log('Auto logout triggered');
  handleLogOut(navigate, setUserName, setPassWord);
};
