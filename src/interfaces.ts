import React from 'react';
import Typography from '@mui/material';

export interface User {
	id: number;
	name: string;
	userName: string;
	password: string;
	balance: number;
}

export interface Expense {
	id: number;					
	description: string; 				// e.g., "Dinner with friends"
	amount: number; 					// Total amount of the expense
	paidBy: User;						// The user who paid the expense
	participants: User[];				// The users involved in the expense
	date: string;						// The date when the expense was made
}

export interface Transaction {
	id: number;
	expenseId: number;       			// Link to the Expense
	fromUser: User;          			// Who owes money
	toUser: User;            			// Who is receiving money
	amount: number;          			// Amount transferred
	status: 'pending' | 'completed'; 	// The status of the transaction
	date: string;            			// The date of the transaction
}


export interface DashboardSummary {
	totalOwed: number;    				// Total amount a user owes
	totalPaid: number;    				// Total amount a user has paid
	balance: number;      				// The user's current balance (could be positive or negative)
	recentTransactions: Transaction[];	// List of recent transactions
}

export interface Event {
	id: number;
	description: string;
	expenses: Expense[],
	users: User[];
	date: string;
}
