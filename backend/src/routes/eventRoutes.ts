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

router.delete('/:id', async (req, res) => {
	const eventRepository = AppDataSource.getRepository(Event);
	const { id } = req.params;

	try {
		const event = await eventRepository.findOne({ 
			where: {id: Number(id)},
			relations: [ 'users', 'expenses', 'expenses.participants', ],
		});
		if (!event) {
			res.status(404).json({ error: 'Event not found' });
			return ;
		}
		await eventRepository.remove(event);
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.error(error);
        res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;