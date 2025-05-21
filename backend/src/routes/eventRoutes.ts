import { Router } from "express";
import { AppDataSource } from "../data-source";
import Event from '../entities/event.entity'

const router = Router();

router.get('/', async (req, res) => {
	const eventRepository = AppDataSource.getRepository(Event);
	const events = await eventRepository.find({ relations: ['expenses', 'expenses.participants', 'users'] });
	res.json(events);
});

router.post('/', async (req, res) => {
	const eventRepository = AppDataSource.getRepository(Event);
	console.log('Event before post req:', req.body);
	const newEvent = eventRepository.create(req.body);
	const result = await eventRepository.save(newEvent);
	res.json(result); 
});

export default router;