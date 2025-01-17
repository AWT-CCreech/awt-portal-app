import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

class UserInfo {
  username: string = '';
  password: string = '';
  token: string = '';
  userid: string = '';
  expiresAt: number = 0;

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage(); // Load from local storage on initialization
  }

  setUserName = (u: string) => {
    this.username = u;
    localStorage.setItem('username', u); // Keep local storage in sync
  };

  setPassWord = (p: string) => {
    this.password = p;
    localStorage.setItem('password', p); // Keep local storage in sync
  };

  setToken = (t: string) => {
    this.token = t;
    localStorage.setItem('token', t); // Sync with local storage
  };

  setUserId = (id: string) => {
    this.userid = id;
    localStorage.setItem('userid', id); // Sync with local storage
  };

  setExpiresAt = (exp: number) => {
    this.expiresAt = exp;
    localStorage.setItem('expiresAt', exp.toString()); // Sync with local storage
  };

  loadFromLocalStorage() {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userid');
    const storedExpiresAt = localStorage.getItem('expiresAt');

    if (storedUsername) this.setUserName(storedUsername);
    if (storedPassword) this.setPassWord(storedPassword);
    if (storedToken) this.setToken(storedToken);
    if (storedUserId) this.setUserId(storedUserId);
    if (storedExpiresAt) this.setExpiresAt(parseInt(storedExpiresAt, 10));
  }

  clearUserInfo = () => {
    this.setUserName('');
    this.setPassWord('');
    this.setToken('');
    this.setUserId('');
    this.setExpiresAt(0);
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('expiresAt');
  };
}

export default createContext(new UserInfo());
