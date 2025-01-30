import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, useTheme } from '@mui/material';
import LoginModal from '../pages/Login.tsx'

const Navigation: React.FC = () => {
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const theme = useTheme(); // Get the current theme
	
	return (
	  <>
		<AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
		  <Toolbar>
			<Box sx={{ flexGrow: 1, display: "flex", gap: 3 }}>
			  <Button
				component={Link}
				to="/"
				sx={{
				  color: theme.palette.common.white,
				  "&:hover": { color: theme.palette.secondary.main },
				}}
			  >
				Home
			  </Button>
			  <Button
				component={Link}
				to="/dashboard"
				sx={{
				  color: theme.palette.common.white,
				  "&:hover": { color: theme.palette.secondary.main },
				}}
			  >
				Dashboard
			  </Button>
			  <Button
				onClick={() => setLoginModalOpen(true)}
				sx={{
				  color: theme.palette.common.white,
				  "&:hover": { color: theme.palette.secondary.main },
				}}
			  >
				Login
			  </Button>
			</Box>
		  </Toolbar>
		</AppBar>
  
		<LoginModal open={loginModalOpen} handleClose={() => setLoginModalOpen(false)} />
	  </>
	);
  };

//   const Navigation: React.FC = () => {
// 	return (
// 	  <nav>
// 		<ul>
// 		  <li><Link to="/">Home</Link></li>
// 		  <li><Link to="/login">Login</Link></li>
// 		  <li><Link to="/dashboard">Dashboard</Link></li>
// 		</ul>
// 	  </nav>
// 	);
//   };

export default Navigation;
