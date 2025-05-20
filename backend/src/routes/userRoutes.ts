import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from '../entities/user.entity'

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const userRepository = AppDataSource.getRepository(User);
	const users = await userRepository.find();
	res.json(users);
});

router.post('/', async (req: Request, res: Response) => {
	const userRepository = AppDataSource.getRepository(User);
	const newUser = userRepository.create(req.body);
	const response = await userRepository.save(newUser);
	res.json(response); 
});

router.delete('/:id', async (req: Request, res: Response) => {
	const userRepository = AppDataSource.getRepository(User);
	const { id } = req.params;

	try {
		const user = await userRepository.findOne({ where: {id: Number(id) } });
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return ;
		}
		await userRepository.remove(user);
		res.status(200).json({ message: 'User deleted successfully' });

	} catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
	}	
});




export default router;