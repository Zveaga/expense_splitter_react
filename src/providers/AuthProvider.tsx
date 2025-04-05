import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({ isAuthenticated: false, login: () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = () => setIsAuthenticated(true);
	const logout = () => setIsAuthenticated(false);

	/* 	For testing purposes only
		Final app will send a request to a backend API to validate authToken
	*/
	useEffect(() => {
		const authToken = localStorage.getItem('authToken');
		if (authToken) {
			setIsAuthenticated(true);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};