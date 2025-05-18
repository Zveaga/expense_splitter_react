import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Expense from '../entities/expense.entity'
import User from "../entities/user.entity";
import Event from "../entities/event.entity";

const router = Router();

router.get('/', async (req, res) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const expenses = await expenseRepository.find({ relations: ['participants',] });
	res.json(expenses);
});

router.post('/', async (req: Request, res: Response) => {
	const expenseRepository = AppDataSource.getRepository(Expense);
	const userRepository = AppDataSource.getRepository(User);
	const eventRepository = AppDataSource.getRepository(Event);

	try {
        const { description, amount, paidBy, participants, eventId } = req.body;
		// Resolve participants to User entities
		const participantEntities = await userRepository.findByIds(participants);
		// if (participantEntities.length !== participants.length) {
		// 	return res.status(400).json({ error: "Some participants do not exist" });
		// }
		if (!participantEntities) {
			throw new Error("Some participants do not exist");
		}
		

		// Resolve the event
		// const eventEntity = await eventRepository.findOne({ where: { id: Number(eventId) } });
		// console.log("eventId:", eventId);
		// console.log("eventEntity:", eventEntity);

		// if (!eventEntity) {
		// 	throw new Error("Event does not exist");
		// }

        // Create and save the expense
        const newExpense = expenseRepository.create({
            description,
            amount,
            paidBy,
            participants: participantEntities,
            // event: eventEntity,
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