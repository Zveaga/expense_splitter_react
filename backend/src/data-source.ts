import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'coxer',
	password: 'test',
	database: 'expense_splitter',
	synchronize: true,
	logging: false,
	entities: ['src/entities/*.ts'],
});