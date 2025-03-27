interface LoginInfo {
  userid: string;
  username: string;
  password: string;
  isPasswordEncrypted: boolean;
  token?: string;
  refreshToken?: string;
}

export default LoginInfo;
