import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from "typeorm";
import User from "./user.entity";
import Expense from './expense.entity'

@Entity()
export default class Event {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	description: string = '';

	@OneToMany(() => Expense, (expense) => expense.event, { cascade: true, onDelete: 'CASCADE' })
    expenses?: Expense[];

	@OneToMany(() => User, (user) => user.events, { cascade: true, onDelete: 'CASCADE' })
    users!: User[];

    // @ManyToMany(() => User, (user) => user.events, { cascade: true, onDelete: "CASCADE" })
    // @JoinTable()
	// users!: User[];


	

	// @OneToMany(() => Expense, (expense) => expense.event)
	// @JoinTable()
	// expenses?: Expense[];

	// @ManyToMany(() => User, (user) => user.events)
	// @JoinTable()
	// users!: User[];


	// @Column()
	// date: Date = new Date();
}