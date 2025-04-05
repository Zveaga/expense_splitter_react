import React, { use, useState } from 'react'
import { Box, Modal, TextField, Button, Typography, useTheme } from "@mui/material";

interface LoginModalProps {
	open: boolean;
	handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose }) => {
	const theme = useTheme();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');


	const handleLogin = () => {
		if (username === '1' && password === '1') {		// ! To be replaced with real pass check
			alert('Login successful!');
			handleClose();
		} else {
			alert('Invalid login details!');
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			sx={{ display: 'flex', alignItems: "center", justifyContent: "center" }}	
		>
			<Box sx={{ background: theme.palette.primary.main, p: 4, boxShadow: 3, borderRadius: 2, width: 300 }}>
        		<Typography variant="h6" gutterBottom>Login</Typography>
        		<TextField fullWidth label="Email" margin="normal" onChange={(e) => setUsername(e.target.value)} />
        		<TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
        		<Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
        			Login
        		</Button>
      		</Box>
		</Modal>
	);
};

export default LoginModal;