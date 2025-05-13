import { Router } from "express";
import { AppDataSource } from "../data-source";
import User from '../entities/user.entity'

const router = Router();

router.get('/', async (req, res) => {
	const userRepository = AppDataSource.getRepository(User);
	const users = await userRepository.find();
	res.json(users);
});

router.post('/', async (req, res) => {
	const userRepository = AppDataSource.getRepository(User);
	const newUser = userRepository.create(req.body);
	const result = await userRepository.save(newUser);
	res.json(result); 
});

export default router;