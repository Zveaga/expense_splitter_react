import { Router } from "express";
import { AppDataSource } from "../data-source";
import Expense from '../entities/expense.entity'

const router = Router();

router.get('/', async (req, res) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const expenses = await expenseRepository.find({ relations: ['participants', 'paidBy'] });
	res.json(expenses);
});

router.post('/', async (req, res) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const newExpense = expenseRepository.create(req.body);
	const result = await expenseRepository.save(newExpense);
	res.json(result); 
});

export default router