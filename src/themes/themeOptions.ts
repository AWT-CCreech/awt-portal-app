import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light', // 'mode' is used instead of 'type' in MUI v5
    primary: {
      main: '#06477d',
      light: '#376b97',
      dark: '#043157',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#78909c',
      light: '#93a6af',
      dark: '#54646d',
      contrastText: '#ffffff',
    },
    info: {
      main: '#90caf9',
      light: '#a6d4fa',
      dark: '#648dae',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    warning: {
      main: '#ff9800',
      dark: '#f57c00',
      light: '#ffac33',
      contrastText: 'rgba(0,0,0,0.87)',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.54)',
      disabled: 'rgba(0,0,0,0.38)',
    },
    error: {
      main: '#f44336',
      light: '#f6685e',
      dark: '#aa2e25',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#6fbf73',
      dark: '#357a38',
      contrastText: 'ffffff',
    },
    divider: 'rgba(0,0,0,0.12)',
  },
  typography: {
    fontSize: 14,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      },
    },
  },
};
