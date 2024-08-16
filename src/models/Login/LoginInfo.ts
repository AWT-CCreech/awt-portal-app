interface LoginInfo {
    userid: string,
    username: string,
    password: string,
    isPasswordEncrypted: boolean,
    token?: string
}

export default LoginInfo;