import React from 'react';

export interface User {
	id: number;
	name: string;
	// userName: string;
	// password: string;
}

export interface Expense {
	id: number;
	description: string;
	amount: number;
	paidBy: { userId: number, amount: number }[];
	participants: User[];
	date: Date;
}

export interface Transaction {
	id: number;
	expenseId: number;
	fromUser: User;
	toUser: User;
	amount: number;
	status: 'pending' | 'completed';
	date: string;
}


export interface DashboardSummary {
	totalOwed: number;
	totalPaid: number;
	balance: number;
	recentTransactions: Transaction[];
}

export interface Event {
	id: number;
	description: string;
	expenses: Expense[],
	users: User[];
	date: Date;
}
