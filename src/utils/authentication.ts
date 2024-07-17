import { NavigateFunction } from 'react-router-dom';

export const isAuthenticated = () => {
  const storageUser = localStorage.getItem('username');
  const storagePass = localStorage.getItem('password');

  return (
    storageUser !== '' &&
    storagePass !== '' &&
    storagePass !== null &&
    storageUser !== null
  );
};

export const handleLogOut = (
  navigate: NavigateFunction,
  setUserName: (u: string) => void,
  setPassWord: (p: string) => void
) => {
  localStorage.setItem('username', '');
  localStorage.setItem('password', '');
  localStorage.setItem('userid', '');
  setUserName('');
  setPassWord('');
  navigate('/login');
};
