export interface TokenRefreshRequest {
    token: string;         // expired JWT
    refreshToken: string;
}