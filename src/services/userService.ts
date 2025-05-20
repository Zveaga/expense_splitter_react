import axios from 'axios'
import { User } from '../types/interfaces';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = async ():Promise<User[]>  => {
	const response = await axios.get(API_URL);
	return response.data;
};

export const createUser = async (userData: {name: string}): Promise<User> => {
	const response = await axios.post(API_URL, userData);
	return response.data;
};

export const deleteUser = async (id: number) => {
	
}