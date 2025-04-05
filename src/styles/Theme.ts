import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
	  mode: 'dark', // Dark mode
	  primary: {
		main: '#757575', // Grey as the primary color
	  },
	  secondary: {
		main: '#9e9e9e', // Light grey for secondary
	  },
	  background: {
		default: '#212121', // Dark grey background
		paper: '#303030',   // Darker grey for paper surfaces (e.g. cards)
	  },
	  text: {
		primary: '#e0e0e0', // Light grey text color
		secondary: '#bdbdbd', // Slightly darker grey for secondary text
	  },
	},
	typography: {
	  fontFamily: 'Roboto, sans-serif', // Default font
	},
	spacing: 8,
  })

export default theme;
