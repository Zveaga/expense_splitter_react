import axios from 'axios'
import { Event, Expense, User } from '../types/interfaces';

const API_URL = 'http://localhost:5000/api/events';

export const getEvents = async () => {
	const response = await axios.get(API_URL);
	console.log('response backend (getEvents): ', response);
	return response.data;
}; 

export const createEvent = async (eventData: {
	description: string;
	expenses: Expense[],
	users: User[];
}): Promise<Event> => {
	const response = await axios.post(API_URL, eventData);
	console.log('response backend (createEvent): ', response);
	return response.data;
};