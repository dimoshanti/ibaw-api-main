import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { red } from '@material-ui/core/colors';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SocketContext, socket } from './context/socket';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#06a3b8'
    },
    secondary: {
      main: '#ff7c04'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#ffffff'
    }
  },
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <ThemeProvider theme={theme}>
      <App />{' '}
    </ThemeProvider>
  </SocketContext.Provider>,
  document.getElementById('root')
);
