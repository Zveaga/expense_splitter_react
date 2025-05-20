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

		// const participantEntities = await userRepository.find({ where: { id: In(participants) }, });
        // if (participantEntities.length !== participants.length) {
        //     res.status(400).json({ error: "Some participants do not exist" });
        //     return;
        // }

		const paidByUserIds = paidBy.map((entry: { userId: number }) => entry.userId);
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

        // Create and save the expense
        const newExpense = expenseRepository.create({
            description,
            amount,
            paidBy: paidBy,
            participants,
            event: eventEntity,
        });

		console.log('newExppense', newExpense);
		const result = await expenseRepository.save(newExpense);
		console.log('result', result);
		res.json(result); 
	} catch (error) {
		console.error(error);
        res.status(500).json({ error: "Internal server error" });
	}
});

export default router