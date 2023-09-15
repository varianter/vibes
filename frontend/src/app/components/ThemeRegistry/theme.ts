import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: [
      "Graphik-Regular", "Helvetica", "Arial"
    ].join(','),
    button: {
      textTransform: "none"
    }
  },
  palette: {
    mode: 'light',
    primary: {
        main: 'rgba(66, 61, 137, 1)',
        contrastText: "#fff"
    },
    secondary: {
        main: 'rgba(66, 61, 137, 1)',
    },
    action: {
      active: "white",
      selected: "68e9dd"
     
      //   active: string;
      //   hover: string;
      //   hoverOpacity: number;
      //   selected: string;
      //   selectedOpacity: number;
      //   disabled: string;
      //   disabledOpacity: number;
      //   disabledBackground: string;
      //   focus: string;
      //   focusOpacity: number;
      //   activatedOpacity: number;

    }
  }
});

export default theme;
