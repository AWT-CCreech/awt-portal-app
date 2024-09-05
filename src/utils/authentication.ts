import { NavigateFunction } from 'react-router-dom';

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

export const handleLogOut = (
  navigate: NavigateFunction,
  setUserName: (u: string) => void,
  setPassWord: (p: string) => void
) => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  localStorage.removeItem('userid');

  setUserName('');
  setPassWord('');
  navigate('/login');
};
