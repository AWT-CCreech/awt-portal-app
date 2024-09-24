export interface InactivityModalProps {
    open: boolean;
    countdown: number;
    onStayLoggedIn: () => void;
    onLogout: () => void;
}
  