import { User } from "../types/interfaces"

export const getUserNameById = (users: User[], id: number) : string => {
	const user = users.find((user) => user.id === id);
	return user ? user.name : 'unknown';
};

export const getIdByUserName = (users: User[], name: string) : number => {
	const user = users.find((user) => user.name === name);
	return user ? user.id : -1;
};