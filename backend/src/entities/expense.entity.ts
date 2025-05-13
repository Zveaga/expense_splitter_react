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

	@ManyToMany(() => User)
	@JoinTable()
	paidBy!: { userId: number, amount: number }[];

	@ManyToMany(() => User)
	@JoinTable()
	participants!: User[];

	@Column()
	date: Date = new Date();

	@ManyToOne(() => Event, (event: Event) => event.expenses)
    event!: Event;
}