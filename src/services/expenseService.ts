import axios from 'axios'
import { Expense, User } from '../types/interfaces';

const API_URL = 'http://localhost:5000/api/expenses';

export const getExpenses = async (): Promise<Expense[]> => {
	const response = await axios.get(API_URL);
	// console.log('response backend (expenses): ', response.data);
	return response.data;
}

export const createExpense = async (expenseData: {
	description: string;
    amount: number;
    participants: User[];
    paidBy: { userId: number; amount: number }[];
    eventId: number;
}): Promise<Expense> => {
	const response = await axios.post(API_URL, expenseData);
	console.log('response from backend (createExpense): ', response);
	return response.data;
}

export const deleteExpense = async (expenseId: number): Promise<void> => {
	try {
		const response = await axios.delete(`${API_URL}/${expenseId}`);
		console.log('response backend (deleteExpense): ', response);
	} catch (error) {
		console.error('Error deleting expense:', error);
		throw error;
	}
}
