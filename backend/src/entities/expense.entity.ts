import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import User from "./user.entity";
import Event from './event.entity'

@Entity()
export default class Expense {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	description: string = '';

	@Column()
	amount: number = 0;

	@Column('json')
	paidBy!: { userId: number; amount: number }[];

	@ManyToMany(() => User, (user) => user.expenses)
	@JoinTable()
	participants!: User[];

	@ManyToOne(() => Event, (event: Event) => event.expenses)
    event!: Event;
}