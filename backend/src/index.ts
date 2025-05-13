import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import eventRoutes from './routes/eventRoutes'
import expenseRoutes from "./routes/expenseRoutes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
	.then(() => {
		console.log('Database connected');
		app.listen(5000, () => {
			console.log("Server running on http://localhost:5000");
		});
	})
	.catch((error) => console.log(error));

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/expenses', expenseRoutes);