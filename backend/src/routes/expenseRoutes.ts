import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Expense from '../entities/expense.entity'
import User from "../entities/user.entity";
import Event from "../entities/event.entity";
import { In } from "typeorm";

const router = Router();

router.get('/', async (req, res) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const expenses = await expenseRepository.find({ relations: ['participants', 'event'] });
	res.json(expenses);
});

router.post('/', async (req: Request, res: Response) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const userRepository = AppDataSource.getRepository(User);
	const eventRepository = AppDataSource.getRepository(Event);

	console.log('Expense before post req:', req.body);

	try {
		const { description, amount, paidBy, participants, eventId } = req.body;
		if (!description || !amount || !paidBy || !participants || !eventId) {
			res.status(400).json({ error: "Missing required fields to create expense" });
			return;
        }

		const paidByUserIds = paidBy.map((data: { userId: number }) => data.userId);
		const paidByUsers = await userRepository.find({ where: { id: In(paidByUserIds) } });

		if (paidByUsers.length !== paidByUserIds.length) {
		    res.status(400).json({ error: "Some users in paidBy do not exist" });
		    return;
		}

		const eventEntity = await eventRepository.findOne({ where: { id: Number(eventId) } });
		// console.log("eventId:", eventId);
		console.log("eventEntity:", eventEntity);

		if (!eventEntity) {
			res.status(400).json({ error: "Event does not exist" });
			return;
		}

        const newExpense = expenseRepository.create({
            description,
            amount,
            paidBy,
            participants,
            event: eventEntity,
        });

		const result = await expenseRepository.save(newExpense);
		console.log('newExppense', result);
		// console.log('result', result);
		res.json(result); 
	} catch (error) {
		console.error(error);
        res.status(500).json({ error: "Internal server error" });
	}
});


router.delete('/:id', async (req, res) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const { id } = req.params;

	try {
		const expense = await expenseRepository.findOne({ 
			where: {id: Number(id)},
			relations: ['participants', 'event'],
		});
		if (!expense) {
			res.status(400).json({ error: "Expense does not exist" });
			return;
		}

		await expenseRepository.remove(expense);
		res.status(200).json({ message: 'Expense deleted successfully' })
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}

});


export default router