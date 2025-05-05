import { Expense } from "../types/interfaces";

export const getTotalSpent = (expenses: Expense[]): number => {
	return expenses.reduce((total, expense) => total + expense.amount, 0);
};

