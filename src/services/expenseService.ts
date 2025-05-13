import axios from 'axios'

const API_URL = 'http://localhost:5000/api/expenses';

export const getExpenses = async () => {
	const response = await axios.get(API_URL);
	console.log('response from backend (expenses): ', response);
	return response.data;
}

export const createExpense = async (expenseData: {
	description: string;
    amount: number;
    participants: number[];
    paidBy: { userId: number; amount: number }[];
    eventId: number;
}) => {
	const response = await axios.post(API_URL, expenseData);
	console.log('expenseData sent to backend: ', response);

	return response.data;
}
