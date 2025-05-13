import { Router } from "express";
import { AppDataSource } from "../data-source";
import Event from '../entities/event.entity'

const router = Router();

router.get('/', async (req, res) => {
	const eventRepository = AppDataSource.getRepository(Event);
	const events = await eventRepository.find({ relations: ['expenses', 'users'] });
	res.json(events);
});

router.post('/', async (req, res) => {
	const eventRepository = AppDataSource.getRepository(Event);
	const newEvent = eventRepository.create(req.body);
	const result = await eventRepository.save(newEvent);
	res.json(result); 
});

export default router;