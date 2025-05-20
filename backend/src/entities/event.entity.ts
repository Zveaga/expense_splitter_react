import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from "typeorm";
import User from "./user.entity";
import Expense from './expense.entity'

@Entity()
export default class Event {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	description: string = '';

	@OneToMany(() => Expense, (expense) => expense.event)
	@JoinTable()
	expenses?: Expense[];

	@ManyToMany(() => User, (user) => user.events)
	@JoinTable()
	users!: User[];

	// @Column()
	// date: Date = new Date();
}

